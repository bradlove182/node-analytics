<script lang="ts">
    import { page } from "$app/state"
    import * as Dialog from "$components/base/dialog"
    import { CreateProjectForm } from "$components/complex/forms/create-project"

    const form = $derived(page.form ?? {})
</script>

<CreateProjectForm data={{ form }}>
    {#snippet children(Fields, Buttons)}
        <Dialog.Header>
            <Dialog.Title>
                Create Project
            </Dialog.Title>
        </Dialog.Header>
        <Dialog.Description>
            {@render Fields()}
        </Dialog.Description>
        <Dialog.Footer>
            {@render Buttons()}
        </Dialog.Footer>
    {/snippet}
</CreateProjectForm>
