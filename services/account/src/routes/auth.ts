import { AuthApiError, isAuthApiError } from "@supabase/supabase-js";
import { FastifyPluginCallback } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const authRoutes: FastifyPluginCallback = (fastify, _, done) => {
    fastify.withTypeProvider<ZodTypeProvider>().get(
        "/login",
        {
            schema: {
                querystring: z.object({
                    email: z.coerce.string().email(),
                }),
            },
        },
        async (request, response) => {
            const email = request.query.email;

            const { data, error } = await request.client.auth.signInWithOtp({
                email,
            });

            if (error && isAuthApiError(error)) {
                return response.code(error.status).send(error.message);
            }

            return data;
        }
    );

    done();
};
