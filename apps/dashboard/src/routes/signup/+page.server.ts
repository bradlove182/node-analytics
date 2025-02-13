import type { Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { github, setGithubStateCookie } from "$lib/server/auth/github"
import { google, setGoogleAuthCookie } from "$lib/server/auth/google"
import { redirect } from "@sveltejs/kit"
import { generateCodeVerifier, generateState } from "arctic"

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        return redirect(302, "/")
    }
}

export const actions = {
    github: async (event) => {
        const state = generateState()
        const url = github.createAuthorizationURL(state, ["user:email"])

        setGithubStateCookie(event, state)

        return redirect(302, url)
    },
    google: async (event) => {
        const state = generateState()
        const codeVerifier = generateCodeVerifier()
        // Add the openid and profile scope to have access to the user's google profile
        const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"])

        setGoogleAuthCookie(event, state, codeVerifier)

        return redirect(302, url)
    },
} satisfies Actions
