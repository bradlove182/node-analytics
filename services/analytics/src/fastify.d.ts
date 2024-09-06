import type { db } from "@api/database"

declare module "fastify" {

    interface FastifyRequest {
        db: typeof db
    }
}
