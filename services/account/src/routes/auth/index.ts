import type { FastifyPluginCallback } from "fastify"
import { loginRoute } from "./login"
import { registerRoute } from "./register"

export const authRoutes: FastifyPluginCallback = (server, _, done) => {
    server.register(loginRoute)
    server.register(registerRoute)
    done()
}
