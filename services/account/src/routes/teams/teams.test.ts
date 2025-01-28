import type { FastifyInstance } from "fastify"
import { buildServer } from "@api/app"
import { createTeam } from "@api/lib/team"
import { beforeAll, describe, expect, it } from "vitest"

describe("teams", () => {
    let server: FastifyInstance

    beforeAll(() => {
        server = buildServer()

        return () => {
            server.close()
        }
    })

    it("gets teams", async () => {
        await Promise.all(Array.from({ length: 5 }).map((_, index) => createTeam({
            id: String(index + 1),
            name: "Test Team",
            createdAt: new Date(),
        })))

        const response = await server.inject({
            method: "GET",
            url: `/v1/teams`,
            headers: {
                host: "127.0.0.1",
                origin: "http://127.0.0.1",
            },
        })

        const data = response.json()

        expect(response.statusCode).toBe(200)
        expect(data.statusCode).toBe(200)
        expect(data.success).toBeTruthy()
        expect(data.data.length).toEqual(5)
    })
})
