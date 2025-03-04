<script lang="ts">
    import type { Project } from "$lib/server/database/types"
    import { goto } from "$app/navigation"
    import { page } from "$app/state"
    import * as Dialog from "$components/base/dialog"
    import { CreateProjectForm } from "$components/complex/forms/create-project"
    import { useProject } from "$lib/hooks/data/project"
    import { useUserProjects } from "$lib/hooks/data/user"
    import { useDialog } from "$lib/hooks/dialog"
    import { untrack } from "svelte"

    const project = useProject()
    const projects = useUserProjects()
    const dialog = useDialog()

    const form = $derived(page.form ?? {})
    const newProject = $derived<Project | undefined>(page.form?.project ?? undefined)

    $effect(() => {
        if (newProject) {
            untrack(() => {
                project.current = newProject
                projects.current.push(newProject)
                dialog.current.open = false
                void goto(`/${newProject.id}`)
            })
        }
    })
</script>

<CreateProjectForm data={{ form }}>
    {#snippet children(Fields, Buttons)}
        <Dialog.Header>
            <Dialog.Title>
                Create Project
            </Dialog.Title>
        </Dialog.Header>
        <Dialog.Description>
            {@render Fields()}
        </Dialog.Description>
        <Dialog.Footer>
            {@render Buttons()}
        </Dialog.Footer>
    {/snippet}
</CreateProjectForm>
