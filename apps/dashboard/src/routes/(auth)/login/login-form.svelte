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
        resetForm: false,
    });

    const { form: formData, enhance, submitting, posted } = form;
</script>

<form method="POST" action="?/login" use:enhance class="contents">
    <Card.Root class="w-full max-w-sm">
        <Card.Header>
            {#if $posted}
                <Card.Title class="text-2xl">Magic link sent</Card.Title>
                <Card.Description>
                    A magic link has been sent to {$formData.email}.
                </Card.Description>
            {:else}
                <Card.Title class="text-2xl">Login</Card.Title>
                <Card.Description>
                    Enter your email below to login to your account.
                </Card.Description>
            {/if}
        </Card.Header>
        <Card.Content class="grid gap-4">
            <Form.Field {form} name="email">
                <Form.Control let:attrs>
                    {#if !$posted}
                        <Form.Label>Email</Form.Label>
                    {/if}
                    <Input
                        type={$posted ? "hidden" : "text"}
                        {...attrs}
                        bind:value={$formData.email}
                        placeholder="john@doe.com"
                    />
                    <Form.FieldErrors />
                </Form.Control>
            </Form.Field>
        </Card.Content>
        <Card.Footer>
            <Form.Button disabled={$formData.email.length === 0 || $submitting} class="w-full">
                {#if $submitting}
                    <IconLoading />
                {:else if $posted}
                    Resend
                {:else}
                    Continue
                {/if}
            </Form.Button>
        </Card.Footer>
    </Card.Root>
</form>
