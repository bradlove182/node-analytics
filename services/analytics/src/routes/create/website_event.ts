// import { events } from "@api/database/schemas";
import type { FastifyPluginCallback } from "fastify";

export const websiteEventRoute: FastifyPluginCallback = (fastify, _, done) => {
    const tableName = "honeycomb.website_event";

    fastify.get("/", async (request) => {
        await request.db.command({
            query: `DROP TABLE IF EXISTS ${tableName}`,
        });

        await request.db.command({
            query: `CREATE TABLE ${tableName}
            (
                website_id UUID,
                session_id UUID,
                visit_id UUID,
                event_id UUID,
                --sessions
                hostname LowCardinality(String),
                browser LowCardinality(String),
                os LowCardinality(String),
                device LowCardinality(String),
                screen LowCardinality(String),
                language LowCardinality(String),
                country LowCardinality(String),
                subdivision1 LowCardinality(String),
                subdivision2 LowCardinality(String),
                city String,
                --pageviews
                url_path String,
                url_query String,
                referrer_path String,
                referrer_query String,
                referrer_domain String,
                page_title String,
                --events
                event_type UInt32,
                event_name String,
                created_at DateTime('UTC'),
                job_id Nullable(UUID)
            )
                engine = MergeTree
                    ORDER BY (website_id, session_id, created_at)
                    SETTINGS index_granularity = 8192;`,
        });

        request.db.close();

        return { success: 200 };
    });

    done();
};
