// import { events } from "@api/database/schemas";
import type { FastifyPluginCallback } from "fastify";

export const getTest: FastifyPluginCallback = (fastify, _, done) => {
    const tableName = "my_table";

    fastify.get("/tracker", async (request) => {
        const response = await request.db.query({
            query: `
            SELECT
              name
            FROM ${tableName}
            GROUP BY name
            LIMIT 10`,
        });

        const { data } = await response.json();

        request.db.close();

        return { success: data };
    });

    done();
};
