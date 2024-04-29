<script lang="ts">
    import { enhance } from "$app/forms";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import type { ActionData } from "./$types";

    export let form: ActionData;
    let email: string = "";
    let otp: string = "";
    let loading: boolean = false;
</script>

{#if form?.success}
    <Card.Root class="w-full max-w-sm">
        <Card.Header>
            <Card.Title class="text-2xl">One time password sent.</Card.Title>
            <Card.Description>Check your email for your OTP.</Card.Description>
        </Card.Header>
        <form method="POST" action="?/verifyOTP" use:enhance on:submit={() => (loading = true)}>
            <Card.Content class="grid gap-4">
                <div class="grid gap-2">
                    <Label for="email">One time password</Label>
                    <Input
                        bind:value={otp}
                        name="email"
                        id="email"
                        type="number"
                        placeholder="xxxxxx"
                    />
                </div>
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
                <div class="grid gap-2">
                    <Label for="email">Email</Label>
                    <Input
                        bind:value={email}
                        name="email"
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                    />
                </div>
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
