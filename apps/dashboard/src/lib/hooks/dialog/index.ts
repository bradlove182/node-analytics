import type { ComponentProps } from "svelte"
import { useState } from "$lib/hooks/index.svelte"
import DialogProvider from "./DialogProvider.svelte"

export const dialogs = {
    createTeam: () => import("$components/complex/dialogs/CreateProjectDialog.svelte").then(mod => mod.default),
} as const

export function useDialog<K extends keyof typeof dialogs, P extends ComponentProps<typeof dialogs[K]>>(key?: K, props?: P) {
    return useState<{ key?: K, props?: P }>("use-dialog", { key, props })
}

export { DialogProvider }
