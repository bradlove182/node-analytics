import type { FastifyPluginCallback } from "fastify"
import { userRoute } from "./user"
import { usersRoute } from "./users"

export const usersRoutes: FastifyPluginCallback = (server, _, done) => {
    server.register(userRoute)
    server.register(usersRoute)
    done()
}
