import type { Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { invalidateSession } from "$lib/server/auth/session"
import { fail, redirect } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        return redirect(302, "/signup")
    }

    return {
        user: locals.user,
    }
}

export const actions = {
    logout: async (event) => {
        if (event.locals.session === null) {
            return fail(401)
        }
        invalidateSession(event.locals.session?.id)
        return redirect(302, "/signup")
    },
} satisfies Actions
