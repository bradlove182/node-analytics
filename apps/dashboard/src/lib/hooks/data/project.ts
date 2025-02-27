import type { Project } from "$lib/server/database/types"
import { useState } from "$lib/hooks/index.svelte"

export function useProject(project?: Project) {
    return useState<Project | undefined>("project", project)
}
