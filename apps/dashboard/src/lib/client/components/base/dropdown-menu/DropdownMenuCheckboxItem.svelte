<script lang="ts">
    import type { WithoutChildrenOrChild } from "bits-ui"
    import type { Snippet } from "svelte"
    import { cn } from "$lib/utils/tailwind"
    import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui"
    import { IconCheck } from "$icons";

    let {
        ref = $bindable(null),
        class: className,
        children: childrenProp,
        checked = $bindable(false),
        indeterminate = $bindable(false),
        ...restProps
    }: WithoutChildrenOrChild<DropdownMenuPrimitive.CheckboxItemProps> & {
        children?: Snippet
    } = $props()
</script>

<DropdownMenuPrimitive.CheckboxItem
    bind:ref
    bind:checked
    bind:indeterminate
    class={cn(
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
    )}
    {...restProps}
>
    {#snippet children({ checked, indeterminate })}
        <span class="absolute left-2 flex size-3.5 items-center justify-center">
            {#if indeterminate}
                <span class="size-4">
                    minus
                </span>
            {:else}
                <span class={cn("size-4", !checked && "text-transparent")}>
                    <IconCheck />
                </span>
            {/if}
        </span>
        {@render childrenProp?.()}
    {/snippet}
</DropdownMenuPrimitive.CheckboxItem>
