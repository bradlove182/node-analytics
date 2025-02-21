<script lang="ts">
    import type { User } from "$lib/server/user"
    import { enhance } from "$app/forms"
    import { Avatar, AvatarFallback, AvatarImage } from "$components/base/avatar"
    import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "$components/base/dropdown-menu"

    interface Props {
        user: User
    }

    const { user }: Props = $props()

    let ref = $state<HTMLFormElement>()

    const userFallback = $derived(user.email.slice(0, 2).toUpperCase())

</script>
<form method="POST" use:enhance action="/logout" bind:this={ref}>
    <DropdownMenu>
        <DropdownMenuTrigger>
            {#snippet child({ props })}
                <Avatar {...props} class="hover:cursor-pointer">
                    <AvatarImage />
                    <AvatarFallback>
                        {userFallback}
                    </AvatarFallback>
                </Avatar>
            {/snippet}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem class="flex items-center gap-2">
                <Avatar class="h-7 w-7 text-xs">
                    <AvatarImage />
                    <AvatarFallback>
                        {userFallback}
                    </AvatarFallback>
                </Avatar>
                {user.email}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onclick={() => ref?.submit()}>
                Logout
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</form>
