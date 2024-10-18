import type { User } from "@api/database"
import { db } from "@api/database"
import { eq } from "drizzle-orm"
import { afterAll, beforeAll } from "vitest"
import { userTable } from "./database/schemas"

const testUser: User = {
    id: "1",
    email: "test@test.com",
    createdAt: new Date(Date.now()),
}

beforeAll(async () => {
    const user = await db.query.userTable.findFirst({
        where: userTable => eq(userTable.id, testUser.id),
    })

    if (!user) {
        await db.insert(userTable).values(testUser)
    }
})

afterAll(async () => {
    await db.delete(userTable).where(eq(userTable.id, testUser.id))
})
