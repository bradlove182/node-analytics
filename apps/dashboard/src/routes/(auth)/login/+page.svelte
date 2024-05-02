<script lang="ts">
    import type { ActionData, PageData } from "./$types";
    import LoginForm from "./login-form.svelte";
    import PinForm from "./pin-form.svelte";

    export let data: PageData;
    export let form: ActionData;
</script>

{#if form?.form?.data.email}
    <PinForm data={data.pinForm} loginData={form.form} />
{:else}
    <LoginForm data={data.loginForm} />
{/if}
