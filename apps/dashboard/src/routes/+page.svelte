<script lang="ts">
    import type { PageProps } from "./$types";

   const { data }: PageProps = $props();

   const { user } = $derived(data);
</script>

{user.id}
{user.email}