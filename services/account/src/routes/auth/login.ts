import { verify } from "@node-rs/argon2"
import { eq } from "drizzle-orm"
import { z } from "zod"
import type { FastifyPluginCallback, FastifySchema } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { passwordTable, userTable } from "@api/database/schemas"

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

            const result = await db
            .select({ user: userTable, password: passwordTable })
            .from(userTable)
            .innerJoin(passwordTable, eq(userTable.id, passwordTable.userId))
            .where(eq(userTable.email, email))

            const { user, password: storedPassword } = result[0]!

            if (!user) {
                return reply.code(400).send({
                    statusCode: 400,
                    success: false,
                    message: "Invalid email or password",
                })
            }

            const validPassword = await verify(storedPassword.password_hash, password, {
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
            auth.setSessionTokenCookie(reply, token)

            reply.code(200).send({
                statusCode: 200,
                success: true,
                message: "Login successful",
            })
        },
    )

    done()
}
