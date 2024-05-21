import type { FastifyPluginCallback } from "fastify";

export const testRoutes: FastifyPluginCallback = (fastify, _, done) => {
    fastify.get("/", async () => {
        return { success: true };
    });

    done();
};
