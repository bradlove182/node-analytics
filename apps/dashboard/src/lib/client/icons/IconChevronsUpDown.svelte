<script lang="ts">
    import type { IconProps } from "."

    const { size = 16, ...rest }: IconProps = $props()
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...rest}>
    <path d="m7 15 5 5 5-5" />
    <path d="m7 9 5-5 5 5" />
</svg>
