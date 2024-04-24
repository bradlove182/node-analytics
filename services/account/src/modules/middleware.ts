import { client } from "@api/client";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

const middleware = fp(async (fastify: FastifyInstance) => {
    fastify.addHook("onRequest", async (request) => {
        request.client = client;
    });
});

export { middleware };
