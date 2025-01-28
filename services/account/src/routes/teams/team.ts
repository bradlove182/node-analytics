import type { Team } from "@api/database"
import type { FastifyPluginCallback, FastifySchema } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { getTeam } from "@api/lib/team"
import { z } from "zod"

const schema = {
    params: z.object({
        teamId: z.string(),
    }),
    response: {
        200: z.object({
            statusCode: z.literal(200),
            success: z.boolean(),
            data: z.custom<Team>(),
        }),
        400: z.object({
            statusCode: z.literal(400),
            success: z.boolean(),
            message: z.string(),
        }),
    },
} satisfies FastifySchema

export const teamRoute: FastifyPluginCallback = (server, _, done) => {
    server.withTypeProvider<ZodTypeProvider>().get(
        "/:teamId",
        { schema },
        async (request, reply) => {
            const { params } = request
            const { teamId } = params

            const team = await getTeam(teamId)

            if (!team) {
                return reply.code(400).send({
                    message: "No team with a matching id.",
                    statusCode: 400,
                    success: false,
                })
            }

            return reply.code(200).send({
                statusCode: 200,
                success: true,
                data: team,
            })
        },
    )

    done()
}
