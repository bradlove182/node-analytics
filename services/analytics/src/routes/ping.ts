import { FastifyPluginCallback } from "fastify";

export const ping: FastifyPluginCallback = (fastify, _, done) => {
    fastify.get("/ping", async (request) => {
        return { success: "pong" };
    });

    done();
};
