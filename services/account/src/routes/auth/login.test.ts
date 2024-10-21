import { db, User } from "@api/database";
import { passwordTable, userTable } from "@api/database/schemas";
import { hash } from "@node-rs/argon2";
import { beforeEach, describe, expect, it } from "vitest";

const testUser: User = {
    id: "1",
    email: "test@test.com",
    createdAt: new Date(),
}

const testPassword = "test"

beforeEach(async () => {
    await db.transaction(async (tx) => {
        await tx.insert(userTable).values(testUser)
        await tx.insert(passwordTable).values({
            id: "1",
            userId: "1",
            password_hash: await hash(testPassword, {
                memoryCost: 19456,
                timeCost: 2,
                outputLen: 32,
                parallelism: 1,
            }),
            createdAt: new Date(),
        })
    })

    return async () => {
        await db.transaction(async (tx) => {
            await tx.delete(userTable)
            await tx.delete(passwordTable)
        })
    }
})

describe("login route", () => {
    it("should be a test", () => {
        expect(true).toBe(true)
    })
})