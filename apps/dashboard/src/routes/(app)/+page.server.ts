import type { PageServerLoad } from "./$types"
import { getProjects } from "$lib/server/project"
import { redirect } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        return redirect(302, "/login")
    }

    const projects = await getProjects()

    return {
        user: locals.user,
        projects,
    }
}
