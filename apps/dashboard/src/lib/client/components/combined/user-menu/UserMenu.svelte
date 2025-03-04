<script lang="ts">
    import { enhance } from "$app/forms"
    import * as Avatar from "$components/base/avatar"
    import { Button } from "$components/base/button"
    import * as DropdownMenu from "$components/base/dropdown-menu"
    import { ThemeToggle } from "$components/base/theme-toggle"
    import { IconLogout } from "$icons"
    import { useUser } from "$lib/hooks/data"

    const user = $derived(useUser().current)

    let form = $state<HTMLFormElement>()

    const userFallback = $derived(user?.email.slice(0, 2).toUpperCase())

</script>
<form method="POST" use:enhance action="/logout" bind:this={form} class="contents">
    <DropdownMenu.Root>
        <DropdownMenu.Trigger class="hover:cursor-pointer size-10 text-sm rounded-full">
            {#snippet child({ props })}
                <Button size="icon" variant="ghost" {...props}>
                    <Avatar.Root class="pointer-events-none size-full">
                        <Avatar.Image />
                        <Avatar.Fallback>
                            {userFallback}
                        </Avatar.Fallback>
                    </Avatar.Root>
                </Button>
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
                <DropdownMenu.ItemBlank class="justify-between">
                    Theme
                    <div class="pointer-events-auto">
                        <ThemeToggle />
                    </div>
                </DropdownMenu.ItemBlank>
            </DropdownMenu.Group>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onclick={() => form?.submit()} class="justify-between">
                Logout
                <IconLogout />
            </DropdownMenu.Item>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
</form>
