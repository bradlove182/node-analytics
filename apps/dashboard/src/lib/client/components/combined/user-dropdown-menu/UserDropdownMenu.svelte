<script lang="ts">
    import { enhance } from "$app/forms"
    import * as Avatar from "$components/base/avatar"
    import * as DropdownMenu from "$components/base/dropdown-menu"
    import { useUser } from "$lib/hooks/data/user"

    const user = $derived(useUser().current)

    let form = $state<HTMLFormElement>()

    const userFallback = $derived(user?.email.slice(0, 2).toUpperCase())

</script>
<form method="POST" use:enhance action="/logout" bind:this={form}>
    <DropdownMenu.Root>
        <DropdownMenu.Trigger class="hover:cursor-pointer w-8 h-8 text-sm">
            {#snippet child({ props })}
                <Avatar.Root {...props}>
                    <Avatar.Image />
                    <Avatar.Fallback>
                        {userFallback}
                    </Avatar.Fallback>
                </Avatar.Root>
            {/snippet}
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" class="min-w-[256px]">
            <DropdownMenu.Group>
                <DropdownMenu.GroupHeading class="flex flex-col gap-1">
                    <p>{user?.email}</p>
                    <p class="text-muted-foreground font-normal">{user?.email}</p>
                </DropdownMenu.GroupHeading>
                <DropdownMenu.Item>
                    Dashboard
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                    Account Settings
                </DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Group>
                <DropdownMenu.Item class="hover:bg-transparent">
                    Theme
                </DropdownMenu.Item>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onclick={() => form?.submit()}>
                Logout
            </DropdownMenu.Item>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
</form>
