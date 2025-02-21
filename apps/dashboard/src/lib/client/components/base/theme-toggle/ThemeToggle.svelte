<script lang="ts">
    import { cn } from "$lib/utils/tailwind"
    import { RadioGroup } from "bits-ui"
    import { mode, setMode } from "mode-watcher"

    interface ThemeOption {
        label: string
        value: "light" | "dark" | "system"
    }

    const options: ThemeOption[] = [
        {
            label: "Light",
            value: "light",
        },
        {
            label: "Dark",
            value: "dark",
        },
    ]

</script>

<RadioGroup.Root
    value={$mode}
    orientation="horizontal"
    class="flex items-center rounded-full shadow-[0_0_0_1px_var(--tw-shadow-color)] shadow-border h-6"
>
    {#each options as { label, value }}
        {@const id = `theme-switcher-${value}`}
        <span class="h-full">
            <RadioGroup.Item
                onclick={() => setMode(value)}
                {id}
                {value}
                class={cn(
                    "text-xs text-muted-foreground hover:text-foreground hover:cursor-pointer h-6 px-3 flex items-center justify-center rounded-full shadow-[0_0_0_1px_var(--tw-shadow-color)]",
                    $mode === value && "shadow-border text-foreground bg-muted",
                )}
            >
                {label}
            </RadioGroup.Item>
        </span>

    {/each}
</RadioGroup.Root>
