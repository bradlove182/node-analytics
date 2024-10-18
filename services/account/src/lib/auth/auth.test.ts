import { createTimeSpan } from "@api/utils"
import { describe, expect, it } from "vitest"
import { createSession, generateSessionToken, getSessionCookieName, validateSessionToken } from "."

function setup() {
    const token = generateSessionToken()
    return {
        token,
    }
}

describe("lib/auth", () => {
    it("generate a session token with a length of 32", () => {
        const { token } = setup()
        expect(token).toHaveLength(32)
    })

    it("create a valid session", async () => {
        const { token } = setup()
        const session = await createSession(token, "1")
        const { user, session: currentSession } = await validateSessionToken(token)

        expect(session.userId).toEqual("1")
        expect(session.expiresAt.getDate()).toEqual(createTimeSpan(30, "d").toDate().getDate())
        expect(session.id).toHaveLength(64)

        expect(user?.id).toEqual("1")
        expect(currentSession?.userId).toEqual("1")
        expect(currentSession?.expiresAt.getDate()).toEqual(createTimeSpan(30, "d").toDate().getDate())
        expect(currentSession?.id).toHaveLength(64)
    })

    it("returns expected cookie name", () => {
        const cookie = getSessionCookieName()
        expect(cookie).toEqual("session")
    })
})
