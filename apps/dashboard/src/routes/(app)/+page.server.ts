import type { PageServerLoad } from "./$types"
import { getUsersProjects } from "$lib/server/project"
import { redirect } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ locals }) => {
    const { user } = locals

    if (!user) {
        return redirect(302, "/login")
    }

    return {
        user,
        projects: getUsersProjects(user.id),
    }
}
