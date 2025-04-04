import type { User } from "@api/database"
import type { FastifyPluginCallback, FastifySchema } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { getUserById } from "@api/lib/user"
import { eq } from "drizzle-orm"
import { z } from "zod"

const schema = {
    params: z.object({
        userId: z.string({
            message: "User ID is required",
        }),
    }),
    response: {
        200: z.object({
            statusCode: z.literal(200),
            success: z.boolean(),
            data: z.custom<User>(),
        }),
        400: z.object({
            statusCode: z.literal(400),
            success: z.boolean(),
            error: z.string(),
        }),
    },
} satisfies FastifySchema

export const userRoute: FastifyPluginCallback = (server, _, done) => {
    server.withTypeProvider<ZodTypeProvider>().get(
        "/:userId",
        { schema },
        async (request, reply) => {
            const { params } = request
            const { userId } = params

            const user = await getUserById(userId)

            if (!user) {
                return reply.code(400).send({
                    statusCode: 400,
                    success: false,
                    error: "User not found",
                })
            }

            return reply.code(200).send({
                statusCode: 200,
                success: true,
                data: user,
            })
        },
    )

    done()
}
