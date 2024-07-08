import type { Auth } from "@api/auth";
import type { Database } from "@api/database";
import type { User } from "@api/database/schemas";
import type { Redis } from "@api/redis";

declare module "fastify" {
    interface FastifyRequest {
        db: Database;
        redis: typeof Redis;
        auth: Auth;
    }
}

declare module "lucia" {
    interface Register {
        Lucia: Auth;
        DatabaseUserAttributes: Omit<User, "id" | "password_hash">;
    }
}
