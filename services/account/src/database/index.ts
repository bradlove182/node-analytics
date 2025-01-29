import type { InferSelectModel } from "drizzle-orm"
import {
    passwordTable,
    projectTable,
    sessionTable,
    teamTable,
    userTable,
} from "@api/database/schemas"
import * as schema from "@api/database/schemas"
import { Logger } from "@api/utils"
import { env } from "@repo/environment"
import { drizzle } from "drizzle-orm/node-postgres"
import { migrate } from "drizzle-orm/node-postgres/migrator"
import pg from "pg"

export const pool = new pg.Pool({
    connectionString: env.ACCOUNT_DATABASE_URL,
})

export const db = drizzle(pool, {
    schema,
})

export type Database = typeof db
export type User = InferSelectModel<typeof userTable>
export type UserWithPassword = InferSelectModel<typeof userTable> & {
    password: Password | null
}
export type Password = InferSelectModel<typeof passwordTable>
export type Session = InferSelectModel<typeof sessionTable>
export type Team = InferSelectModel<typeof teamTable>
export type Project = InferSelectModel<typeof projectTable>

export async function initializeDatabase() {
    try {
        await pool.connect()
        if (env.NODE_ENV !== "test") {
            Logger.info("Start", "Connected to database")
        }
    }
    catch (error) {
        if (error instanceof Error) {
            Logger.error("Start", `Failed to connect to database ${error.message}`)
        }
        throw new Error(`Failed to connect to database ${error}`)
    }

    await migrateDatabase()
}

export async function migrateDatabase() {
    try {
        await migrate(db, {
            migrationsFolder: "./src/database/migrations",
        })
        if (env.NODE_ENV !== "test") {
            Logger.info("Start", "Migrated database")
        }
    }
    catch (error) {
        if (error instanceof Error) {
            Logger.error("Start", `Failed to migrate database ${error.message}`)
        }
        throw new Error(`Failed to migrate database ${error}`)
    }
}

export async function resetDatabase() {
    await db.transaction(async (tx) => {
        await tx.delete(sessionTable)
        await tx.delete(projectTable)
        await tx.delete(teamTable)
        await tx.delete(passwordTable)
        await tx.delete(userTable)
    })
}
