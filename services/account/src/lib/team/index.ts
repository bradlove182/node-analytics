import { db, type Team } from "@api/database"
import { teamTable } from "@api/database/schemas"
import { eq } from "drizzle-orm"

export async function createTeam(team: Team) {
    await db.insert(teamTable).values(team)
    return team
}

export async function deleteTeam(teamId: Team["id"]) {
    await db.delete(teamTable).where(eq(teamTable.id, teamId))
}

export async function getTeam(teamId: Team["id"]) {
    const team = await db.query.teamTable.findFirst({
        where: teamTable => eq(teamTable.id, teamId),
    })
    return team
}

export async function updateTeam(teamId: Team["id"], team: Partial<Team>) {
    await db.update(teamTable).set(team).where(eq(teamTable.id, teamId))
}

export async function getTeams() {
    const teams = await db.query.teamTable.findMany()
    return teams
}
