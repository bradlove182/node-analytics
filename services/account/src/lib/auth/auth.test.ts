import type { User } from "@api/database"
import { db } from "@api/database"
import { userTable } from "@api/database/schemas"
import { describe, expect, it } from "vitest"
import { createSession, generateIdFromEntropySize, generateSessionToken, getSessionCookieName, hashPassword, validateSessionToken, verifyPassword } from "."

const testUser: User = {
    id: "lib/auth",
    email: "test@test.com",
    createdAt: new Date(),
}

describe.sequential("lib/auth", () => {
    it("generateSessionToken() with a length of 32", () => {
        const token = generateSessionToken()
        expect(token).toHaveLength(32)
    })

    it("createSession() validated with validateSessionToken()", async () => {
        await db.insert(userTable).values(testUser)

        const token = generateSessionToken()
        const session = await createSession(token, testUser.id)
        const { user, session: currentSession } = await validateSessionToken(token)

        expect(session.userId).toEqual(testUser.id)
        expect(session.expiresAt).toBeInstanceOf(Date)
        expect(session.id).toHaveLength(64)

        expect(user?.id).toEqual(testUser.id)
        expect(currentSession?.userId).toEqual(testUser.id)
        expect(currentSession?.expiresAt).toBeInstanceOf(Date)
        expect(currentSession?.id).toHaveLength(64)
    })

    it("getSessionCookieName()", () => {
        const cookie = getSessionCookieName()
        expect(cookie).toEqual("session")
    })

    it("hashPassword() verified by verifyPassword()", async () => {
        const password = "test"
        const hashedPassword = await hashPassword(password)
        const isValid = await verifyPassword(hashedPassword, password)
        expect(isValid).toBeTruthy()
    })

    it("generateIdFromEntropySize()", () => {
        // check string is only lowercase
        for (let i = 0; i < 100; i++) {
            const id = generateIdFromEntropySize(10)
            expect(id).not.toMatch(/[A-Z]/)
        }

        // check output length
        const id1 = generateIdFromEntropySize(25)
        expect(id1.length).toBe(40)

        // check padding is omitted
        const id3 = generateIdFromEntropySize(8)
        expect(id3).not.toMatch(/=/)
    })
})
