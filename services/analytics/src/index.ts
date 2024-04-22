import { Logger } from "@api/utils";
import cors from "@fastify/cors";
import { fastify } from "fastify";

const API_VERSION = "v1";
const PORT = 3000;

export const start = async () => {
    const server = fastify();

    server.register(cors, {
        maxAge: 600,
        origin: true,
        credentials: true,
    });

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
