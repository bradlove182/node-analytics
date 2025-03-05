import type { Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { CreateProject } from "$lib/server/actions/create-project"
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

export const actions = {
    createProject: CreateProject,
} satisfies Actions
