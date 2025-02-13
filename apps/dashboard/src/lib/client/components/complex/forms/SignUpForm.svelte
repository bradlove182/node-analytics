<script lang="ts">
    import { enhance } from "$app/forms";
    import { Button } from "$lib/client/components/base/button";
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/client/components/base/card";

    let loading = $state<boolean>(false);

    const disabled = $derived(loading);
</script>

<Card class="min-w-100">
    <CardHeader>
        <CardTitle level={1}>Sign up risk-free</CardTitle>
        <CardDescription>Choose a auth provider</CardDescription>
    </CardHeader>
    <CardContent>
        <form method="POST" use:enhance onsubmit={() => loading = true}>
            <fieldset class="flex gap-4" {disabled}>
                <Button class="w-full" type="submit" formaction="/signup?/github">
                    GitHub
                </Button>
                <Button class="w-full" type="submit" formaction="/signup?/google">
                    Google
                </Button>
            </fieldset>
        </form>
    </CardContent>
</Card>
