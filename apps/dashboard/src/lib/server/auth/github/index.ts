import type { GitHub, User } from "$lib/server/database/types"
import type { RequestEvent } from "@sveltejs/kit"
import { env } from "$env/dynamic/private"
import { generateIdFromEntropySize } from "$lib/server/crypto"
import { db } from "$lib/server/database"
import * as table from "$lib/server/database/schemas"
import { createUser } from "$lib/server/user"
import { createTimeSpan } from "$lib/utils/timespan"
import { GitHub as GitHubClient } from "arctic"
import { eq } from "drizzle-orm"

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = env

if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    throw new Error("GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is not set")
}

export { type GitHub }

export const github = new GitHubClient(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, null)

export const getGithubStateCookieName = () => "github_oauth_state" as const

export async function getUserByGithubId(githubId: string) {
    const result = await db.query.github.findFirst({
        where: githubTable => eq(githubTable.githubId, githubId),
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

export async function createGithubUser(email: User["email"], githubId: GitHub["id"]) {
    const user = await createUser(email)

    const githubUser = await db.insert(table.github).values({
        id: generateIdFromEntropySize(10),
        userId: user.id,
        githubId,
    }).returning()

    return githubUser.find(current => current.githubId === githubId)
}

export function setGithubStateCookie(event: RequestEvent, state: string) {
    event.cookies.set(getGithubStateCookieName(), state, {
        path: "/",
        httpOnly: true,
        maxAge: createTimeSpan(10, "m").milliseconds(),
        sameSite: "lax",
    })
}

export function deleteGithubStateCookie(event: RequestEvent) {
    event.cookies.delete(getGithubStateCookieName(), {
        path: "/",
    })
}
