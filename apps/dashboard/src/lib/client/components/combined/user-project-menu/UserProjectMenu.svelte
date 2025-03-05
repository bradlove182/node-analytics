<script lang="ts">
    import { goto } from "$app/navigation"
    import * as Avatar from "$components/base/avatar"
    import { Button } from "$components/base/button"
    import * as DropdownMenu from "$components/base/dropdown-menu"
    import { IconChevronsUpDown, IconPlus } from "$icons"
    import { useProject, useProjects, useUser } from "$lib/hooks/data"
    import { useDialog } from "$lib/hooks/dialog"

    const projects = useProjects()
    const project = useProject()
    const dialog = useDialog()
    const user = useUser()

    const { name, href, fallback } = $derived.by(() => {
        if (project.current) {
            return {
                name: project.current.name,
                href: undefined,
                fallback: project.current.name.slice(0, 1).toUpperCase(),
            }
        }
        return {
            name: "My Account",
            href: "/account",
            fallback: user.current?.email.slice(0, 1).toUpperCase(),
        }
    })

</script>

<DropdownMenu.Root>
    <DropdownMenu.Trigger>
        {#snippet child({ props })}
            <div class="flex items-center gap-1">
                <a class="flex items-center gap-2" {href}>
                    <Avatar.Root class="size-[22px] text-xs">
                        <Avatar.Fallback>
                            {fallback?.slice(0, 1).toUpperCase()}
                        </Avatar.Fallback>
                    </Avatar.Root>
                    <span class="text-sm">
                        {name}
                    </span>
                </a>
                <Button {...props} class="h-10 w-7 text-muted-foreground data-[state=open]:bg-muted" variant="ghost" size="icon">
                    <IconChevronsUpDown />
                </Button>
            </div>
        {/snippet}
    </DropdownMenu.Trigger>
    <DropdownMenu.Content align="start" alignOffset={-16}>
        <DropdownMenu.Group>
            <DropdownMenu.Label>
                Projects
            </DropdownMenu.Label>
            {#each projects.current as proj}
                <DropdownMenu.CheckboxItem
                    checked={proj.id === project.current?.id}
                    onclick={() => goto(`/${proj.id}`)}
                >
                    <Avatar.Root class="size-5 text-xs">
                        <Avatar.Fallback>
                            {proj.name.slice(0, 1).toUpperCase()}
                        </Avatar.Fallback>
                    </Avatar.Root>
                    {proj.name}
                </DropdownMenu.CheckboxItem>
            {/each}
        </DropdownMenu.Group>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onclick={() => dialog.current.dialog = "createProject"}>
            <IconPlus />
            Create Project
        </DropdownMenu.Item>
    </DropdownMenu.Content>
</DropdownMenu.Root>
