import type { Auth } from "@api/auth";
import type { db } from "@api/database";
import type { User } from "@api/database/schemas";
import type { Redis } from "@api/redis";

declare module "fastify" {
    /* eslint-disable-next-line no-unused-vars */
    interface FastifyRequest {
        db: typeof db;
        redis: typeof Redis;
        auth: Auth;
    }
}

declare module "lucia" {
	interface Register {
		Lucia: Auth;
		DatabaseUserAttributes: Omit<User, "id">;
	}
}