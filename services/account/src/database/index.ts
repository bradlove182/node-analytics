import { env } from "@repo/environment";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: env.ACCOUNT_DATABASE_URL,
});

export const db = drizzle(pool);
