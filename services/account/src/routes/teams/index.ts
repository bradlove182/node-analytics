import type { FastifyPluginCallback } from "fastify"
import { teamCreateRoute } from "./create"
import { teamRoute } from "./team"

export const teamRoutes: FastifyPluginCallback = (server, _, done) => {
    server.register(teamRoute)
    server.register(teamCreateRoute)
    done()
}
