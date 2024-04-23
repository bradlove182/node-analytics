import { db } from "@api/database";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const middleware = fp(async (fastify: FastifyInstance) => {
    fastify.addHook("onRequest", async (request) => {
        request.db = db;
    });
});

export { middleware };
