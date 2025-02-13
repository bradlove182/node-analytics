<script lang="ts">
    import { enhance } from "$app/forms";
    import { Button } from "$lib/client/components/base/button";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/client/components/base/card";

    let loading = $state<boolean>(false);

    const disabled = $derived(loading);
</script>

<Card class="min-w-100">
    <CardHeader>
        <CardTitle level={1}>Sign In</CardTitle>
        <CardDescription>Choose a auth provider</CardDescription>
    </CardHeader>
    <CardContent>
        <form method="POST" use:enhance onsubmit={() => loading = true}>
            <fieldset class="flex flex-col gap-4" {disabled}>
                <Button type="submit" formaction="/login?/github">
                    Sign in with GitHub
                </Button>
                <Button type="submit" formaction="/login?/google">
                    Sign in with Google
                </Button>
            </fieldset>
        </form>
    </CardContent>
</Card>
