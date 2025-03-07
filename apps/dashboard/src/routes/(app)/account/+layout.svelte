<script lang="ts">
    import type { LayoutProps } from "./$types"
    import { SubNavigation } from "$components/complex/navigation"

    const { children }: LayoutProps = $props()
</script>

<SubNavigation items={[{ label: "Overview", href: "/account" }, { label: "Settings", href: "/account/settings" }]} />
{@render children()}
