<script lang="ts">
    import type { LayoutProps } from "./$types"
    import { Navigation } from "$components/complex/navigation"

    const { children, data }: LayoutProps = $props()

    const { user } = $derived(data)
</script>

<Navigation {user} />
<main>
    {@render children()}
</main>
