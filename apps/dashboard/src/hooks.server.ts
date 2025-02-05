import type { Handle } from "@sveltejs/kit"
import { deleteSessionTokenCookie, getSessionCookieName, setSessionTokenCookie, validateSessionToken } from "$lib/server/auth/session"

const handleAuth: Handle = async ({ event, resolve }) => {
    const sessionToken = event.cookies.get(getSessionCookieName())

    if (!sessionToken) {
        event.locals.user = null
        event.locals.session = null
        return resolve(event)
    }

    const { session, user } = await validateSessionToken(sessionToken)

    if (session) {
        setSessionTokenCookie(event, sessionToken, session.expiresAt)
    }
    else {
        deleteSessionTokenCookie(event)
    }

    event.locals.user = user
    event.locals.session = session

    return resolve(event)
}

export const handle: Handle = handleAuth
