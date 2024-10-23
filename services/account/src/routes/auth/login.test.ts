import type { User } from "@api/database"
import type { FastifyInstance } from "fastify"
import { buildServer } from "@api/app"
import { db, resetDatabase } from "@api/database"
import { passwordTable, userTable } from "@api/database/schemas"
import { getSessionCookieName, hashPassword } from "@api/lib/auth"
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest"

const testUser: User = {
    id: "1",
    email: "test@test.com",
    createdAt: new Date(),
}

const testPassword = "test"

describe("auth/login", () => {
    let server: FastifyInstance

    beforeAll(() => {
        server = buildServer()

        return () => {
            server.close()
        }
    })

    beforeEach(async () => {
        await db.insert(userTable).values(testUser)
        await db.insert(passwordTable).values({
            id: "1",
            userId: testUser.id,
            password_hash: await hashPassword(testPassword),
            createdAt: new Date(),
        })
    })

    it("sets the correct cookie header", async () => {
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

        const cookie = response.cookies.find(cookie => cookie.name === getSessionCookieName())

        expect(cookie?.name).toEqual(getSessionCookieName())
        expect(cookie?.httpOnly).toBeTruthy()
        expect(cookie?.sameSite).toEqual("Lax")
        expect(cookie?.path).toEqual("/")
    })

    it("login with valid credentials", async () => {
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
