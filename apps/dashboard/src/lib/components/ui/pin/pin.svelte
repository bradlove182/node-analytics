<script lang="ts">
    import { PinInput, type PinInputProps } from "bits-ui";
    import { cn } from "$lib/utils.js";

    type $$Props = PinInputProps;

    let className: $$Props["class"] = undefined;
    export let value: $$Props["value"] = [];
    export { className as class };
</script>

<PinInput.Root bind:value class={cn("flex items-center gap-2", className)} {...$$restProps}>
    <slot />
    <PinInput.HiddenInput />
</PinInput.Root>
