<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { loginSchema, type LoginSchema } from "./schema";

    export let data: SuperValidated<Infer<LoginSchema>>;

    const form = superForm(data, {
        validators: zodClient(loginSchema),
    });

    const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
    <Form.Field {form} name="email">
        <Form.Control let:attrs>
            <Form.Label>Email</Form.Label>
            <Input {...attrs} bind:value={$formData.email} />
        </Form.Control>
        <Form.Description>This is your public display name.</Form.Description>
        <Form.FieldErrors />
    </Form.Field>
    <Form.Button>Submit</Form.Button>
</form>
