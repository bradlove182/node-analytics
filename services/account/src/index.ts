import { initializeDatabase } from "@api/database";
import { middleware } from "@api/modules/middleware";
import { Redis } from "@api/redis";
import { otpRoutes, testRoutes } from "@api/routes";
import { Logger } from "@api/utils";
import cors from "@fastify/cors";
import fastifyRateLimit from "@fastify/rate-limit";
import { env } from "@repo/environment";
import { fastify } from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

const API_VERSION = "v1";

export const start = async () => {
    const server = fastify({
        bodyLimit: 1_000_000,
        trustProxy: true,
    });

    await initializeDatabase();
    await Redis.initialize();

    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);

    server.register(middleware);
    server.register(cors, {
        maxAge: 600,
        origin: true,
        credentials: true,
    });
    server.register(fastifyRateLimit, {
        global: true,
        max: 3000,
        allowList: ["127.0.0.1"],
        redis: Redis.redis,
    });

    server.register(testRoutes, {
        prefix: `/${API_VERSION}/test`,
    });
    server.register(otpRoutes, {
        prefix: `/${API_VERSION}/auth/otp`,
    });

    try {
        await server.listen({ host: env.ACCOUNT_HOST, port: env.ACCOUNT_PORT });
        Logger.info("Start", `Server listening at ${env.ACCOUNT_PORT}`);
    } catch (error) {
        if (error instanceof Error) {
            Logger.error("Start", error.message);
            if (error.stack) {
                Logger.error("Start", error.stack);
            }
        }
        server.log.error(error);
        process.exit(1);
    }
};

start();
