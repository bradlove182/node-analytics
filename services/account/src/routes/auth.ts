import { usersTable } from "@api/database/schemas";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { FastifyPluginCallback } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

// Schema for inserting a user - can be used to validate API requests
export const insertUserSchema = createInsertSchema(usersTable);
// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(usersTable);

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
        async () => {
            return { route: "/" };
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
