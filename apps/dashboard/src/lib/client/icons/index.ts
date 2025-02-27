import type { HTMLAttributes } from "svelte/elements"
import IconLogout from "./IconLogout.svelte"
import IconCheck from "./IconCheck.svelte"

export interface IconProps extends HTMLAttributes<SVGSVGElement> {
    size?: number
}

export {
    IconLogout,
    IconCheck
}
