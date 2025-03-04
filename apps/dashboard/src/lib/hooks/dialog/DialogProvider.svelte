<script lang="ts">
    import type { Component, Snippet } from "svelte"
    import * as Dialog from "$components/base/dialog"
    import { untrack } from "svelte"
    import { dialogs, useDialog } from "."

    const { children }: { children: Snippet<[]> } = $props()

    let currentDialog = $state<Promise<Component>>()

    const dialog = useDialog()

    $effect(() => {
        if (dialog.current.dialog) {
            untrack(() => {
                currentDialog = dialogs[dialog.current.dialog!]()
                dialog.current.open = true
            })
        }
    })

    $effect(() => {
        if (!dialog.current.open) {
            untrack(() => {
                dialog.current.dialog = undefined
            })
        }
    })

</script>

{@render children()}

<Dialog.Root bind:open={dialog.current.open}>
    <Dialog.Content>
        {#await currentDialog}
            loading...
        {:then CurrentDialog}
            <CurrentDialog />
        {/await}
    </Dialog.Content>
</Dialog.Root>
