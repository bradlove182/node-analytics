<script lang="ts">
    import { getAppTitle } from "$lib/utils/head"
    import { ModeWatcher } from "mode-watcher"
    import "../app.css"

    const { children } = $props()
</script>

<svelte:head>
    <title>{getAppTitle()}</title>
</svelte:head>

<ModeWatcher />
{@render children()}
