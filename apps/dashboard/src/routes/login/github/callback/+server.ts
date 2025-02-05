import type { RequestEvent } from "@sveltejs/kit"
import type { OAuth2Tokens } from "arctic"
import { createSession, generateSessionToken, setSessionTokenCookie } from "$lib/server/auth"
import { createGithubUser, getGithubStateCookieName, getUserByGithubId, github } from "$lib/server/auth/github"

interface GitHubUser {
    login: string
    id: number
    node_id: string
    avatar_url: string
    gravatar_id: string
    url: string
    html_url: string
    followers_url: string
    following_url: string
    gists_url: string
    starred_url: string
    subscriptions_url: string
    organizations_url: string
    repos_url: string
    events_url: string
    received_events_url: string
    type: string
    site_admin: boolean
    name: string | null
    company: string | null
    blog: string
    location: string | null
    email: string | null
    hireable: boolean | null
    bio: string | null
    twitter_username: string | null
    public_repos: number
    public_gists: number
    followers: number
    following: number
    created_at: string
    updated_at: string
}

export async function GET(event: RequestEvent): Promise<Response> {
    const code = event.url.searchParams.get("code")
    const state = event.url.searchParams.get("state")
    const storedState = event.cookies.get(getGithubStateCookieName())

    if (code === null || state === null || storedState === null) {
        return new Response(null, {
            status: 400,
        })
    }

    if (state !== storedState) {
        return new Response(null, {
            status: 400,
        })
    }

    let tokens: OAuth2Tokens

    try {
        tokens = await github.validateAuthorizationCode(code)
    }
    catch {
        // Invalid code or client credentials
        return new Response(null, {
            status: 400,
        })
    }

    const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${tokens.accessToken()}`,
        },
    })

    const githubUser: GitHubUser = await githubUserResponse.json()

    const githubUserId = githubUser.id
    const githubEmail = githubUser.email

    const existingUser = await getUserByGithubId(String(githubUserId))

    if (existingUser) {
        const sessionToken = generateSessionToken()
        const session = await createSession(sessionToken, existingUser.id)
        setSessionTokenCookie(event, sessionToken, session.expiresAt)
        return new Response(null, {
            status: 302,
            headers: {
                Location: "/",
            },
        })
    }

    // TODO: This email can be undefined
    // We might need a step to ask the user for an email before completing
    // the createUser
    const user = await createGithubUser(githubEmail!, String(githubUserId))

    if (user) {
        const sessionToken = generateSessionToken()
        const session = await createSession(sessionToken, user.userId)
        setSessionTokenCookie(event, sessionToken, session.expiresAt)

        return new Response(null, {
            status: 302,
            headers: {
                Location: "/",
            },
        })
    }

    return new Response(null, {
        status: 400,
    })
}
