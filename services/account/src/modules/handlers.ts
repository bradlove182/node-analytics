import { Logger } from "@api/utils";
import fp from "fastify-plugin";
import pg from "pg";
import { ZodError } from "zod";

export const handlers = fp(async (server) => {
    server.setErrorHandler((error, request, response) => {
        const statusCode = error.statusCode && error.statusCode >= 400 ? error.statusCode : 500;

        response.code(statusCode);

        Logger.error(request.url, error.message);

        if (error instanceof ZodError) {
            response.send({
                statusCode,
                success: false,
                message: error.issues[0]?.message,
            });
        }

        if (error instanceof pg.DatabaseError) {
            response.send({
                statusCode,
                success: false,
                message: error.message,
            });
        }

        response.send({
            statusCode,
            success: false,
            message: error.message,
        });
    });
});
