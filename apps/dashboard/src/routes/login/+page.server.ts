import type { Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { github, setGithubStateCookie } from "$lib/server/auth/github"
import { redirect } from "@sveltejs/kit"
import { generateState } from "arctic"

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        return redirect(302, "/")
    }
}

export const actions = {
    github: async (event) => {
        const state = generateState()
        const url = github.createAuthorizationURL(state, [])

        setGithubStateCookie(event, state)

        return redirect(302, url)
    },
} satisfies Actions
