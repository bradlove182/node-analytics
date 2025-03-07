<script lang="ts">
    import { UserMenu } from "$components/combined/user-menu"
    import { UserProjectMenu } from "$components/combined/user-project-menu"
</script>

<header class="px-6 h-[64px] justify-between">
    <nav class="flex items-center justify-between size-full">
        <div class="flex items-center gap-6">
            <a href="/">Analytics</a>
            <UserProjectMenu />
        </div>
        <div>
            <UserMenu />
        </div>
    </nav>
</header>
