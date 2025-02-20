import type { Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { logout } from "$lib/server/actions/auth"

export const load: PageServerLoad = async (event) => {
    return logout(event)
}

export const actions = {
    default: logout,
} satisfies Actions
