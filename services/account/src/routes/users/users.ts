import { type User } from "@api/database/types";
import { FastifyPluginCallback, FastifySchema } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

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
} satisfies FastifySchema;

export const usersRoute: FastifyPluginCallback = (server, _, done) => {
    server.withTypeProvider<ZodTypeProvider>().get(
        "/",
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
            const { db } = request;

            try {
                const user = await db.query.user.findMany();

                return reply.code(200).send({
                    statusCode: 200,
                    success: true,
                    data: user,
                    error: undefined,
                });
            } catch (error) {
                throw error;
            }
        }
    );

    done();
};
