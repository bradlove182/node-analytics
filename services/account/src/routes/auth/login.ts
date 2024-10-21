import type { FastifyPluginCallback, FastifySchema } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { verify } from "@node-rs/argon2"
import { eq } from "drizzle-orm"
import { z } from "zod"

const schema = {
    body: z.object({
        email: z
            .string({
                message: "Email is required",
            })
            .email("Invalid email"),
        password: z.string({
            message: "Password is required",
        }),
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

export const loginRoute: FastifyPluginCallback = (server, _, done) => {
    server.withTypeProvider<ZodTypeProvider>().post(
        "/login",
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
            const { body, db, auth } = request
            const { email, password } = body

            const user = await db.query.userTable.findFirst({
                where: userTable => eq(userTable.email, email),
                with: {
                    password: true,
                },
            })

            if (!user || !user.password) {
                return reply.code(400).send({
                    statusCode: 400,
                    success: false,
                    message: "Invalid email or password",
                })
            }

            const validPassword = await verify(user.password.password_hash, password, {
                memoryCost: 19456,
                timeCost: 2,
                outputLen: 32,
                parallelism: 1,
            })

            if (!validPassword) {
                return reply.code(400).send({
                    statusCode: 400,
                    success: false,
                    message: "Invalid email or password",
                })
            }

            const token = auth.generateSessionToken()

            await auth.createSession(token, user.id)

            reply.setCookie(auth.getSessionCookieName(), token, {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
            })

            reply.code(200).send({
                statusCode: 200,
                success: true,
                message: "Login successful",
            })
        },
    )

    done()
}
