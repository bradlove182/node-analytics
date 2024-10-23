import { resetDatabase } from "@api/database"
import { afterEach } from "vitest"

// Reset database after each test
afterEach(async () => {
    await resetDatabase()
})
