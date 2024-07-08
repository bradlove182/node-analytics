import { FastifyPluginCallback, FastifySchema } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

const schema = {
    body: z.object({
        email: z
            .string({
                message: "Email is required",
            })
            .email("Invalid email"),
        password: z
            .string({
                message: "Password is required",
            })
            .min(8, "Password must be at least 8 characters"),
    }),
    response: {
        200: z.object({
            status: z.literal(200),
            success: z.boolean(),
            message: z.string(),
        }),
    },
} satisfies FastifySchema;

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
        async (request, response) => {
            response.status(200).send({
                status: 200,
                success: true,
                message: "Login successful",
            });
        }
    );

    done();
};
