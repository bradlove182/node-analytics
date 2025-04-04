import type { LayoutServerLoad } from "./$types"
import { redirect } from "@sveltejs/kit"

export const load: LayoutServerLoad = async ({ locals, params }) => {
    if (!locals.user) {
        return redirect(302, "/login")
    }

    const { projectId } = params

    return {
        projectId,
    }
}
