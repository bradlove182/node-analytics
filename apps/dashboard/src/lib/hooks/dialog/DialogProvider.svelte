<script lang="ts">
    import type { Component, Snippet } from "svelte"
    import * as Dialog from "$components/base/dialog"
    import { untrack } from "svelte"
    import { dialogs, useDialog } from "."

    const { children }: { children: Snippet<[]> } = $props()

    let currentDialog = $state<Promise<Component>>()

    const dialog = useDialog()

    let open = $state(false)

    $effect(() => {
        if (dialog.current) {
            untrack(() => {
                currentDialog = dialogs[dialog.current!]()
                open = true
            })
        }
    })

    $effect(() => {
        if (!open) {
            // We set a timeout to account for exit animations
            setTimeout(() => {
                currentDialog = undefined
                dialog.current = undefined
            }, 200)
        }
    })

</script>

{@render children()}

<Dialog.Root bind:open>
    <Dialog.Content>
        {#await currentDialog}
            loading...
        {:then CurrentDialog}
            <CurrentDialog />
        {/await}
    </Dialog.Content>
</Dialog.Root>
