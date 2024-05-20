import { db } from "@api/database";
import { Redis } from "@api/redis";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const middleware = fp(async (fastify: FastifyInstance) => {
    fastify.addHook("onRequest", async (request) => {
        request.db = db;
        request.redis = Redis;
    });
});

export { middleware };
