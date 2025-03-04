import type { HTMLAttributes } from "svelte/elements"
import IconCheck from "./IconCheck.svelte"
import IconLogout from "./IconLogout.svelte"
import IconPlus from "./IconPlus.svelte"
import IconX from "./IconX.svelte"

export interface IconProps extends HTMLAttributes<SVGSVGElement> {
    size?: number
}

export {
    IconCheck,
    IconLogout,
    IconPlus,
    IconX,
}
