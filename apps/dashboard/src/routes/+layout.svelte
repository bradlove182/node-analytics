<script>
    import "../app.css";
    import { ModeWatcher, toggleMode } from "mode-watcher";
    import { Button } from "$lib/components/ui/button";
</script>

<ModeWatcher />
<div class="flex min-h-screen w-full flex-col bg-muted/40">
    <Button on:click={toggleMode} variant="outline">
        <span class="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"> Light </span>
        <span class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100">
            Dark
        </span>
        <span class="sr-only">Toggle theme</span>
    </Button>
    <slot />
</div>
