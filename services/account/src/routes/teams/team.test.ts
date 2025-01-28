import type { Team } from "@api/database"
import type { FastifyInstance } from "fastify"
import { buildServer } from "@api/app"
import { createTeam } from "@api/lib/team"
import { beforeAll, describe, expect, it } from "vitest"

const testTeam: Team = {
    id: "1",
    name: "Test Team",
    createdAt: new Date(),
}

describe("team/:teamId", () => {
    let server: FastifyInstance

    beforeAll(() => {
        server = buildServer()

        return () => {
            server.close()
        }
    })

    it("gets a team", async () => {
        await createTeam(testTeam)

        const response = await server.inject({
            method: "GET",
            url: `/v1/teams/${testTeam.id}`,
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
