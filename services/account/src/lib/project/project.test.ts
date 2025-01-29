import { db, type Project, resetDatabase, type Team } from "@api/database"
import { teamTable } from "@api/database/schemas"
import { beforeEach, describe, expect, it } from "vitest"
import { createProject, deleteProject, getProject, getProjects, updateProject } from "."

export const testTeam: Team = {
    id: "lib/project",
    name: "test team",
    createdAt: new Date(),
}

const testProject: Project = {
    id: "lib/project",
    name: "test project",
    createdAt: new Date(),
    teamId: testTeam.id,
}

describe("lib/project", () => {
    beforeEach(async () => {
        await db.insert(teamTable).values(testTeam)

        return async () => {
            await resetDatabase()
        }
    })

    it("create a new project", async () => {
        const project = await createProject(testProject)

        expect(project.id).toEqual(testProject.id)
        expect(project.name).toEqual(testProject.name)
        expect(project.createdAt).toBeInstanceOf(Date)
        expect(project.teamId).toEqual(testProject.teamId)
    })

    it("get a project", async () => {
        await createProject(testProject)
        const project = await getProject(testProject.id)

        expect(project?.id).toEqual(testProject.id)
        expect(project?.name).toEqual(testProject.name)
        expect(project?.createdAt).toBeInstanceOf(Date)
        expect(project?.teamId).toEqual(testProject.teamId)
    })

    it("delete a project", async () => {
        const project = await createProject(testProject)
        await deleteProject(project.id)

        const deletedProject = await getProject(project.id)

        expect(deletedProject).toBeUndefined()
    })

    it("update a project", async () => {
        const project = await createProject(testProject)
        await updateProject(project.id, {
            name: "updated project name",
        })
        const updatedTeam = await getProject(project.id)

        expect(updatedTeam?.name).toEqual("updated project name")
    })

    it("gets projects", async () => {
        await createProject(testProject)
        const projects = await getProjects()

        expect(projects.length).toBeGreaterThan(0)
    })
})
