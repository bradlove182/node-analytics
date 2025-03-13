<script lang="ts">
    import { useProject } from "$lib/hooks/data"
    import { useSearchParams } from "$lib/hooks/index.svelte"
    import { getAppTitle } from "$lib/utils/head"

    const project = useProject()

    const current = $state<{ value: number }>({ value: 0 })

    useSearchParams(current)

</script>

<svelte:head>
    <title>{getAppTitle("Dashboard")}</title>
</svelte:head>

<h1>{project.current?.name}</h1>

<button onclick={() => current.value++}>inc</button>
<button onclick={() => current.value--}>dec</button>
