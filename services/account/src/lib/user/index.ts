import type { User } from "@api/database"
import { db } from "@api/database"
import { userTable } from "@api/database/schemas"
import { eq } from "drizzle-orm"

export async function createUser(user: User): Promise<User> {
    await db.insert(userTable).values(user)
    return user
}

export async function deleteUser(userId: User["id"]): Promise<void> {
    await db.delete(userTable).where(eq(userTable.id, userId))
}

export async function getUser(userId: User["id"]): Promise<User | undefined> {
    const user = await db.query.userTable.findFirst({
        where: userTable => eq(userTable.id, userId),
    })
    return user
}

export async function updateUser(userId: User["id"], user: Partial<User>): Promise<void> {
    await db.update(userTable).set(user).where(eq(userTable.id, userId))
}

export async function getUsers(): Promise<User[]> {
    const users = await db.query.userTable.findMany()
    return users
}
