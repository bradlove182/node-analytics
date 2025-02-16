import type { User } from "$lib/server/database/types"
import { generateIdFromEntropySize } from "$lib/server/crypto"
import { db } from "$lib/server/database"
import * as table from "$lib/server/database/schemas"
import { eq } from "drizzle-orm"

export { type User }

export async function createUser(email: User["email"]): Promise<User> {
    const users = await db.insert(table.user).values({
        id: generateIdFromEntropySize(10),
        email,
    }).returning()
    return users.find(user => user.email === email)!
}

export async function deleteUser(userId: User["id"]): Promise<void> {
    await db.delete(table.user).where(eq(table.user.id, userId))
}

export async function getUserById(userId: User["id"]): Promise<User | undefined> {
    const user = await db.query.user.findFirst({
        where: userTable => eq(userTable.id, userId),
    })
    return user
}

export async function getUserByEmail(email: User["email"]): Promise<User | undefined> {
    const user = await db.query.user.findFirst({
        where: userTable => eq(userTable.email, email),
    })
    return user
}

export async function updateUser(userId: User["id"], user: Partial<User>): Promise<void> {
    await db.update(table.user).set(user).where(eq(table.user.id, userId))
}

export async function getUsers(): Promise<User[]> {
    const users = await db.query.user.findMany()
    return users
}
