<script lang="ts">
    import { Navigation } from '$lib/client/components/complex/navigation';

	let { children } = $props();
</script>

<Navigation />
<main>
    app
    {@render children()}
</main>