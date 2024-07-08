import type { FastifyPluginCallback } from "fastify";
import { generateRandomInteger } from "oslo/crypto";

export const testRoutes: FastifyPluginCallback = (fastify, _, done) => {
    fastify.get(
        "/",
        {
            config: {
                rateLimit: {
                    allowList: ["127.0.0.1"],
                },
            },
        },
        async () => {
            return { test: generateRandomInteger(10) };
        }
    );

    done();
};
