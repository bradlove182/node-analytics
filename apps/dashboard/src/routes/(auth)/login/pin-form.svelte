<script lang="ts">
    import * as Card from "$lib/components/ui/card";
    import * as Form from "$lib/components/ui/form";
    import * as Pin from "$lib/components/ui/pin";
    import { IconLoading } from "$lib/icons";
    import { superForm, type Infer, type SuperValidated } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
    import { pinSchema, type LoginSchema, type PinSchema } from "./schema";

    export let data: SuperValidated<Infer<PinSchema>>;
    export let loginData: SuperValidated<Infer<LoginSchema>>;

    const form = superForm(data, {
        validators: zodClient(pinSchema),
    });

    const { form: formData, enhance, submitting } = form;

    $: $formData.email = loginData.data.email;
</script>

<Card.Root class="w-full max-w-sm">
    <Card.Header>
        <Card.Title class="text-2xl">Enter your OTP.</Card.Title>
        <Card.Description>OTP sent to {loginData.data.email}.</Card.Description>
    </Card.Header>
    <form method="POST" action="?/verifyOTP" use:enhance>
        <Card.Content class="grid gap-4">
            <Form.Field {form} name="pin">
                <Form.Control let:attrs>
                    <Pin.Root {...attrs} bind:value={$formData.pin} placeholder="">
                        <Pin.Input />
                        <Pin.Input />
                        <Pin.Input />
                        <Pin.Input />
                        <Pin.Input />
                        <Pin.Input />
                    </Pin.Root>
                    <Form.FieldErrors />
                </Form.Control>
            </Form.Field>
        </Card.Content>
        <Card.Footer class="flex gap-2">
            <Form.Button variant="ghost" formaction="?/resendOTP">Resend</Form.Button>
            <Form.Button
                disabled={!$formData.pin.every((item) => item.length > 0) || $submitting}
                class="w-full"
            >
                {#if $submitting}
                    <IconLoading />
                {:else}
                    Continue
                {/if}
            </Form.Button>
        </Card.Footer>
    </form>
</Card.Root>
