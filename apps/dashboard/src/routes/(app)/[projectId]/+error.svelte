<script lang="ts">
    import { enhance } from "$app/forms"
    import { page } from "$app/state"
    import { Button } from "$components/base/button"
    import { useUser } from "$lib/hooks/data"

    const user = useUser()
</script>

<form method="POST" action="/logout" use:enhance class="flex items-center justify-center size-full">
    <div class="space-y-2 text-center">
        <h1>{page.status}</h1>
        <p>You are signed in as {user.current?.email}</p>
        <Button type="submit">
            Sign in as a different user
        </Button>
    </div>
</form>
