<script lang="ts">
    import { cn } from "$lib/utils.js";
    import { PinInput, type PinInputInputEvents, type PinInputInputProps } from "bits-ui";

    type $$Props = PinInputInputProps;
    type $$Events = PinInputInputEvents;

    let className: $$Props["class"] = undefined;
    export let value: $$Props["value"] = undefined;
    export { className as class };

    // Workaround for https://github.com/sveltejs/svelte/issues/9305
    // Fixed in Svelte 5, but not backported to 4.x.
    export let readonly: $$Props["readonly"] = undefined;
</script>

<PinInput.Input
    class={cn(
        "flex text-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
    )}
    bind:value
    {readonly}
    on:blur
    on:change
    on:focus
    on:keydown
    on:paste
    on:input
    {...$$restProps}
/>
