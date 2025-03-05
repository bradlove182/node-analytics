<script lang="ts">
    import type { Project, User } from "$lib/server/database/types"
    import type { Snippet } from "svelte"
    import { useProject, useProjects, useUser } from "."

    interface Props {
        data: {
            user: User
            projects: Project[]
            projectId?: Project["id"]
        }
        children: Snippet<[]>
    }

    const { data, children }: Props = $props()

    // Initialize Data hooks
    const user = useUser(data.user)
    const projects = useProjects(data.projects)
    const project = useProject(data.projects.find(proj => proj.id === data.projectId))

    // Update current projects
    $effect(() => {
        if (data.projects.length !== projects.current.length) {
            projects.current = data.projects
        }
    })

    // Update current project
    $effect(() => {
        if (data.projectId !== project.current?.id) {
            project.current = data.projects.find(proj => proj.id === data.projectId)
        }
    })

    // Update current user
    $effect(() => {
        if (data.user.id !== user.current?.id || data.user === undefined) {
            user.current = data.user
        }
    })
</script>

{@render children()}
