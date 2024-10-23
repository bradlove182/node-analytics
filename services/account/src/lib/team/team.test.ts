import type { Team } from "@api/database"
import { describe, expect, it } from "vitest"
import { createTeam, deleteTeam, getTeam, getTeams, updateTeam } from "."

const testTeam: Team = {
    id: "1",
    name: "test team",
    createdAt: new Date(Date.now()),
}

describe("lib/team", () => {
    it("create a new team", async () => {
        const team = await createTeam(testTeam)

        expect(team.id).toEqual(testTeam.id)
        expect(team.name).toEqual(testTeam.name)
        expect(team.createdAt).toBeInstanceOf(Date)
    })

    it("get a team", async () => {
        await createTeam(testTeam)
        const team = await getTeam(testTeam.id)

        expect(team?.id).toEqual(testTeam.id)
        expect(team?.name).toEqual(testTeam.name)
        expect(team?.createdAt).toBeInstanceOf(Date)
    })

    it("delete a team", async () => {
        const team = await createTeam(testTeam)
        await deleteTeam(team.id)

        const deletedTeam = await getTeam(team.id)

        expect(deletedTeam).toBeUndefined()
    })

    it("update a team", async () => {
        const team = await createTeam(testTeam)
        await updateTeam(team.id, {
            name: "updated test team",
        })
        const updatedTeam = await getTeam(team.id)

        expect(updatedTeam?.name).toEqual("updated test team")
    })

    it("gets teams", async () => {
        await createTeam(testTeam)
        const teams = await getTeams()

        expect(teams.length).toBeGreaterThan(0)
    })
})
