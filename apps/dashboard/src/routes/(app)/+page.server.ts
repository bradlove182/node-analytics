import type { PageServerLoad } from "./$types"
import { getProjects } from "$lib/server/project"
import { getUsers } from "$lib/server/user"
import { redirect } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        return redirect(302, "/login")
    }

    const projects = await getProjects()
    const users = await getUsers()

    return {
        user: locals.user,
        projects,
        users,
    }
}
