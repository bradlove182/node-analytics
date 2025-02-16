import type { Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { oAuth } from "$lib/server/actions/auth"
import { redirect } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        return redirect(302, "/")
    }
}

export const actions = oAuth() satisfies Actions
