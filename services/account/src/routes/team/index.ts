import type { FastifyPluginCallback } from "fastify"
import { teamCreateRoute } from "./create"

export const teamRoutes: FastifyPluginCallback = (server, _, done) => {
    server.register(teamCreateRoute)
    done()
}
