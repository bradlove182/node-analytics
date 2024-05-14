import type { db } from "@api/database";
import type { lucia } from "@api/modules/auth";
import { Redis } from "@api/redis";

declare module "fastify" {
    /* eslint-disable-next-line no-unused-vars */
    interface FastifyRequest {
        db: typeof db;
        auth: typeof lucia;
        redis: typeof Redis;
    }
}

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
        DatabaseSessionAttributes: DatabaseSessionAttributes;
    }
    interface DatabaseSessionAttributes {}
}
