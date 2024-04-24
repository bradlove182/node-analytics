import type { FastifyPluginCallback } from "fastify";

export const testRoutes: FastifyPluginCallback = (fastify, _, done) => {
    fastify.get("/", async (request) => {
        const response = await request.client.auth.signInAnonymously();
        return { success: response };
    });

    done();
};
