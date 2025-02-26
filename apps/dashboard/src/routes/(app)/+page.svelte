<script lang="ts">
    import { getAppTitle } from "$lib/utils/head"

    const { data } = $props()

    const { projects, users } = $derived(data)
</script>

<svelte:head>
    <title>{getAppTitle("Dashboard")}</title>
</svelte:head>

{#each projects as project}
    <div>
        {project.name}
    </div>
{/each}

{#each users as user}
    <div>
        {user.email}
    </div>
{/each}
