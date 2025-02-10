<script lang="ts">
   import { enhance } from "$app/forms";
    import Button from "$lib/client/components/atoms/Button.svelte";
</script>



<h1>Sign in</h1>
<form method="POST" use:enhance>
    <Button type="submit" formaction="?/github">
        Sign in with GitHub
    </Button>
    <button formaction="?/google">Sign in with Google</button>
</form>