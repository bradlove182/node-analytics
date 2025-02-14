<script lang="ts">
    import { enhance } from "$app/forms";
    import { Button } from "$lib/client/components/base/button";
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "$lib/client/components/base/card";

    let loading = $state<boolean>(false);

    const disabled = $derived(loading);
</script>

<Card class="min-w-100">
    <CardHeader>
        <CardTitle level={1}>Login</CardTitle>
        <CardDescription>Select a provider below</CardDescription>
    </CardHeader>
    <CardContent>
        <form
            method="POST"
            use:enhance
            onsubmit={() => loading = true}
        >
            <fieldset class="flex gap-4" {disabled}>
                <Button variant="outline" class="w-full" type="submit" formaction="/login?/github">
                    GitHub
                </Button>
                <Button variant="outline" class="w-full" type="submit" formaction="/login?/google">
                    Google
                </Button>
            </fieldset>
        </form>
    </CardContent>
    <CardFooter>
        <Button class="w-full" variant="link" href="/signup">Dont have an account? Sign up.</Button>
    </CardFooter>
</Card>
