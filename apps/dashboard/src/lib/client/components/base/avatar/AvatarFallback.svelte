<script lang="ts">
    import { cn } from "$lib/utils/tailwind"
    import { Avatar as AvatarPrimitive } from "bits-ui"

    let {
        class: className,
        ref = $bindable(null),
        ...restProps
    }: AvatarPrimitive.FallbackProps = $props()
</script>

<AvatarPrimitive.Fallback
    bind:ref
    class={cn("bg-muted flex size-full items-center justify-center font-semibold", className)}
    {...restProps}
/>
