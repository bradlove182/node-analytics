import process from "node:process"
import { initializeDatabase } from "@api/database"
import { handlers } from "@api/modules/handlers"
import { middleware } from "@api/modules/middleware"
import { plugins } from "@api/modules/plugins"
import { Redis } from "@api/redis"
import { routes } from "@api/routes"
import { Logger } from "@api/utils"
import { env } from "@repo/environment"
import { fastify } from "fastify"
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"

const API_VERSION = "v1"

export function buildServer() {
    const server = fastify({
        bodyLimit: 1_000_000,
        trustProxy: true,
    })

    server.setValidatorCompiler(validatorCompiler)
    server.setSerializerCompiler(serializerCompiler)

    server.register(plugins)
    server.register(handlers)
    server.register(middleware)
    server.register(routes, {
        prefix: `/${API_VERSION}`,
    })

    return server
}

export async function startServer() {
    const server = buildServer()

    await initializeDatabase()
    await Redis.initialize()

    try {
        await server.listen({ host: env.ACCOUNT_HOST, port: env.ACCOUNT_PORT })
        Logger.info("Start", `Server listening at ${env.ACCOUNT_PORT}`)
    }
    catch (error) {
        if (error instanceof Error) {
            Logger.error("Start", error.message)
            if (error.stack) {
                Logger.error("Start", error.stack)
            }
        }
        server.log.error(error)
        process.exit(1)
    }

    return server
}
