import { organizationTable } from "@api/database/schemas";
import { Organization } from "@api/database/types";
import { FastifyPluginCallback, FastifySchema } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { generateIdFromEntropySize } from "lucia";
import { z } from "zod";

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
            data: z.custom<Organization>(),
        }),
        400: z.object({
            statusCode: z.literal(400),
            success: z.boolean(),
            message: z.string(),
        }),
    },
} satisfies FastifySchema;

export const organizationCreateRoute: FastifyPluginCallback = (server, _, done) => {
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
            const { body, db } = request;
            const { name } = body;

            try {
                const id = generateIdFromEntropySize(10);

                const organizations = await db
                    .insert(organizationTable)
                    .values({ name, id })
                    .returning();

                const organization = organizations.find((organization) => organization.id === id)!;

                reply.code(200).send({
                    statusCode: 200,
                    success: true,
                    data: organization,
                });
            } catch (error) {
                throw error;
            }
        }
    );

    done();
};
