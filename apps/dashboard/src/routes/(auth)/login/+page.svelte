<script lang="ts">
    import { enhance } from "$app/forms";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import type { ActionData } from "./$types";
    import * as Pin from "@src/lib/components/ui/pin";

    export let form: ActionData;
    let email: string = "";
    let loading: boolean = false;
    let otpForm: HTMLFormElement;

    $: form?.error, (loading = false);
</script>

{#if form?.error}
    {form.error.message}
{/if}
{#if form?.email}
    <Card.Root class="w-full max-w-sm">
        <Card.Header>
            <Card.Title class="text-2xl">One time password.</Card.Title>
            <Card.Description>Check your email for your OTP.</Card.Description>
        </Card.Header>
        <form
            method="POST"
            action="?/verifyOTP"
            bind:this={otpForm}
            use:enhance
            on:submit={() => (loading = true)}
        >
            <input type="hidden" name="email" value={form?.email} />
            <Card.Content class="grid gap-4">
                <fieldset class="grid gap-2">
                    <Pin.Root disabled={loading} name="pin" placeholder="0">
                        <Pin.Input />
                        <Pin.Input />
                        <Pin.Input />
                        <Pin.Input />
                        <Pin.Input />
                        <Pin.Input on:change={() => otpForm.requestSubmit()} />
                    </Pin.Root>
                </fieldset>
            </Card.Content>
        </form>
    </Card.Root>
{:else}
    <Card.Root class="w-full max-w-sm">
        <Card.Header>
            <Card.Title class="text-2xl">Login</Card.Title>
            <Card.Description>Enter your email below to login to your account.</Card.Description>
        </Card.Header>
        <form method="POST" action="?/login" use:enhance on:submit={() => (loading = true)}>
            <Card.Content class="grid gap-4">
                <fieldset class="grid gap-2" disabled={loading}>
                    <Label for="email">Email</Label>
                    <Input
                        bind:value={email}
                        name="email"
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                    />
                </fieldset>
            </Card.Content>
            <Card.Footer>
                <Button disabled={email?.length === 0 || loading} type="submit" class="w-full">
                    {#if loading}
                        Loading...
                    {:else}
                        Sign in
                    {/if}
                </Button>
            </Card.Footer>
        </form>
    </Card.Root>
{/if}
