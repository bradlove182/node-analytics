import type { Team } from "@api/database"
import type { FastifyPluginCallback, FastifySchema } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import { teamTable } from "@api/database/schemas"
import { generateIdFromEntropySize } from "@api/lib/crypto"
import { createTeam } from "@api/lib/team"
import { z } from "zod"

const schema = {
    body: z.object({
        name: z.string({
            message: "Name is required",
        }),
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

export const teamCreateRoute: FastifyPluginCallback = (server, _, done) => {
    server.withTypeProvider<ZodTypeProvider>().post(
        "/create",
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
            const { body } = request
            const { name } = body

            const id = generateIdFromEntropySize(10)

            const team = await createTeam({
                id,
                name,
                createdAt: new Date(),
            })

            reply.code(200).send({
                statusCode: 200,
                success: true,
                data: team,
            })
        },
    )

    done()
}
