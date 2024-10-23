import type { User } from "@api/database"
import { describe, expect, it } from "vitest"
import { createUser, deleteUser, getUserByEmail, getUserById, getUsers, updateUser } from "."

const testUser: User = {
    id: "lib/user",
    email: "test@test.com",
    createdAt: new Date(Date.now()),
}

describe("lib/user", () => {
    it("createUser()", async () => {
        const user = await createUser(testUser)

        expect(user.id).toEqual(testUser.id)
        expect(user.email).toEqual(testUser.email)
        expect(user.createdAt).toBeInstanceOf(Date)
    })

    it("getUserById()", async () => {
        await createUser(testUser)
        const user = await getUserById(testUser.id)

        expect(user?.id).toEqual(testUser.id)
        expect(user?.email).toEqual(testUser.email)
        expect(user?.createdAt).toBeInstanceOf(Date)
    })

    it("getUserByEmail()", async () => {
        await createUser(testUser)
        const user = await getUserByEmail(testUser.email)

        expect(user?.id).toEqual(testUser.id)
        expect(user?.email).toEqual(testUser.email)
        expect(user?.createdAt).toBeInstanceOf(Date)
    })

    it("deleteUser()", async () => {
        const user = await createUser(testUser)
        await deleteUser(user.id)

        const deletedUser = await getUserById(user.id)

        expect(deletedUser).toBeUndefined()
    })

    it("updateUser()", async () => {
        const user = await createUser(testUser)
        await updateUser(user.id, {
            email: "updated@test.com",
        })
        const updatedUser = await getUserById(user.id)

        expect(updatedUser?.email).toEqual("updated@test.com")
    })

    it("getUsers()", async () => {
        await createUser(testUser)
        const users = await getUsers()

        expect(users.length).toBeGreaterThan(0)
    })
})
