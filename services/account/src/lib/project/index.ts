import { db, type Project } from "@api/database";
import { projectTable } from "@api/database/schemas";
import { eq } from "drizzle-orm";

export async function createProject(project: Project) {
    await db.insert(projectTable).values(project)
    return project
}

export async function deleteProject(projectId: Project["id"]) {
    await db.delete(projectTable).where(eq(projectTable.id, projectId))
}

export async function getProject(projectId: Project["id"]) {
    const project = await db.query.projectTable.findFirst({
        where: projectTable => eq(projectTable.id, projectId)
    })
    return project
}

export async function updateProject(projectId: Project["id"], project: Partial<Project>) {
    await db.update(projectTable).set(project).where(eq(projectTable.id, projectId))
}

export async function getProjects() {
    const projects = await db.query.projectTable.findMany()
    return projects
}