import type { LayoutServerLoad } from "./$types"
import { getUsersProjects } from "$lib/server/project"
import { redirect } from "@sveltejs/kit"

export const load: LayoutServerLoad = async ({ locals, params }) => {
    if (!locals.user) {
        return redirect(302, "/login")
    }

    const { projectId } = params

    const projects = await getUsersProjects(locals.user.id)
    const project = projects.find(project => project.id === projectId)!

    return {
        user: locals.user,
        projects,
        project,
    }
}
