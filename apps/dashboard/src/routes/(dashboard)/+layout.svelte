<script lang="ts">
    import { Button } from "@src/lib/components/ui/button";
    import type { LayoutData } from "./$types";
    import { ThemeToggle } from "@src/lib/components/ui/theme-toggle";

    export let data: LayoutData;
    $: ({ session, supabase, user } = data);

    $: logout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error(error);
        }
    };
</script>

<main class="bg-muted/40 mx-auto min-h-screen">
    <header class="flex items-center justify-between bg-background border-b px-4 py-2">
        <h1>Honeycomb Analytics</h1>
        <div class="flex items-center gap-2">
            {#if user}
                <h3>{user?.email}</h3>
                <Button variant="outline" on:click={logout}>Logout</Button>
            {/if}
            <ThemeToggle />
        </div>
    </header>
    <slot />
</main>
