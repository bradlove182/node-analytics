// import { events } from "@api/database/schemas";
import type { FastifyPluginCallback } from "fastify"

export const sessionEventDataRoute: FastifyPluginCallback = (fastify, _, done) => {
    const tableName = "honeycomb.session_data"

    fastify.get("/", async (request) => {
        await request.db.command({
            query: `DROP TABLE IF EXISTS ${tableName}`,
        })

        await request.db.command({
            query: `CREATE TABLE ${tableName}
            (
                website_id UUID,
                session_id UUID,
                data_key String,
                string_value Nullable(String),
                number_value Nullable(Decimal64(4)),
                date_value Nullable(DateTime('UTC')),
                data_type UInt32,
                created_at DateTime('UTC'),
                job_id Nullable(UUID)
            )
                engine = MergeTree
                    ORDER BY (website_id, session_id, data_key, created_at)
                    SETTINGS index_granularity = 8192;
`,
        })

        const response = await request.db.insert({
            table: tableName,
            values: [{ id: 42, name: request.url }],
            format: "JSONEachRow",
        })

        request.db.close()

        return { success: response }
    })

    done()
}
