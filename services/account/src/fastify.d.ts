import type { db } from "@api/database";

declare module "fastify" {
    /* eslint-disable-next-line no-unused-vars */
    interface FastifyRequest {
        db: typeof db;
    }
}
