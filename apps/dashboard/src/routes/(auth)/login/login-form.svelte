<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import { IconLoading } from "$lib/icons";
    import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { loginSchema, type LoginSchema } from "./schema";

    export let data: SuperValidated<Infer<LoginSchema>>;

    const form = superForm(data, {
        validators: zodClient(loginSchema),
    });

    const { form: formData, enhance, submitting } = form;
</script>

<Card.Root class="w-full max-w-sm">
    <Card.Header>
        <Card.Title class="text-2xl">Login</Card.Title>
        <Card.Description>Enter your email below to login to your account.</Card.Description>
    </Card.Header>
    <form method="POST" action="?/login" use:enhance>
        <Card.Content class="grid gap-4">
            <Form.Field {form} name="email">
                <Form.Control let:attrs>
                    <Form.Label>Email</Form.Label>
                    <Input {...attrs} bind:value={$formData.email} placeholder="john@doe.com" />
                    <Form.FieldErrors />
                </Form.Control>
            </Form.Field>
        </Card.Content>
        <Card.Footer>
            <Form.Button disabled={$formData.email.length === 0 || $submitting} class="w-full">
                {#if $submitting}
                    <IconLoading />
                {:else}
                    Continue
                {/if}
            </Form.Button>
        </Card.Footer>
    </form>
</Card.Root>
