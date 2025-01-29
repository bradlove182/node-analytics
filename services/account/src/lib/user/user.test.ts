import { db, type User } from "@api/database"
import { passwordTable } from "@api/database/schemas"
import { hashPassword, verifyPassword } from "@api/lib/auth"
import { createPassword } from "@api/lib/password"
import { describe, expect, it } from "vitest"
import { createUser, deleteUser, getUserByEmail, getUserByEmailWithPassword, getUserById, getUserByIdWithPassword, getUsers, updateUser } from "."

const testUser: User = {
    id: "lib/user",
    email: "test@test.com",
    createdAt: new Date(Date.now()),
}

export const testPassword: string = "test"

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

    it("getUserByIdWithPassword()", async () => {
        await createUser(testUser)
        await createPassword(testUser.id, testPassword)

        const user = await getUserByIdWithPassword(testUser.id)

        const verifiedPassowrd = await verifyPassword(user?.password?.passwordHash ?? "", testPassword)

        expect(user?.id).toEqual(testUser.id)
        expect(user?.email).toEqual(testUser.email)
        expect(user?.createdAt).toBeInstanceOf(Date)
        expect(verifiedPassowrd).toBeTruthy()
    })

    it("getUserByEmail()", async () => {
        await createUser(testUser)
        const user = await getUserByEmail(testUser.email)

        expect(user?.id).toEqual(testUser.id)
        expect(user?.email).toEqual(testUser.email)
        expect(user?.createdAt).toBeInstanceOf(Date)
    })

    it("getUserByEmailWithPassword()", async () => {
        await createUser(testUser)
        await createPassword(testUser.id, testPassword)

        const user = await getUserByEmailWithPassword(testUser.email)

        const verifiedPassowrd = await verifyPassword(user?.password?.passwordHash ?? "", testPassword)

        expect(user?.id).toEqual(testUser.id)
        expect(user?.email).toEqual(testUser.email)
        expect(user?.createdAt).toBeInstanceOf(Date)
        expect(verifiedPassowrd).toBeTruthy()
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
