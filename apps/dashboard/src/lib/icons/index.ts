import type { SVGAttributes } from "svelte/elements";

import IconLoading from "./icon-loading.svelte";

export interface IconProps extends SVGAttributes<SVGSVGElement> {
    size?: number | string;
    class?: string;
}

export { IconLoading };
