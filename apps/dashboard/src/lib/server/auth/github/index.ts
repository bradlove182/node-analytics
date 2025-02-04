import type { RequestEvent } from "@sveltejs/kit"
import { env } from "$env/dynamic/private"
import { db } from "$lib/server/database"
import { GitHub } from "arctic"
import { eq } from "drizzle-orm"

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = env

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error("GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is not set")
}

export const github = new GitHub(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, null)

export const getGithubStateCookieName = () => "github_oauth_state" as const

export async function getUserByGithubId(githubId: string) {
    const result = await db.query.github.findFirst({
        where: githubTable => eq(githubTable.id, githubId),
        with: {
            user: true,
        },
    })

    if (!result) {
        return undefined
    };

    const { user } = result

    return user
}

export function setGithubStateCookie(event: RequestEvent, state: string) {
    event.cookies.set(getGithubStateCookieName(), state, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
    })
}

export function deleteGithubStateCookie(event: RequestEvent) {
    event.cookies.delete(getGithubStateCookieName(), {
        path: "/",
    })
}
