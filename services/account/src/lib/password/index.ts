import type { User } from "@api/database"
import { db } from "@api/database"
import { passwordTable } from "@api/database/schemas"
import { hashPassword } from "@api/lib/auth"
import { generateIdFromEntropySize } from "@api/lib/crypto"

export async function createPassword(userId: User["id"], password: string) {
    const id = generateIdFromEntropySize(10)
    const userPassword = await db.insert(passwordTable).values({
        id,
        userId,
        passwordHash: await hashPassword(password),
    }).returning()
    return userPassword.find(pass => pass.id === id)!
}
