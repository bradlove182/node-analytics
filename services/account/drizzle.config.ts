import { env } from "@repo/environment"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
    schema: "./src/database/schemas.ts",
    out: "./src/database/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: env.ACCOUNT_DATABASE_URL,
    },
})
