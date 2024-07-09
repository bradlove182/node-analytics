import { sessionTable, userTable } from "@api/database/schemas";
import { Logger } from "@api/utils";
import { env } from "@repo/environment";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";

const schema = {
    user: userTable,
    session: sessionTable,
};

const pool = new pg.Pool({
    connectionString: env.ACCOUNT_DATABASE_URL,
});

export let db = drizzle(pool, {
    schema,
});

export type Database = typeof db;

export const initializeDatabase = async () => {
    try {
        await pool.connect();
        Logger.info("Start", "Connected to database");
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
