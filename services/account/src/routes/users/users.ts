import type { User } from "@api/database"
import type { FastifyPluginCallback, FastifySchema } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { z } from "zod"

const schema = {
    response: {
        200: z.object({
            statusCode: z.literal(200),
            success: z.boolean(),
            data: z.custom<User>().array(),
            error: z.undefined(),
        }),
        400: z.object({
            statusCode: z.literal(400),
            success: z.boolean(),
            data: z.undefined(),
            error: z.string(),
        }),
    },
} satisfies FastifySchema

export const usersRoute: FastifyPluginCallback = (server, _, done) => {
    server.withTypeProvider<ZodTypeProvider>().get(
        "/",
        { schema },
        async (request, reply) => {
            const { db } = request

            const user = await db.query.userTable.findMany()

            return reply.code(200).send({
                statusCode: 200,
                success: true,
                data: user,
                error: undefined,
            })
        },
    )

    done()
}
