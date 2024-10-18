import type { User } from "@api/database"
import { afterEach, describe, expect, it } from "vitest"
import { createUser, deleteUser, getUser, getUsers, updateUser } from "."

const testUser: User = {
    id: "2",
    email: "test2@test.com",
    createdAt: new Date(Date.now()),
}

afterEach(async () => {
    await deleteUser(testUser.id)
})

describe("lib/user", () => {
    it("create a new user", async () => {
        const user = await createUser(testUser)

        expect(user.id).toEqual(testUser.id)
        expect(user.email).toEqual(testUser.email)
        expect(user.createdAt).toBeInstanceOf(Date)
    })

    it("get a user", async () => {
        await createUser(testUser)
        const user = await getUser(testUser.id)

        expect(user?.id).toEqual(testUser.id)
        expect(user?.email).toEqual(testUser.email)
        expect(user?.createdAt).toBeInstanceOf(Date)
    })

    it("delete a user", async () => {
        const user = await createUser(testUser)
        await deleteUser(user.id)

        const deletedUser = await getUser(user.id)

        expect(deletedUser).toBeUndefined()
    })

    it("update a user", async () => {
        const user = await createUser(testUser)
        await updateUser(user.id, {
            email: "updated@test.com",
        })
        const updatedUser = await getUser(user.id)

        expect(updatedUser?.email).toEqual("updated@test.com")
    })

    it("gets users", async () => {
        await createUser(testUser)
        const users = await getUsers()

        expect(users.length).toBeGreaterThan(0)
    })
})
