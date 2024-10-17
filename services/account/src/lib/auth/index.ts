import type { Session, User } from "@api/database"
import type { FastifyReply } from "fastify"
import { db } from "@api/database"
import { schema } from "@api/database/schemas"
import { createTimeSpan } from "@api/utils"
import { sha256 } from "@oslojs/crypto/sha2"
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from "@oslojs/encoding"
import { env } from "@repo/environment"
import { eq } from "drizzle-orm"

const { session: sessionTable } = schema

export type SessionValidationResult =
    | { session: Session, user: User }
    | { session: undefined, user: undefined }

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20)
    crypto.getRandomValues(bytes)
    const token = encodeBase32LowerCaseNoPadding(bytes)
    return token
}

export async function createSession(token: string, userId: User["id"]): Promise<Session> {
    // Session ID is a SHA-256 hash of the session token
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
    // Session is set to expire in 30 days
    const session: Session = {
        id: sessionId,
        userId,
        expiresAt: createTimeSpan(30, "d").toDate(),
    }
    await db.insert(sessionTable).values(session)
    return session
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

    const result = await db.query.session.findFirst({
        where: eq(sessionTable.id, sessionId),
        with: {
            user: true,
        },
    })

    if (!result || !result.user) {
        return { session: undefined, user: undefined }
    }

    const { user, ...session } = result

    // Check if session is expired
    if (Date.now() >= session.expiresAt.getTime()) {
        await db.delete(sessionTable).where(eq(sessionTable.id, sessionId))
        return { session: undefined, user: undefined }
    }

    // Check if session is within 15 days of expiration, if it is extend it.
    if (Date.now() >= session.expiresAt.getTime() - createTimeSpan(15, "d").milliseconds()) {
        session.expiresAt = new Date(Date.now() + createTimeSpan(30, "d").milliseconds())
        await db.update(sessionTable).set({
            expiresAt: session.expiresAt,
        }).where(eq(sessionTable.id, session.id))
    }

    return { session, user }
}

export async function invalidateSession(sessionId: Session["id"]): Promise<void> {
    await db.delete(sessionTable).where(eq(sessionTable.id, sessionId))
}

export function setSessionTokenCookie(reply: FastifyReply, token: string): void {
    let cookie = `session=${token}; HttpOnly; SameSite=Lax; Expires=${new Date(Date.now() + createTimeSpan(30, "d").milliseconds()).toUTCString()}; Path=/;`

    if (env.NODE_ENV === "production") {
        cookie = `${cookie} Secure;`
    }

    reply.headers({
        "set-cookie": cookie,
    })
}

export function deleteSessionTokenCookie(reply: FastifyReply): void {
    let cookie = "session=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/;"

    if (env.NODE_ENV === "production") {
        cookie = `${cookie} Secure;`
    }

    reply.headers({
        "set-cookie": cookie,
    })
}

export const auth = {
    generateSessionToken,
    createSession,
    validateSessionToken,
    invalidateSession,
    setSessionTokenCookie,
    deleteSessionTokenCookie,
}

export type Auth = typeof auth
