<script lang="ts">
    import type { Project } from "$lib/server/database/types"
    import { goto } from "$app/navigation"
    import * as Avatar from "$components/base/avatar"
    import { Button } from "$components/base/button"
    import * as DropdownMenu from "$components/base/dropdown-menu"
    import { IconPlus } from "$icons"
    import { useProject } from "$lib/hooks/data/project"
    import { useUserProjects } from "$lib/hooks/data/user"
    import { useDialog } from "$lib/hooks/dialog"

    const projects = useUserProjects()
    const project = useProject()
    const dialog = useDialog()

    const currentProject = $derived<Project>(project.current ?? projects.current[0])

    const handleOnChangeProject = (proj: Project) => {
        project.current = proj
        goto(`/${proj.id}`)
    }

</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        {#snippet child({ props })}
            <Button variant="outline" {...props}>
                {currentProject.name}
            </Button>
        {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="start">
        <DropdownMenu.Group>
            <DropdownMenu.Label>
                Projects
            </DropdownMenu.Label>
            {#each projects.current as item}
                <DropdownMenu.CheckboxItem
                    checked={item.id === currentProject.id}
                    onclick={() => handleOnChangeProject(item)}
                >
                    <Avatar.Root class="size-5 text-xs">
                        <Avatar.Fallback>
                            {item.name.slice(0, 1).toUpperCase()}
                        </Avatar.Fallback>
                    </Avatar.Root>
                    {item.name}
                </DropdownMenu.CheckboxItem>
            {/each}
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onclick={() => dialog.current.dialog = "createTeam"}>
            <IconPlus />
            Create Project
        </DropdownMenu.Item>
    </DropdownMenu.Content>
</DropdownMenu.Root>
