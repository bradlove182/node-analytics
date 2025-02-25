// import { events } from "@api/database/schemas";
import type { FastifyPluginCallback } from "fastify"

export const testRoutes: FastifyPluginCallback = (fastify, _, done) => {
    const tableName = "my_table"

    fastify.get("/", async (request) => {
        console.log(request.db, "DB");
        await request.db.command({
            query: `DROP TABLE IF EXISTS ${tableName}`,
        })

        await request.db.command({
            query: `CREATE TABLE ${tableName}
            (id UInt64, name String)
            ENGINE MergeTree()
            ORDER BY (id)
            `,
        })

        const response = await request.db.insert({
            table: tableName,
            values: [
                { id: 42, name: "foo" },
                { id: 42, name: "bar" },
            ],
            format: "JSONEachRow",
        })

        request.db.close()

        return { success: response }
    })

    done()
}
