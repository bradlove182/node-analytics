<script lang="ts">
    import type { PageData } from "./$types";

    let data: PageData;
</script>

<h1 class="text-lg">Honeycomb Analytics</h1>
{#if data.user}
    {data.user.email}
{/if}
