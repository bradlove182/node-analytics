import type { Project } from "$lib/server/database/types"
import { generateIdFromEntropySize } from "$lib/server/crypto"
import { db } from "$lib/server/database"
import { project } from "$lib/server/database/schemas"
import { eq } from "drizzle-orm"

export async function createProject(name: string) {
    const id = generateIdFromEntropySize(10)
    const projects = await db.insert(project).values({
        id,
        name,
    }).returning()
    return projects.find(proj => proj.id === id)!
}

export async function deleteProject(projectId: Project["id"]) {
    await db.delete(project).where(eq(project.id, projectId))
}

export async function getProject(projectId: Project["id"]) {
    const project = await db.query.project.findFirst({
        where: table => eq(table.id, projectId),
    })
    return project
}

export async function updateProject(projectId: Project["id"], partialProject: Partial<Project>) {
    await db.update(project).set(partialProject).where(eq(project.id, projectId))
}

export async function getProjects() {
    const projects = await db.query.project.findMany()
    return projects
}

export async function getProjectUsers(projectId: Project["id"]) {
    const projectUsers = await db.query.project.findFirst({
        where: table => eq(table.id, projectId),
        with: {
            users: true,
        },
    })
    return projectUsers
}
