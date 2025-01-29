import type { User } from "@api/database"
import type { FastifyInstance } from "fastify"
import { buildServer } from "@api/app"
import { createUser } from "@api/lib/user"
import { beforeAll, describe, expect, it } from "vitest"

const testUser: User = {
    id: "1",
    email: "Test Team",
    createdAt: new Date(),
}

describe("users/:userId", () => {
    let server: FastifyInstance

    beforeAll(() => {
        server = buildServer()

        return () => {
            server.close()
        }
    })

    it("gets a user by id", async () => {
        await createUser(testUser)

        const response = await server.inject({
            method: "GET",
            url: `/v1/users/${testUser.id}`,
            headers: {
                host: "127.0.0.1",
                origin: "http://127.0.0.1",
            },
        })

        const data = response.json()

        expect(response.statusCode).toBe(200)
        expect(data.statusCode).toBe(200)
        expect(data.success).toBeTruthy()
        expect(data.data.email).toBe(testUser.email)
    })
})
