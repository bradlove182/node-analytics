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
        <main>
            {@render children()}
        </main>
    </DialogProvider>
</DataProvider>
