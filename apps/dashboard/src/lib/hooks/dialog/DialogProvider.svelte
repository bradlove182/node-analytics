<script lang="ts">
    import type { Component, Snippet } from "svelte"
    import * as Dialog from "$components/base/dialog"
    import { untrack } from "svelte"
    import { dialogs, useDialog } from "."

    const { children }: { children: Snippet<[]> } = $props()

    let open = $state(false)
    let currentDialog = $state<Promise<Component>>()

    const dialog = useDialog()

    $effect(() => {
        if (dialog.current.key) {
            untrack(() => {
                currentDialog = dialogs[dialog.current.key!]()
                open = true
            })
        }
    })

    $effect(() => {
        if (!open) {
            untrack(() => {
                dialog.current = { key: undefined, props: undefined }
            })
        }
    })

</script>

{@render children()}

<Dialog.Root bind:open>
    <Dialog.Content>
        {#await currentDialog}
            loading...
        {:then CurrentDialog}
            <CurrentDialog {...dialog.current.props} />
        {/await}
    </Dialog.Content>
</Dialog.Root>
