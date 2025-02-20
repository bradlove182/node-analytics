<script lang="ts">
    import type { User } from "$lib/server/user"
    import { UserDropdownMenu } from "$components/combined/user-dropdown-menu"

    const { user }: { user: User } = $props()

</script>

<header class="px-6 h-[64px] flex items-center border-b justify-between">
    <div class="flex items-center">
        <span>Analytics</span>
    </div>
    <div>
        <UserDropdownMenu {user} />
    </div>
</header>
