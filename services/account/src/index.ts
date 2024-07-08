import { initializeDatabase } from "@api/database";
import { middleware } from "@api/modules/middleware";
import { plugins } from "@api/modules/plugins";
import { Redis } from "@api/redis";
import { routes } from "@api/routes";
import { Logger } from "@api/utils";
import { env } from "@repo/environment";
import { fastify } from "fastify";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { ZodError } from "zod";

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
    server.register(plugins);
    server.register(routes, {
        prefix: `/${API_VERSION}`,
    });

    server.setErrorHandler((error, request, response) => {
        const statusCode = error.statusCode || 500;

        response.status(statusCode);

        if (error instanceof ZodError) {
            response.send({
                status: statusCode,
                success: false,
                message: error.issues[0]?.message,
            });
        }

        response.send({
            status: statusCode,
            success: false,
            message: error.message,
        });
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
