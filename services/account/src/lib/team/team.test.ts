import type { Team } from "@api/database"
import { afterEach, describe, expect, it } from "vitest"
import { createTeam, deleteTeam, getTeam, getTeams, updateTeam } from "."

const testTeam: Team = {
    id: "2",
    name: "the sick test team",
    createdAt: new Date(Date.now()),
}

afterEach(async () => {
    await deleteTeam(testTeam.id)
})

describe("lib/team", () => {
    it("create a new Team", async () => {
        const Team = await createTeam(testTeam)

        expect(Team.id).toEqual(testTeam.id)
        expect(Team.name).toEqual(testTeam.name)
        expect(Team.createdAt).toBeInstanceOf(Date)
    })

    it("get a team", async () => {
        await createTeam(testTeam)
        const Team = await getTeam(testTeam.id)

        expect(Team?.id).toEqual(testTeam.id)
        expect(Team?.name).toEqual(testTeam.name)
        expect(Team?.createdAt).toBeInstanceOf(Date)
    })

    it("delete a team", async () => {
        const Team = await createTeam(testTeam)
        await deleteTeam(Team.id)

        const deletedTeam = await getTeam(Team.id)

        expect(deletedTeam).toBeUndefined()
    })

    it("update a team", async () => {
        const Team = await createTeam(testTeam)
        await updateTeam(Team.id, {
            name: "the most sickest team ever",
        })
        const updatedTeam = await getTeam(Team.id)

        expect(updatedTeam?.name).toEqual("the most sickest team ever")
    })

    it("gets teams", async () => {
        await createTeam(testTeam)
        const Teams = await getTeams()

        expect(Teams.length).toBeGreaterThan(0)
    })
})
