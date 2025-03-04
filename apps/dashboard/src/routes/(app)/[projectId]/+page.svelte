<script lang="ts">
    import { useProject } from "$lib/hooks/data/project"
    import { getAppTitle } from "$lib/utils/head"

    const project = useProject()

</script>

<svelte:head>
    <title>{getAppTitle("Dashboard")}</title>
</svelte:head>

<h1>{project.current?.name}</h1>
