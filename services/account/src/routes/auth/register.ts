import { passwordTable, userTable } from "@api/database/schemas"
import { hash } from "@node-rs/argon2"
import { generateIdFromEntropySize } from "lucia"
import pg from "pg"
import { z } from "zod"
import type { FastifyPluginCallback, FastifySchema } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"

const schema = {
    body: z.object({
        email: z
            .string({
                message: "Email is required",
            })
            .email("Invalid email")
            .describe("User's Email address"),
        password: z
            .string({
                message: "Password is required",
            })
            .min(8, "Password must be at least 8 characters")
            .describe("User's Password"),
    }),
    response: {
        200: z.object({
            statusCode: z.literal(200),
            success: z.boolean(),
            message: z.string(),
        }),
        400: z.object({
            statusCode: z.literal(400),
            success: z.boolean(),
            message: z.string(),
        }),
    },
} satisfies FastifySchema

export const registerRoute: FastifyPluginCallback = (server, _, done) => {
    server.withTypeProvider<ZodTypeProvider>().post(
        "/register",
        {
            config: {
                rateLimit: {
                    max: 3,
                    timeWindow: "1 minute",
                },
            },
            schema,
        },
        async (request, reply) => {
            const { db, body, auth } = request
            const { email, password } = body

            const passwordHash = await hash(password, {
                memoryCost: 19456,
                timeCost: 2,
                outputLen: 32,
                parallelism: 1,
            })

            const userId = generateIdFromEntropySize(10)
            const passwordId = generateIdFromEntropySize(10)

            try {
                await Promise.all([
                    db.insert(userTable).values({
                        id: userId,
                        email,
                        createdAt: new Date(),
                    }),
                    db.insert(passwordTable).values({
                        id: passwordId,
                        userId,
                        password_hash: passwordHash,
                        createdAt: new Date(),
                    }),
                ])

                const session = await auth.createSession(userId, {})
                const sessionCookie = auth.createSessionCookie(session.id)

                reply.headers({
                    "Set-Cookie": sessionCookie.serialize(),
                })

                return reply.code(200).send({
                    statusCode: 200,
                    success: true,
                    message: "Registration successful",
                })
            }
            catch (error) {
                if (error instanceof pg.DatabaseError) {
                    if ((error.constraint === "user_email_unique")) {
                        return reply.code(400).send({
                            statusCode: 400,
                            success: false,
                            message: "Email already exists",
                        })
                    }
                }

                throw error
            }
        },
    )

    done()
}
