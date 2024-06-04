import { FastifyPluginCallback } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { alphabet, generateRandomString } from "oslo/crypto";
import z from "zod";

export const userRoutes: FastifyPluginCallback = (server, _, done) => {
    server.withTypeProvider<ZodTypeProvider>().post(
        "/",
        {
            config: {
                rateLimit: {
                    max: 3,
                    timeWindow: "1 minute",
                },
            },
            schema: {
                body: z.object({
                    id: z.coerce.string().uuid("Invalid User Id"),
                }),
                response: {
                    200: z.object({
                        status: z.literal(200),
                        success: z.boolean(),
                        message: z.string(),
                    }),
                },
            },
        },
        async (request, response) => {
            const { body, redis } = request;

            const id = body.id;

            const session = generateRandomString(256, alphabet("a-z", "0-9"));

            await redis.set(`session:${id}`, session);

            response.headers({
                "set-cookie": `session: ${session}`,
            });

            return response.status(200).send({
                status: 200,
                success: true,
                message: "Session created successfully",
            });
        }
    );

    done();
};
