<script lang="ts">
    import type { LayoutProps } from "./$types"
    import { Navigation } from "$components/complex/navigation"
    import { DataProvider } from "$lib/hooks/data"
    import { DialogProvider } from "$lib/hooks/dialog"

    const { children, data }: LayoutProps = $props()

</script>

<DataProvider {data}>
    <DialogProvider>
        <Navigation />
        <main class="container mx-auto px-2 md:px-4 pt-8">
            {@render children()}
        </main>
    </DialogProvider>
</DataProvider>
