<script>
    import { Button } from "$lib/components/ui/button";
    import { toggleMode } from "mode-watcher";
</script>

<Button on:click={toggleMode} variant="outline" size="icon">
    <span class="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0">L</span>
    <span class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100">D</span>
    <span class="sr-only">Toggle theme</span>
</Button>
