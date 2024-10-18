import type { Database } from "@api/database"
import type { Auth } from "@api/lib/auth"
import type { Redis } from "@api/redis"

declare module "fastify" {
    interface FastifyRequest {
        db: Database
        redis: typeof Redis
        auth: Auth
    }
}
