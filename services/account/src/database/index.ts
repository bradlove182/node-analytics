import type { InferSelectModel } from "drizzle-orm"
import { schema } from "@api/database/schemas"
import { Logger } from "@api/utils"
import { env } from "@repo/environment"
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import pg from "pg"

const pool = new pg.Pool({
    connectionString: env.ACCOUNT_DATABASE_URL,
})

export const db = drizzle(pool, {
    schema,
})

export type Database = typeof db

export type User = InferSelectModel<typeof schema.user>
export type Password = InferSelectModel<typeof schema.password>
export type Session = InferSelectModel<typeof schema.session>
export type Organization = InferSelectModel<typeof schema.organization>
export type Project = InferSelectModel<typeof schema.project>

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

    try {
        await migrate(db, {
            migrationsFolder: "./src/database/migrations",
        })
        Logger.info("Start", "Migrated database")
    }
    catch (error) {
        if (error instanceof Error) {
            Logger.error("Start", `Failed to migrate database ${error.message}`)
        }
        throw new Error(`Failed to migrate database ${error}`)
    }
}
