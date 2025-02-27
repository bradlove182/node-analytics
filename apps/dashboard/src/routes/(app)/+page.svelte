<script lang="ts">
    import { getAppTitle } from "$lib/utils/head"

    const { data } = $props()

    const { projects } = $derived(data)
</script>

<svelte:head>
    <title>{getAppTitle("Dashboard")}</title>
</svelte:head>

{#await projects}
    loading projects...
{:then items}
    {#each items as project}
        <div>
            {project.name} - {project.id}
        </div>
    {/each}
{/await}
