<script lang="ts">
    import type { ActionData, PageData } from "./$types";
    import LoginForm from "./login-form.svelte";

    export let data: PageData;
    export let form: ActionData;
</script>

<LoginForm data={form?.form ?? data.form} />
