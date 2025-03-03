import type { Actions, PageServerLoad } from "./$types"
import { createProjectFormSchema } from "$components/complex/forms/create-project"
import { CreateProject } from "$lib/server/actions/create-project"
import { error, redirect } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

export const load: PageServerLoad = async ({ locals, parent }) => {
    const { user } = locals

    if (!user) {
        return redirect(302, "/login")
    }

    const { project } = await parent()

    if (!project) {
        return error(404)
    }

    return {
        user,
        form: await superValidate(zod(createProjectFormSchema)),
    }
}

export const actions: Actions = {
    createProject: CreateProject,
}
