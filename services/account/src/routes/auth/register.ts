import type { FastifyPluginCallback, FastifySchema } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { passwordTable, userTable } from "@api/database/schemas"
import { createSession, createSessionCookie, generateSessionToken, hashPassword } from "@api/lib/auth"
import { generateIdFromEntropySize } from "@api/lib/crypto"
import pg from "pg"
import { z } from "zod"

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
        { schema },
        async (request, reply) => {
            const { db, body } = request
            const { email, password } = body

            const passwordHash = await hashPassword(password)

            const userId = generateIdFromEntropySize(10)
            const passwordId = generateIdFromEntropySize(10)

            try {
                await db.transaction(async (tx) => {
                    await tx.insert(userTable).values({
                        id: userId,
                        email,
                        createdAt: new Date(),
                    })
                    await tx.insert(passwordTable).values({
                        id: passwordId,
                        userId,
                        passwordHash,
                        createdAt: new Date(),
                    })
                })

                const token = generateSessionToken()

                await createSession(token, userId)

                reply.header("set-cookie", createSessionCookie(token))

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
