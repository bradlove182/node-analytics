import type { Session, User } from "$lib/server/database/types"
import { db } from "$lib/server/database"
import { createTimeSpan } from "$lib/utils/timespan"
import { sha256 } from "@oslojs/crypto/sha2"
import { encodeBase64url, encodeHexLowerCase } from "@oslojs/encoding"
import { eq } from "drizzle-orm"
import * as table from "$lib/server/database/schemas"
import type { RequestEvent } from "@sveltejs/kit"

export const getSessionCookieName = () => "session" as const

export function generateSessionToken() {
    const bytes = crypto.getRandomValues(new Uint8Array(18));
    const token = encodeBase64url(bytes);
    return token;
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
    await db.insert(table.session).values(session)
    return session
}

export async function validateSessionToken(token: string) {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))

    const result = await db.query.session.findFirst({
        where: eq(table.session.id, sessionId),
        with: {
            user: true,
        },
    })

    if (!result || !result.user) {
        return { session: null, user: null }
    }

    const { user, ...session } = result

    // Check if session is expired
    if (Date.now() >= session.expiresAt.getTime()) {
        await db.delete(table.session).where(eq(table.session.id, sessionId))
        return { session: null, user: null }
    }

    // Check if session is within 15 days of expiration, if it is extend it.
    if (Date.now() >= session.expiresAt.getTime() - createTimeSpan(15, "d").milliseconds()) {
        session.expiresAt = new Date(Date.now() + createTimeSpan(30, "d").milliseconds())
        await db.update(table.session).set({
            expiresAt: session.expiresAt,
        }).where(eq(table.session.id, session.id))
    }

    return { session, user }
}

export type SessionValidationResult = Awaited<ReturnType<typeof validateSessionToken>>;

export async function invalidateSession(sessionId: Session["id"]): Promise<void> {
    await db.delete(table.session).where(eq(table.session.id, sessionId))
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: Date) {
	event.cookies.set(getSessionCookieName(), token, {
		expires: expiresAt,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent) {
	event.cookies.delete(getSessionCookieName(), {
		path: '/'
	});
}

export const auth = {
    generateSessionToken,
    createSession,
    validateSessionToken,
    invalidateSession,
    getSessionCookieName,
    setSessionTokenCookie,
    deleteSessionTokenCookie
}

export type Auth = typeof auth
