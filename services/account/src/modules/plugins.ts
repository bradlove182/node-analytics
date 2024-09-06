import { Redis } from "@api/redis"
import cors from "@fastify/cors"
import formBody from "@fastify/formbody"
import { fastifyHelmet } from "@fastify/helmet"
import fastifyRateLimit from "@fastify/rate-limit"
import fp from "fastify-plugin"

export const plugins = fp(async (server) => {
    server.register(cors, {
        maxAge: 600,
        origin: true,
        credentials: true,
    })
    server.register(fastifyRateLimit, {
        global: true,
        max: 3000,
        allowList: ["localhost", "127.0.0.1"],
        redis: Redis.redis,
    })
    server.register(formBody)
    server.register(fastifyHelmet, {
        global: true,
    })
})
