import { db } from "@api/database"
import fp from "fastify-plugin"
import fastifySession from '@fastify/session'
import fastifyCookie from '@fastify/cookie'
import type { FastifyInstance } from "fastify"
import { env } from "@repo/environment"


const middleware = fp(async (fastify: FastifyInstance) => {
    // Add cookie support first
    await fastify.register(fastifyCookie)
    
    // Add session support
    await fastify.register(fastifySession, {
        secret: env.APP_SECRET, // Use your environment secret
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 60 * 1000 // 30 minutes
        }
    })

    // Add database to request
    fastify.addHook("onRequest", async (request) => {
        request.db = db
    })

    // Add session initialization hook
    // fastify.addHook("preHandler", async (request) => {
    //     if (!request.session.sessionId) {
    //         request.session.sessionId = request.id
    //         request.session.websiteId = request.body?.payload?.website || null
    //         request.session.visitId = request.id // You might want to use a different ID generation
    //         request.session.createdAt = Date.now()
    //         // Add other session data as needed
    //     }
    // })
})

export { middleware }