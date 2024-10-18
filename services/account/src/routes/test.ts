import type { FastifyPluginCallback } from "fastify"
import { eq } from "drizzle-orm"

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

            const testUser = await db.query.userTable.findFirst({
                where: userTable => eq(userTable.id, "test"),
            })

            return { testUser }
        },
    )

    done()
}
