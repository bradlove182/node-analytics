import { Logger } from "@api/utils";
import cors from "@fastify/cors";
import { fastify } from "fastify";
import { testRoutes } from "./routes";

const API_VERSION = "v1";
const PORT = 3000;

export const start = async () => {
    const server = fastify({
        bodyLimit: 1_000_000,
        trustProxy: true,
    });

    server.register(cors, {
        maxAge: 600,
        origin: true,
        credentials: true,
    });
    server.register(testRoutes, {
        prefix: `/${API_VERSION}/test`,
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
