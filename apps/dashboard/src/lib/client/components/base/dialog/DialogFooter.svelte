<script lang="ts">
    import type { WithElementRef } from "bits-ui"
    import type { HTMLAttributes } from "svelte/elements"
    import { cn } from "$lib/utils/tailwind"

    let {
        ref = $bindable(null),
        class: className,
        children,
        ...restProps
    }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props()
</script>

<div
    bind:this={ref}
    class={cn("flex flex-col-reverse sm:flex-row sm:justify-end gap-2", className)}
    {...restProps}
>
    {@render children?.()}
</div>
