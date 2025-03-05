import { useState } from "$lib/hooks/index.svelte"
import DialogProvider from "./DialogProvider.svelte"

export const dialogs = {
    createProject: () => import("$components/complex/dialogs/CreateProjectDialog.svelte").then(module => module.default),
} as const

export function useDialog<K extends keyof typeof dialogs>(key?: K) {
    return useState<{ dialog: K | undefined, open: boolean }>("use-dialog", { dialog: key, open: false })
}

export { DialogProvider }
