<script lang="ts">
    import { UserMenu } from "$components/combined/user-menu"
    import { UserProjectMenu } from "$components/combined/user-project-menu"
</script>

<header class="px-6 h-[64px] flex items-center border-b justify-between sticky top-0">
    <div class="flex items-center gap-2">
        <a href="/">Analytics</a>
        <UserProjectMenu />
    </div>
    <div>
        <UserMenu />
    </div>
</header>
