import { db } from "@api/database";
import { sessionTable, userTable } from "@api/database/schemas";
import { type User } from "@api/database/types";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { env } from "@repo/environment";
import { Lucia } from "lucia";
import { TimeSpan } from "oslo";

declare module "lucia" {
    interface Register {
        Lucia: Auth;
        DatabaseUserAttributes: User;
    }
}

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, userTable);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        name: "session",
        expires: false,
        attributes: {
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
        },
    },
    sessionExpiresIn: new TimeSpan(30, "d"),
    getUserAttributes: (attributes) => {
        return {
            id: attributes.id,
            email: attributes.email,
            createdAt: attributes.createdAt,
        };
    },
});

export type Auth = typeof lucia;
