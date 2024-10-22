import type { User } from "@api/database"
import { buildServer } from "@api/app"
import { db } from "@api/database"
import { passwordTable, userTable } from "@api/database/schemas"
import { hashPassword } from "@api/lib/auth"
import { beforeEach, describe, expect, it } from "vitest"

const testUser: User = {
    id: "1",
    email: "test@test.com",
    createdAt: new Date(),
}

const testPassword = "test"

beforeEach(async () => {
    await db.transaction(async (tx) => {
        await tx.insert(userTable).values(testUser)
        await tx.insert(passwordTable).values({
            id: "1",
            userId: testUser.id,
            password_hash: await hashPassword(testPassword),
            createdAt: new Date(),
        })
    })

    return async () => {
        await db.transaction(async (tx) => {
            await tx.delete(userTable)
            await tx.delete(passwordTable)
        })
    }
})

describe("login route", () => {
    it("login with valid credentials", async () => {
        const server = buildServer()

        const response = await server.inject({
            method: "POST",
            url: "/v1/auth/login",
            payload: {
                email: testUser.email,
                password: testPassword,
            },
            headers: {
                host: "127.0.0.1",
                origin: "http://127.0.0.1",
            },
        })

        const data = response.json()

        expect(response.statusCode).toBe(200)
        expect(data.statusCode).toBe(200)
        expect(data.success).toBeTruthy()
    })

    it("login with invalid credentials", async () => {
        const server = buildServer()

        const response = await server.inject({
            method: "POST",
            url: "/v1/auth/login",
            payload: {
                email: "invalid@email.com",
                password: "invalid",
            },
            headers: {
                host: "127.0.0.1",
                origin: "http://127.0.0.1",
            },
        })

        const data = response.json()

        expect(response.statusCode).toBe(400)
        expect(data.statusCode).toBe(400)
        expect(data.success).toBeFalsy()
    })
})
