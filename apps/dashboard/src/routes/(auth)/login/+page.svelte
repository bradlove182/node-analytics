<script lang="ts">
    import { LoginForm } from "$components/complex/forms"
    import { getAppTitle } from "$lib/utils/head"
</script>

<svelte:head>
    <title>{getAppTitle("Login")}</title>
</svelte:head>

<div class="grid h-dvh justify-center items-center">
    <LoginForm />
</div>
