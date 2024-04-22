import { Logger } from "@api/utils";
import cors from "@fastify/cors";
import { fastify } from "fastify";
import { testRoutes } from "./routes";
import dbConnector from "@api/plugins/database";
import redisConnector from "@api/plugins/redis";
import { loadEnviroments } from "@api/utils/fastify-env";

const API_VERSION = "v1";
const PORT = 3000;

export const start = async () => {
    const server = fastify({
        bodyLimit: 1_000_000,
        trustProxy: true,
        logger: true,
    });

    server.register(cors, {
        maxAge: 600,
        origin: true,
        credentials: true,
    });

    server.register(testRoutes, {
        prefix: `/${API_VERSION}/test`,
    });

    // simple way to load env variables ( can change )
    await loadEnviroments();

    server.register(dbConnector);

    server.register(redisConnector);

    server.get("/", async () => {
        return { success: true };
    });

    try {
        await server.listen({ port: PORT });
        Logger.info("Start", `Server listening at ${PORT}`);
    } catch (error) {
        if (error instanceof Error) {
            Logger.error("Start", error.message);
        }
        server.log.error(error);
        process.exit(1);
    }
};

start();
