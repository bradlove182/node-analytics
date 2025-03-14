<script lang="ts">
    import { page } from "$app/state"
    import { Button } from "$components/base/button"

    interface Props {
        items: { label: string, href: string }[]
    }

    const { items }: Props = $props()

</script>

<div class="flex w-full sticky top-0 border-b -mt-1 bg-card">
    <div class="flex items-center gap-1 px-4 py-1">
        {#each items as { label, href }}
            <Button
                variant={page.url.pathname === href ? "secondary" : "ghost"}
                {href}
            >
                {label}
            </Button>
        {/each}
    </div>
</div>
