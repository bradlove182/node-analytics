<script lang="ts">
    import { enhance } from "$app/forms";
    import type { PageProps } from "./$types";

   const { data }: PageProps = $props();

   const { user } = $derived(data);
</script>

{user.id}
{user.email}

<form method="POST" action="?/logout" use:enhance>
    <button type="submit">Logout</button>
</form>