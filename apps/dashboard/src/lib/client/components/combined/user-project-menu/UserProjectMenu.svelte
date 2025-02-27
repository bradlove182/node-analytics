<script lang="ts">
    import { Button } from "$components/base/button"
    import * as DropdownMenu from "$components/base/dropdown-menu"
    import { useProject } from "$lib/hooks/data/project"
    import { useUserProjects } from "$lib/hooks/data/user"
    import { type Project } from "$lib/server/database/types";

    const projects = useUserProjects()
    const project = useProject()

    const currentProject = $state<Project>(project.current ?? projects.current[0])

</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        {#snippet child({ props })}
            <Button {...props}>
                {currentProject.name}
            </Button>
        {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content>
        <DropdownMenu.Group>
            <DropdownMenu.Label>
                Projects
            </DropdownMenu.Label>
            {#each projects.current as item}
                <DropdownMenu.CheckboxItem checked={item.id === currentProject.id}>
                    {item.name}
                </DropdownMenu.CheckboxItem>
            {/each}
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>
            Create Project
        </DropdownMenu.Item>
    </DropdownMenu.Content>
</DropdownMenu.Root>
