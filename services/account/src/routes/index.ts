import { FastifyPluginCallback } from "fastify";

import { authRoutes } from "./auth";
import { testRoutes } from "./test";
import { usersRoutes } from "./users";

export const routes: FastifyPluginCallback = (server, _, done) => {
    server.register(testRoutes, {
        prefix: `/test`,
    });
    server.register(authRoutes, {
        prefix: `/auth`,
    });
    server.register(usersRoutes, {
        prefix: `/users`,
    });
    done();
};
