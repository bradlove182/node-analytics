<script lang="ts">
    import { enhance } from "$app/forms";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import * as Pin from "$lib/components/ui/pin";
    import type { ActionData } from "./$types";

    export let form: ActionData;
    let email: string = "";
    let pin: string[] = [];
    let loading: boolean = false;

    $: form?.error, (loading = false);
</script>

{#if form?.error}
    {form.error.message}
{/if}
{#if form?.email}
    <Card.Root class="w-full max-w-sm">
        <Card.Header>
            <Card.Title class="text-2xl">Enter your OTP.</Card.Title>
            <Card.Description>OTP sent to {form.email}.</Card.Description>
        </Card.Header>
        <form method="POST" action="?/verifyOTP" use:enhance on:submit={() => (loading = true)}>
            <input type="hidden" name="email" value={form?.email} />
            <Card.Content class="grid gap-4">
                <fieldset class="grid gap-2">
                    <Pin.Root bind:value={pin} disabled={loading} name="pin" placeholder="">
                        <Pin.Input />
                        <Pin.Input />
                        <Pin.Input />
                        <Pin.Input />
                        <Pin.Input />
                        <Pin.Input />
                    </Pin.Root>
                </fieldset>
            </Card.Content>
            <Card.Footer class="flex gap-2 ">
                <form method="POST" action="?/login" use:enhance>
                    <input type="hidden" name="email" value={form?.email} />
                    <Button type="submit" variant="ghost" class="w-min">Resend OTP</Button>
                </form>
                <Button
                    disabled={!pin.every((item) => item.length > 0) || loading}
                    type="submit"
                    class="w-full"
                >
                    {#if loading}
                        Loading...
                    {:else}
                        Continue
                    {/if}
                </Button>
            </Card.Footer>
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
