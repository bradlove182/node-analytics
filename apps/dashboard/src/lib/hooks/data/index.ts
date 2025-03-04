import type { Project, User } from "$lib/server/database/types"
import { useState } from "$lib/hooks/index.svelte"
import DataProvider from "./DataProvider.svelte"

function useUser(user?: User) {
    return useState<User | undefined>("user", user)
}

function useProjects(projects: Project[] = []) {
    return useState<Project[]>("userProjects", projects)
}

function useProject(project?: Project) {
    return useState<Project | undefined>("project", project)
}

export { DataProvider, useProject, useProjects, useUser }
