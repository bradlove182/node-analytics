<script lang="ts">
   import { enhance } from "$app/forms";
</script>



<h1>Sign in</h1>
<form method="POST" use:enhance>
    <button formaction="?/github">Sign in with GitHub</button>
    <button formaction="?/google">Sign in with Google</button>
</form>