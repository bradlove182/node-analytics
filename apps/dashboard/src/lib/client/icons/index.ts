import type { HTMLAttributes } from "svelte/elements"
import IconLogout from "./IconLogout.svelte"

export interface IconProps extends HTMLAttributes<SVGSVGElement> {
    size?: number
}

export {
    IconLogout,
}
