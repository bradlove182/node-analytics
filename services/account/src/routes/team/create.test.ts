import type { Team } from "@api/database"
import type { FastifyInstance } from "fastify"
import { buildServer } from "@api/app"
import { beforeAll, describe, expect, it } from "vitest"

const testTeam: Team = {
    id: "1",
    name: "Test Team",
    createdAt: new Date(),
}

describe("team/create", () => {
    let server: FastifyInstance

    beforeAll(() => {
        server = buildServer()

        return () => {
            server.close()
        }
    })

    it("creates a new team", async () => {
        const response = await server.inject({
            method: "POST",
            url: "/v1/team/create",
            payload: {
                name: testTeam.name,
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
        expect(data.data.name).toBe(testTeam.name)
    })
})
