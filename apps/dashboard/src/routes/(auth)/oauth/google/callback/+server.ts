import type { OAuth2Tokens } from "arctic"
import type { RequestEvent } from "./$types"
import { createGoogleUser, getGoogleCodeVerifierCookieName, getGoogleStateCookieName, getUserByGoogleId, google } from "$lib/server/auth/google"
import { createSession, generateSessionToken, setSessionTokenCookie } from "$lib/server/auth/session"
import { createProject } from "$lib/server/project"
import { decodeIdToken } from "arctic"

export async function GET(event: RequestEvent): Promise<Response> {
    const code = event.url.searchParams.get("code")
    const state = event.url.searchParams.get("state")
    const storedState = event.cookies.get(getGoogleStateCookieName()) ?? null
    const codeVerifier = event.cookies.get(getGoogleCodeVerifierCookieName()) ?? null

    if (code === null || state === null || storedState === null || codeVerifier === null) {
        return new Response(null, {
            status: 400,
        })
    }

    if (state !== storedState) {
        return new Response(null, {
            status: 400,
        })
    }

    let tokens: OAuth2Tokens
    try {
        tokens = await google.validateAuthorizationCode(code, codeVerifier)
    }
    catch {
        // Invalid code or client credentials
        return new Response(null, {
            status: 400,
        })
    }

    const claims = decodeIdToken(tokens.idToken()) as { email: string, sub: string }

    const googleUserId = claims.sub
    const email = claims.email

    const existingUser = await getUserByGoogleId(googleUserId)

    if (existingUser) {
        const sessionToken = generateSessionToken()
        const session = await createSession(sessionToken, existingUser.id)
        setSessionTokenCookie(event, sessionToken, session.expiresAt)
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/",
            },
        })
    }

    const user = await createGoogleUser(email, googleUserId)

    if (user) {
        const sessionToken = generateSessionToken()
        const session = await createSession(sessionToken, user.userId)
        setSessionTokenCookie(event, sessionToken, session.expiresAt)

        await createProject(`${email}'s Project`, user.userId)

        return new Response(null, {
            status: 302,
            headers: {
                Location: "/",
            },
        })
    }

    return new Response(null, {
        status: 400,
    })
}
