import { events } from "@api/database/schemas";
import type { FastifyPluginCallback } from "fastify";

export const testRoutes: FastifyPluginCallback = (fastify, _, done) => {
    fastify.get("/", async (request) => {
        const response = await request.db
            .insert(events)
            .values({
                domain: request.hostname,
            })
            .returning();
        return { success: response };
    });

    done();
};
