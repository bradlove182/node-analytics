<script lang="ts">
    import type { IconProps } from "."

    const { size = 16, ...rest }: IconProps = $props()
</script>

<svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" {...rest}>
    <path d="M18 6 6 18"/>
    <path d="m6 6 12 12"/>
</svg>