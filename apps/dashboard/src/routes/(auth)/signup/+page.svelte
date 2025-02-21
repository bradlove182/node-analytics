<script lang="ts">
    import { SignUpForm } from "$components/complex/forms"
    import { getAppTitle } from "$lib/utils/head"
</script>

<svelte:head>
    <title>{getAppTitle("Sign up")}</title>
</svelte:head>

<div class="grid h-dvh justify-center items-center">
    <SignUpForm />
</div>
