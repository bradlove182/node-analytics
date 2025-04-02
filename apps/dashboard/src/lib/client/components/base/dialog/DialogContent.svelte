<script lang="ts">
    import type { WithoutChildrenOrChild } from "bits-ui"
    import type { Snippet } from "svelte"
    import { cn } from "$lib/utils/tailwind"
    import { Dialog as DialogPrimitive } from "bits-ui"
    import * as Dialog from "./index"

    let {
        ref = $bindable(null),
        class: className,
        portalProps,
        children,
        ...restProps
    }: WithoutChildrenOrChild<DialogPrimitive.ContentProps> & {
        portalProps?: DialogPrimitive.PortalProps
        children: Snippet
    } = $props()
</script>

<Dialog.Portal {...portalProps}>
    <Dialog.Overlay />
    <DialogPrimitive.Content
        bind:ref
        class={cn(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=open]:slide-in-from-left-1/2 fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border p-6 shadow-lg duration-200 sm:rounded-lg",
            className,
        )}
        {...restProps}
    >
        {@render children?.()}
    </DialogPrimitive.Content>
</Dialog.Portal>
