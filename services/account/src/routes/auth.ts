import { isAuthApiError } from "@supabase/supabase-js";
import { FastifyPluginCallback } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const authRoutes: FastifyPluginCallback = (fastify, _, done) => {
    fastify.withTypeProvider<ZodTypeProvider>().post(
        "/login",
        {
            schema: {
                body: z.object({
                    email: z.coerce.string().email(),
                    redirect: z.coerce.string().url().optional(),
                }),
            },
        },
        async (request, response) => {
            const { email, redirect } = request.body;

            const { data, error } = await request.client.auth.signInWithOtp({
                email,
                options: {
                    emailRedirectTo: redirect,
                },
            });

            if (error && isAuthApiError(error)) {
                return response.code(error.status).send(error);
            }

            return data;
        }
    );

    fastify.withTypeProvider<ZodTypeProvider>().get(
        "/callback",
        {
            schema: {
                querystring: z.object({}),
            },
        },
        async (request) => {
            return {
                url: request.url,
            };
        }
    );

    done();
};
