import type { FastifyInstance } from "fastify"
import { db } from "@api/database"
import { Redis } from "@api/redis"
import { verifyRequestOrigin } from "@api/utils"
import fp from "fastify-plugin"

const allowedHosts = ["127.0.0.1", "localhost"]

const middleware = fp(async (fastify: FastifyInstance) => {
    // Add request objects
    fastify.addHook("onRequest", async (request) => {
        request.db = db
        request.redis = Redis
    })

    // Verify request origin
    fastify.addHook("onRequest", async (request, response) => {
        if (request.method === "GET") {
            return
        }

        const originHeader = request.headers.origin
        const hostHeader = request.headers.host

        if (!originHeader || !hostHeader) {
            request.log.warn("Missing origin or host header")
            return response.status(403).send({
                error: "Forbidden",
                message: "Missing required headers",
            })
        }

        if (!verifyRequestOrigin(originHeader, allowedHosts)) {
            request.log.warn(`Invalid origin: ${originHeader}`)
            return response.status(403).send({
                error: "Forbidden",
                message: "Invalid origin",
            })
        }
    })
})

export { middleware }
