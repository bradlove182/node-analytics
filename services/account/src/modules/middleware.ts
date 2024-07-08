import { lucia } from "@api/auth";
import { db } from "@api/database";
import { Redis } from "@api/redis";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { verifyRequestOrigin } from "lucia";

const middleware = fp(async (fastify: FastifyInstance) => {
    // Add request objects
    fastify.addHook("onRequest", async (request) => {
        request.db = db;
        request.redis = Redis;
        request.auth = lucia;
    });

    // Verify request origin
    fastify.addHook("onRequest", async (request, response) => {
        if (request.method === "GET") {
            return;
        }

        const originHeader = request.headers.origin;
        const hostHeader = request.headers.host;
        if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
            return response.status(403).send("Forbidden");
        }
    });
});

export { middleware };
