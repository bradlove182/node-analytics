import { db, resetDatabase, type User } from "@api/database"
import { teamTable, userTable } from "@api/database/schemas"
import { beforeAll, describe, expect, it } from "vitest"
import { createPassword } from "."
import { verifyPassword } from "../auth"

const testUser: User = {
    id: "1",
    email: "test@test.com",
    createdAt: new Date(),
}

const testPassword = "test"

describe("lib/password", () => {
    beforeAll(async () => {
        await db.insert(userTable).values(testUser)

        return async () => {
            await resetDatabase()
        }
    })

    it("createPassword()", async () => {
        const password = await createPassword(testUser.id, testPassword)

        const verifiedPassowrd = await verifyPassword(password.passwordHash, testPassword)

        expect(password.userId).toEqual(testUser.id)
        expect(verifiedPassowrd).toBeTruthy()
    })
})
