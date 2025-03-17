<script lang="ts">
    import type { Snippet } from "svelte"

    interface Props {
        children: Snippet<[]>
    }

    const { children }: Props = $props()
</script>

<div class="grid grid-cols-[var(--layout-margin)_var(--layout-width)_var(--layout-margin)] grid-rows-[0_auto] auto-rows-fr relative">
    <section class="row-start-2 row-end-2 col-start-2 col-end-2">
        {@render children()}
    </section>
</div>
