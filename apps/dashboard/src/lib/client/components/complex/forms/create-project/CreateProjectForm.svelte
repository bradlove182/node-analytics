<script lang="ts">
    import type { Snippet } from "svelte"
    import type { Infer, SuperValidated } from "sveltekit-superforms"
    import type { CreateProjectFormSchema } from "."
    import * as Form from "$components/base/form"
    import { Input } from "$components/base/input"
    import { superForm } from "sveltekit-superforms"
    import { zodClient } from "sveltekit-superforms/adapters"
    import { createProjectFormSchema } from "."

    const { data, children }: { data: { form: SuperValidated<Infer<CreateProjectFormSchema>> }, children: Snippet<[Fields: Snippet, Buttons: Snippet]> } = $props()

    const form = superForm(data.form, {
        validators: zodClient(createProjectFormSchema),
        dataType: "json",
    })

    const { form: formData, enhance } = form

</script>

{#snippet Fields()}
    <Form.Field {form} name="name">
        <Form.Control>
            {#snippet children({ props })}
                <Form.Label>Project Name</Form.Label>
                <Input {...props} bind:value={$formData.name} />
            {/snippet}
        </Form.Control>
        <Form.FieldErrors />
    </Form.Field>
{/snippet}

{#snippet Buttons()}
    <Form.Button type="submit">Create</Form.Button>
{/snippet}

<form class="contents" method="POST" use:enhance action="?/createProject">
    {@render children(Fields, Buttons)}
</form>
