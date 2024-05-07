import type { Config } from "drizzle-kit";
export default {
    schema: "./src/database/schemas.ts",
    out: "./src/database/migrations",
    driver: "pg", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
} satisfies Config;
