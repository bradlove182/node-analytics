import type { FastifyPluginCallback } from "fastify"
import { organizationCreateRoute } from "./create"

export const organizationRoutes: FastifyPluginCallback = (server, _, done) => {
    server.register(organizationCreateRoute)
    done()
}
