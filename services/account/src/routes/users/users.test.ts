import type { User } from "@api/database"
import type { FastifyInstance } from "fastify"
import { buildServer } from "@api/app"
import { createUser } from "@api/lib/user"
import { beforeAll, describe, expect, it } from "vitest"

describe("users", () => {
    let server: FastifyInstance

    beforeAll(() => {
        server = buildServer()

        return () => {
            server.close()
        }
    })

    it("gets users", async () => {
        const length = 5
        await Promise.all(Array.from({ length }).map((_, index) => createUser({
            id: String(index + 1),
            email: `${index + 1}@email.com`,
            createdAt: new Date(),
        })))

        const response = await server.inject({
            method: "GET",
            url: `/v1/users`,
            headers: {
                host: "127.0.0.1",
                origin: "http://127.0.0.1",
            },
        })

        const data = response.json()

        expect(response.statusCode).toBe(200)
        expect(data.statusCode).toBe(200)
        expect(data.success).toBeTruthy()
        expect(data.data.length).toEqual(length)
    })
})
