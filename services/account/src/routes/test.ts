import { eq } from "drizzle-orm"
import type { FastifyPluginCallback } from "fastify"

export const testRoutes: FastifyPluginCallback = (fastify, _, done) => {
    fastify.get(
        "/",
        {
            config: {
                rateLimit: {
                    allowList: ["127.0.0.1"],
                },
            },
        },
        async (request) => {
            const { db } = request

            const testUser = await db.query.user.findFirst({
                where: userTable => eq(userTable.id, "test"),
                with: {
                    usersToOrganizations: true,
                },
            })

            return { testUser }
        },
    )

    done()
}
