<script lang="ts">
    import type { PageProps } from "./$types"
    import { enhance } from "$app/forms"

    const { data }: PageProps = $props()

    const { user } = $derived(data)
</script>

{user.id}
{user.email}

<form method="POST" action="?/logout" use:enhance>
    <button type="submit">Logout</button>
</form>
