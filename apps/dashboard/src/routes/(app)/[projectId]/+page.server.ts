import type { Actions, PageServerLoad } from "./$types"
import { createProjectFormSchema } from "$components/complex/forms/create-project"
import { CreateProject } from "$lib/server/actions/create-project"
import { error, redirect } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

export const load: PageServerLoad = async ({ locals, parent }) => {
    if (!locals.user) {
        return redirect(302, "/login")
    }

    const { projects, projectId } = await parent()

    if (!projects.find(proj => proj.id === projectId)) {
        return error(404)
    }

    return {
        user: locals.user,
        form: await superValidate(zod(createProjectFormSchema)),
    }
}

export const actions: Actions = {
    createProject: CreateProject,
}
