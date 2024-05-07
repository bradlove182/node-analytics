import type { db } from "@api/database";
import type { lucia } from "@api/modules/auth";

declare module "fastify" {
    /* eslint-disable-next-line no-unused-vars */
    interface FastifyRequest {
        db: typeof db;
        auth: typeof lucia;
    }
}

declare module "lucia" {
    interface Register {
        Lucia: typeof lucia;
    }
}
