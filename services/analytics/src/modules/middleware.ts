import { db } from "@api/database"
import fp from "fastify-plugin"
import type { FastifyInstance } from "fastify"

const middleware = fp(async (fastify: FastifyInstance) => {
    fastify.addHook("onRequest", async (request) => {
        request.db = db
    })
})

export { middleware }
