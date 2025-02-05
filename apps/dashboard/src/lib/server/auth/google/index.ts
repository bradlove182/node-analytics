import type { Google, User } from "$lib/server/database/types"
import type { RequestEvent } from "@sveltejs/kit"
import { env } from "$env/dynamic/private"
import { generateIdFromEntropySize } from "$lib/server/crypto"
import { db } from "$lib/server/database"
import * as table from "$lib/server/database/schemas"
import { createUser } from "$lib/server/user"
import { createTimeSpan } from "$lib/utils/timespan"
import { Google as GoogleClient } from "arctic"
import { eq } from "drizzle-orm"

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = env

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not set")
}

export const google = new GoogleClient(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    "http://localhost:5173/login/google/callback",
)

export const getGoogleStateCookieName = () => "google_oauth_state" as const
export const getGoogleCodeVerifierCookieName = () => "google_code_verifier" as const

export async function getUserByGoogleId(googleId: string) {
    const result = await db.query.google.findFirst({
        where: googleTable => eq(googleTable.googleId, googleId),
        with: {
            user: true,
        },
    })

    if (!result) {
        return undefined
    };

    const { user } = result

    return user
}

export async function createGoogleUser(email: User["email"], googleId: Google["id"]) {
    const user = await createUser(email)

    const googleUser = await db.insert(table.google).values({
        id: generateIdFromEntropySize(10),
        userId: user.id,
        googleId,
    }).returning()

    return googleUser.find(current => current.googleId === googleId)
}

export function setGoogleAuthCookie(event: RequestEvent, state: string, codeVerifier: string) {
    event.cookies.set(getGoogleStateCookieName(), state, {
        path: "/",
        httpOnly: true,
        maxAge: createTimeSpan(10, "m").milliseconds(),
        sameSite: "lax",
    })
    event.cookies.set(getGoogleCodeVerifierCookieName(), codeVerifier, {
        path: "/",
        httpOnly: true,
        maxAge: createTimeSpan(10, "m").milliseconds(),
        sameSite: "lax",
    })
}

export function deleteGoogleAuthCookie(event: RequestEvent) {
    event.cookies.delete(getGoogleStateCookieName(), {
        path: "/",
    })
    event.cookies.delete(getGoogleCodeVerifierCookieName(), {
        path: "/",
    })
}
