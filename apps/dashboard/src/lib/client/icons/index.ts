import type { HTMLAttributes } from "svelte/elements"
import IconCheck from "./IconCheck.svelte"
import IconChevronsUpDown from "./IconChevronsUpDown.svelte"
import IconLogout from "./IconLogout.svelte"
import IconPlus from "./IconPlus.svelte"
import IconSnail from "./IconSnail.svelte"
import IconX from "./IconX.svelte"

export interface IconProps extends HTMLAttributes<SVGSVGElement> {
    size?: number
}

export {
    IconCheck,
    IconChevronsUpDown,
    IconLogout,
    IconPlus,
    IconSnail,
    IconX,
}
