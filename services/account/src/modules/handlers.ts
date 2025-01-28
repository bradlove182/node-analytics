import crypto from "node:crypto"
import process from "node:process"
import { Logger } from "@api/utils"
import fp from "fastify-plugin"
import pg from "pg"
import { ZodError } from "zod"

export const handlers = fp(async (server) => {
    server.setErrorHandler((error, request, response) => {
        const statusCode = typeof error.statusCode === "number" && error.statusCode >= 400
            ? error.statusCode
            : 500

        const requestId = request.id || crypto.randomUUID()

        response.header("X-Request-ID", requestId)
        response.code(statusCode)

        Logger.error(request.url, error.message)
        console.error({
            url: request.url,
            method: request.method,
            requestId,
            error: {
                message: error.message,
                name: error.name,
                stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
            },
        })

        if (error instanceof ZodError) {
            return response.send({
                statusCode,
                success: false,
                requestId,
                message: error.issues[0]?.message,
                details: process.env.NODE_ENV === "development"
                    ? { issues: error.issues }
                    : undefined,
            })
        }

        if (error instanceof pg.DatabaseError) {
            return response.send({
                statusCode,
                success: false,
                requestId,
                message: error.message,
                details: process.env.NODE_ENV === "development"
                    ? {
                            code: error.code,
                            column: error.column,
                            constraint: error.constraint,
                            detail: error.detail,
                            schema: error.schema,
                            table: error.table,
                        }
                    : undefined,
            })
        }

        return response.send({
            statusCode,
            success: false,
            requestId,
            message: error.message,
            details: process.env.NODE_ENV === "development"
                ? { stack: error.stack }
                : undefined,
        })
    })
})
