import type { User } from "@api/database"
import type { FastifyInstance } from "fastify"
import { buildServer } from "@api/app"
import { db, resetDatabase } from "@api/database"
import { passwordTable, userTable } from "@api/database/schemas"
import { getSessionCookieName } from "@api/lib/auth"
import { getUserByEmail } from "@api/lib/user"
import { afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest"

const testUser: User = {
    id: "1",
    email: "test@test.com",
    createdAt: new Date(),
}

const testPassword = "12345678"

describe("auth/register", () => {
    let server: FastifyInstance

    beforeAll(() => {
        server = buildServer()

        return () => {
            server.close()
        }
    })

    it("register a new user", async () => {
        const response = await server.inject({
            method: "POST",
            url: "/v1/auth/register",
            payload: {
                email: testUser.email,
                password: testPassword,
            },
            headers: {
                host: "127.0.0.1",
                origin: "http://127.0.0.1",
            },
        })

        const user = await getUserByEmail(testUser.email)

        expect(response.statusCode).toBe(200)
        expect(user?.email).toStrictEqual(testUser.email)
    })

    it("sets the correct cookie header", async () => {
        const response = await server.inject({
            method: "POST",
            url: "/v1/auth/register",
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
})
