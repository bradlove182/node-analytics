<script lang="ts">
    import type { LayoutProps } from "./$types"
    import { Layout } from "$components/base/layout"
    import { SubNavigation } from "$components/complex/navigation"

    const { children, data }: LayoutProps = $props()
</script>

<SubNavigation items={[
    { label: "Overview", href: `/${data.projectId}` },
    { label: "Settings", href: `/${data.projectId}/settings` },
]} />
<Layout>
    {@render children()}
</Layout>
