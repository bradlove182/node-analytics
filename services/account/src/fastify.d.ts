import type { db } from "@api/database";
import { Redis } from "@api/redis";

declare module "fastify" {
    /* eslint-disable-next-line no-unused-vars */
    interface FastifyRequest {
        db: typeof db;
        redis: typeof Redis;
    }
}
