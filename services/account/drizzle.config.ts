import { env } from "@repo/environment";
import type { Config } from "drizzle-kit";
export default {
    schema: "./src/database/schemas.ts",
    out: "./src/database/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: env.ACCOUNT_DATABASE_URL,
    },
} satisfies Config;
