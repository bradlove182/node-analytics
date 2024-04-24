import { initializeDatabase } from "@api/database";
import { middleware } from "@api/modules/middleware";
import { testRoutes } from "@api/routes";
import { Logger } from "@api/utils";
import cors from "@fastify/cors";
import { env } from "@repo/environment";
import { fastify } from "fastify";

const API_VERSION = "v1";

export const start = async () => {
    const server = fastify({
        bodyLimit: 1_000_000,
        trustProxy: true,
        logger: true,
    });

    await initializeDatabase();

    server.register(middleware);
    server.register(cors, {
        maxAge: 600,
        origin: true,
        credentials: true,
    });

    server.register(testRoutes, {
        prefix: `/${API_VERSION}/test`,
    });

    try {
        await server.listen({ host: env.ACCOUNT_HOST, port: env.ACCOUNT_PORT });
        Logger.info("Start", `Server listening at ${env.ACCOUNT_PORT}`);
    } catch (error) {
        if (error instanceof Error) {
            Logger.error("Start", error.message);
        }
        server.log.error(error);
        process.exit(1);
    }
};

start();
