import fp from "fastify-plugin";
import { ZodError } from "zod";

export const handlers = fp(async (server) => {
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
});
