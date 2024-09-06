import process from "node:process"
import { initializeDatabase } from "@api/database"
import { middleware } from "@api/modules/middleware"
import { getTest } from "@api/routes"
import { eventDataRoute, sessionEventDataRoute, websiteEventRoute } from "@api/routes/create"
import { Logger } from "@api/utils"
import cors from "@fastify/cors"
import { env } from "@repo/environment"
import { fastify } from "fastify"

const API_VERSION = "v1"

export async function start() {
    const server = fastify({
        bodyLimit: 1_000_000,
        trustProxy: true,
        logger: true,
    })

    await initializeDatabase()

    server.register(middleware)
    server.register(cors, {
        maxAge: 600,
        origin: true,
        credentials: true,
    })

    server.register(eventDataRoute, {
        prefix: `/${API_VERSION}/create/event-data`,
    })

    server.register(websiteEventRoute, {
        prefix: `/${API_VERSION}/create/website-events`,
    })

    server.register(sessionEventDataRoute, {
        prefix: `/${API_VERSION}/create/session-events`,
    })

    server.register(getTest, {
        prefix: `/${API_VERSION}/`,
    })

    try {
        await server.listen({ host: env.ANALYTICS_HOST, port: env.ANALYTICS_PORT })
        Logger.info("Start", `Server listening at ${env.ANALYTICS_PORT}`)
    }
    catch (error) {
        if (error instanceof Error) {
            Logger.error("Start", error.message)
        }
        server.log.error(error)
        process.exit(1)
    }
}

start()
