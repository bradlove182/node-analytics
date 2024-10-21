import type {
    passwordTable,
    projectTable,
    sessionTable,
    teamTable,
    userTable,
} from "@api/database/schemas"
import type { InferSelectModel } from "drizzle-orm"
import * as schema from "@api/database/schemas"
import { Logger } from "@api/utils"
import { env } from "@repo/environment"
import { drizzle } from "drizzle-orm/node-postgres"
import pg from "pg"

const pool = new pg.Pool({
    connectionString: env.ACCOUNT_DATABASE_URL,
})

export const db = drizzle(pool, {
    schema,
})

export type Database = typeof db
export type User = InferSelectModel<typeof userTable>
export type Password = InferSelectModel<typeof passwordTable>
export type Session = InferSelectModel<typeof sessionTable>
export type Team = InferSelectModel<typeof teamTable>
export type Project = InferSelectModel<typeof projectTable>

export async function initializeDatabase() {
    try {
        await pool.connect()
        Logger.info("Start", "Connected to database")
    }
    catch (error) {
        if (error instanceof Error) {
            Logger.error("Start", `Failed to connect to database ${error.message}`)
        }
        throw new Error(`Failed to connect to database ${error}`)
    }
}
