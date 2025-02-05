<script lang="ts">
    import type { PageProps } from "./$types";

   const { data }: PageProps = $props();

   const { user } = $derived(data);
</script>

{user.id}
{user.email}

<form method="POST" action="?/logout">
    <button type="submit">Logout</button>
</form>