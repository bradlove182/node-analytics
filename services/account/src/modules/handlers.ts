import fp from "fastify-plugin";
import pg from "pg";
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

        if (error instanceof pg.DatabaseError) {
            console.log(error.statusCode);
            response.send({
                status: statusCode,
                success: false,
                message: error.message,
            });
        }

        response.send({
            status: statusCode,
            success: false,
            message: error.message,
        });
    });
});
