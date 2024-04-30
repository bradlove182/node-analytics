import type { SVGAttributes } from "svelte/elements";

import IconLoading from "./IconLoading.svelte";

export interface IconProps extends SVGAttributes<SVGSVGElement> {
    color?: string;
    size?: number | string;
    stroke?: string;
    class?: string;
}

export { IconLoading };
