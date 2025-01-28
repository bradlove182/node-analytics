import type { Team } from "@api/database"
import type { FastifyPluginCallback, FastifySchema } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { getTeams } from "@api/lib/team"
import { z } from "zod"

const schema = {
    response: {
        200: z.object({
            statusCode: z.literal(200),
            success: z.boolean(),
            data: z.custom<Team[]>(),
        }),
        400: z.object({
            statusCode: z.literal(400),
            success: z.boolean(),
            message: z.string(),
        }),
    },
} satisfies FastifySchema

export const teamsRoute: FastifyPluginCallback = (server, _, done) => {
    server.withTypeProvider<ZodTypeProvider>().get(
        "/",
        { schema },
        async (_, reply) => {
            const teams = await getTeams()

            return reply.code(200).send({
                statusCode: 200,
                success: true,
                data: teams,
            })
        },
    )

    done()
}
