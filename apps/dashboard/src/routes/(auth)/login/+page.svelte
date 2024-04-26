<script lang="ts">
    import { enhance } from "$app/forms";
    import { Button } from "$lib/components/ui/button";
    import * as Card from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import type { ActionData } from "./$types";

    export let form: ActionData;
    let email: string = "";
</script>

{#if form?.success}
    SUCESS
{/if}

<Card.Root class="w-full max-w-sm">
    <Card.Header>
        <Card.Title class="text-2xl">Login</Card.Title>
        <Card.Description>Enter your email below to login to your account.</Card.Description>
    </Card.Header>
    <form method="POST" use:enhance>
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
            <Button disabled={email?.length === 0} type="submit" class="w-full">Sign in</Button>
        </Card.Footer>
    </form>
</Card.Root>
