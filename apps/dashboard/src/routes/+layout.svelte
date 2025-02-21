<script lang="ts">
    import { getAppTitle } from "$lib/utils/head"
    import "../app.css"

    const { children } = $props()
</script>

<svelte:head>
    <title>{getAppTitle()}</title>
</svelte:head>

{@render children()}
