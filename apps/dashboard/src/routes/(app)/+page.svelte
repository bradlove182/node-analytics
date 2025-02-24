<script lang="ts">
    import { getAppTitle } from "$lib/utils/head"

    const { data } = $props()

    const { projects } = $derived(data)
</script>

<svelte:head>
    <title>{getAppTitle("Dashboard")}</title>
</svelte:head>

{#each projects as project}
    {project.name}
{/each}
