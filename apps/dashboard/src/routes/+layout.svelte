<script lang="ts">
    import "@src/app.css";
    import { goto, invalidate } from "$app/navigation";
    import { onMount } from "svelte";
    import { ModeWatcher as ThemeWatcher } from "mode-watcher";
    import { Button } from "$lib/components/ui/button";
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

    onMount(() => {
        const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
            if (!newSession) {
                /**
                 * Queue this as a task so the navigation won't prevent the
                 * triggering function from completing
                 */
                setTimeout(() => {
                    goto("/", { invalidateAll: true });
                });
            }
            if (newSession?.expires_at !== session?.expires_at) {
                invalidate("supabase:auth");
            }
        });

        return () => data.subscription.unsubscribe();
    });
</script>

<ThemeWatcher />
<slot />
