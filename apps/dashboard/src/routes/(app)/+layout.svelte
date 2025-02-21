<script lang="ts">
    import type { LayoutProps } from "./$types"
    import { Navigation } from "$components/complex/navigation"

    const { children, data }: LayoutProps = $props()

    const { user } = $derived(data)
</script>

<Navigation {user} />
<main class="container mx-auto px-2 md:px-4 pt-8">
    {@render children()}
</main>
