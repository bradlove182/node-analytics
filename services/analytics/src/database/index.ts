import { Logger } from "@api/utils"
import { createClient } from "@clickhouse/client"
import { env } from "@repo/environment"
import type { ClickHouseClient } from "@clickhouse/client"

// eslint-disable-next-line import/no-mutable-exports
export let db: ClickHouseClient

export async function initializeDatabase() {
    try {
        db = createClient({
            url: env.CLICKHOUSE_DATABASE_URL,
            username: env.CLICKHOUSE_DATABASE_USERNAME,
            password: env.CLICKHOUSE_DATABASE_PASSWORD,
            clickhouse_settings: {
                connect_timeout: 1000,
            },
        })

        if (!(await db.ping())) {
            throw new Error("failed to ping clickhouse!")
        }

        Logger.info("Start", "Connected to Clickhouse database")
    }
    catch (error) {
        if (error instanceof Error) {
            Logger.error("Start", `Failed to connect to database ${error.message}`)
        }

        throw new Error(`Failed to connect to database ${error}`)
    }
}
