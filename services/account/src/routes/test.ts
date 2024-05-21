import type { FastifyPluginCallback } from "fastify";
import { generateRandomInteger } from "oslo/crypto";

export const testRoutes: FastifyPluginCallback = (fastify, _, done) => {
    fastify.get("/", async () => {
        return { test: generateRandomInteger(10) };
    });

    done();
};
