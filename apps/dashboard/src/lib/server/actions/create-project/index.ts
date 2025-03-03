import type { RequestEvent } from "@sveltejs/kit"
import { createProjectFormSchema } from "$components/complex/forms/create-project"
import { createProject } from "$lib/server/project"
import { fail, redirect } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

export async function CreateProject(event: RequestEvent) {
    const { locals } = event
    const form = await superValidate(event, zod(createProjectFormSchema))

    if (!form.valid || !locals.user) {
        return fail(400, { form })
    }

    const project = await createProject(form.data.name, locals.user.id)

    redirect(303, `/${project.id}`)
}
