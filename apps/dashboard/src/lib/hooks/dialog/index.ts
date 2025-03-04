import { useState } from "$lib/hooks/index.svelte"
import DialogProvider from "./DialogProvider.svelte"

export const dialogs = {
    createTeam: () => import("$components/complex/dialogs/CreateProjectDialog.svelte").then(mod => mod.default),
} as const

export function useDialog<K extends keyof typeof dialogs>(key?: K) {
    return useState<{ dialog: K | undefined, open: boolean }>("use-dialog", { dialog: key, open: false })
}

export { DialogProvider }
