import type { Project } from "$lib/server/database/types"
import type { User } from "$lib/server/user"
import { useState } from "$lib/hooks/index.svelte"

export function useUser(user?: User) {
    return useState<User | undefined>("user", user)
}

export function useUserProjects(projects: Project[] = []) {
    return useState<Project[]>("userProjects", projects)
}
