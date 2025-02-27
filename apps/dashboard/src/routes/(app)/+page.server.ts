import type { PageServerLoad } from "./$types"
import { getUsersProjects } from "$lib/server/project"
import { error, redirect } from "@sveltejs/kit"

export const load: PageServerLoad = async ({ locals }) => {
    const { user } = locals

    if (!user) {
        return redirect(302, "/login")
    }

    const projects = await getUsersProjects(user.id)
    const defaultProject = projects[0]

    if (defaultProject) {
        return redirect(302, `/${defaultProject.id}`)
    }

    return error(404)
}
