import { db } from "@api/database";
import { sessionTable, usersTable } from "@api/database/schemas";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia } from "lucia";

const adapter = new DrizzlePostgreSQLAdapter(db, sessionTable, usersTable);

export const lucia = new Lucia(adapter, {
    sessionCookie: {
        attributes: {
            secure: process.env.NODE_ENV === "production",
        },
    },
    getUserAttributes: (attributes) => {
        return {
            email: attributes.email,
            createdAt: attributes.createdAt,
        };
    },
});

export type Auth = typeof lucia;
