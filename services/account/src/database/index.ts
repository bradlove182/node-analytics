import * as schema from "@api/database/schemas";
import { Logger } from "@api/utils";
import { env } from "@repo/environment";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

export let db: ReturnType<typeof drizzle<typeof schema>>;

export type Database = typeof db;

export const initializeDatabase = async () => {
    try {
        const pool = await new pg.Pool({
            connectionString: env.ACCOUNT_DATABASE_URL,
        }).connect();

        Logger.info("Start", "Connected to database");

        db = drizzle(pool, {
            schema,
        });
    } catch (error) {
        if (error instanceof Error) {
            Logger.error("Start", `Failed to connect to database ${error.message}`);
        }
        throw new Error(`Failed to connect to database ${error}`);
    }

    try {
        await migrate(db, {
            migrationsFolder: "./src/database/migrations",
        });
        Logger.info("Start", "Migrated database");
    } catch (error) {
        if (error instanceof Error) {
            Logger.error("Start", `Failed to migrate database ${error.message}`);
        }
        throw new Error(`Failed to migrate database ${error}`);
    }
};
