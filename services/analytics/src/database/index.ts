import * as schema from "@api/database/schemas";
import { env } from "@api/env";
import { Logger } from "@api/utils";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

export let db: ReturnType<typeof drizzle<typeof schema>>;

export const initializeDatabase = async () => {
    try {
        const pool = await new Pool({
            connectionString: env.DATABASE_URL,
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
        migrationsFolder: "./src/database/migrations"
      });
      Logger.info("Start", "Migrated database");
    }catch(error){
      if(error instanceof Error){
        Logger.error("Start", `Failed to migrate database ${error.message}`)
      }
      throw new Error(`Failed to migrate database ${error}`);
    }
};
