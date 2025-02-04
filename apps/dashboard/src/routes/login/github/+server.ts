import type { RequestEvent } from "@sveltejs/kit"
import { github, setGithubStateCookie } from "$lib/server/auth/github"
import { generateState } from "arctic"

export async function GET(event: RequestEvent): Promise<Response> {
    const state = generateState()
    const url = github.createAuthorizationURL(state, [])

    setGithubStateCookie(event, state)

    return new Response(null, {
        status: 302,
        headers: {
            Location: url.toString(),
        },
    })
}
