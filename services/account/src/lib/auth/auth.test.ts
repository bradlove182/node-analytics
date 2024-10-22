import type { User } from "@api/database"
import { db } from "@api/database"
import { userTable } from "@api/database/schemas"
import { createTimeSpan } from "@api/utils"
import { beforeEach, describe, expect, it } from "vitest"
import { createSession, generateSessionToken, getSessionCookieName, hashPassword, validateSessionToken, verifyPassword } from "."

const testUser: User = {
    id: "1",
    email: "test@test.com",
    createdAt: new Date(),
}

beforeEach(async () => {
    await db.insert(userTable).values(testUser)

    return async () => {
        await db.delete(userTable)
    }
})

describe("lib/auth", () => {
    it("generate a session token with a length of 32", () => {
        const token = generateSessionToken()
        expect(token).toHaveLength(32)
    })

    it("create a valid session", async () => {
        const token = generateSessionToken()
        const session = await createSession(token, testUser.id)
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

    it("successfully hashes and verifies a password", async () => {
        const password = "test"
        const hashedPassword = await hashPassword(password)
        const unHashedPassword = await verifyPassword(hashedPassword, password)
        expect(unHashedPassword).toBeTruthy()
    })
})
