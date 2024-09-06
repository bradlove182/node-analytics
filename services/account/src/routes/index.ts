import type { FastifyPluginCallback } from "fastify"

import { authRoutes } from "./auth"
import { organizationRoutes } from "./organization"
import { testRoutes } from "./test"
import { usersRoutes } from "./users"

export const routes: FastifyPluginCallback = (server, _, done) => {
    server.register(testRoutes, {
        prefix: `/test`,
    })
    server.register(authRoutes, {
        prefix: `/auth`,
    })
    server.register(usersRoutes, {
        prefix: `/users`,
    })
    server.register(organizationRoutes, {
        prefix: `/organization`,
    })
    done()
}
