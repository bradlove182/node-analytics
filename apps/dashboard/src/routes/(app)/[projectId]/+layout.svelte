<script lang="ts">
    import type { LayoutProps } from "./$types"
    import { Navigation } from "$components/complex/navigation"
    import { useProject } from "$lib/hooks/data/project"
    import { useUser, useUserProjects } from "$lib/hooks/data/user"

    const { children, data }: LayoutProps = $props()

    // Initialize Data hooks here
    useUser(data.user)
    useUserProjects(data.projects)
    useProject(data.project)
</script>

<Navigation />
<main class="container mx-auto px-2 md:px-4 pt-8">
    {@render children()}
</main>
