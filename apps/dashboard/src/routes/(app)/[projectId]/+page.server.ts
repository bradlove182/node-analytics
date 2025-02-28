import type { PageServerLoad } from "./$types"
import { error, redirect } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ locals, parent, url }) => {
    const { user } = locals

    if (!user) {
        return redirect(302, "/login")
    }

    const { project } = await parent()

    if(!project){
        return error(404)
    }

    return {
        user,
    }
}
