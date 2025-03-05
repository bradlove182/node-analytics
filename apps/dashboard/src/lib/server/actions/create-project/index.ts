import type { RequestEvent } from "@sveltejs/kit"
import { createProjectFormSchema } from "$components/complex/forms/create-project"
import { createProject } from "$lib/server/project"
import { error, fail } from "@sveltejs/kit"
import { superValidate } from "sveltekit-superforms"
import { zod } from "sveltekit-superforms/adapters"

export async function CreateProject(event: RequestEvent) {
    const { locals } = event
    const form = await superValidate(event, zod(createProjectFormSchema))

    if (!locals.user) {
        return error(500)
    }

    if (!form.valid) {
        return fail(400, { form })
    }

    const project = await createProject(form.data.name, locals.user.id)

    return { form, project }
}
