import type { FastifyPluginCallback } from "fastify"
import { teamCreateRoute } from "./create"
import { teamRoute } from "./team"
import { teamsRoute } from "./teams"

export const teamRoutes: FastifyPluginCallback = (server, _, done) => {
    server.register(teamRoute)
    server.register(teamsRoute)
    server.register(teamCreateRoute)
    done()
}
