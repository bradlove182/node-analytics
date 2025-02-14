import type { RequestEvent } from "@sveltejs/kit"
import { github, setGithubStateCookie } from "$lib/server/auth/github"
import { google, setGoogleAuthCookie } from "$lib/server/auth/google"
import { redirect } from "@sveltejs/kit"
import { generateCodeVerifier, generateState } from "arctic"

export async function authenticateWithGithub(event: RequestEvent) {
    const state = generateState()
    const url = github.createAuthorizationURL(state, ["user:email"])

    setGithubStateCookie(event, state)

    return redirect(302, url)
}

export async function authenticateWithGoogle(event: RequestEvent) {
    const state = generateState()
    const codeVerifier = generateCodeVerifier()
    // Add the openid and profile scope to have access to the user's google profile
    const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"])

    setGoogleAuthCookie(event, state, codeVerifier)

    return redirect(302, url)
}
