import { z } from "zod";

const analyticsEnvSchema = z.object({
    CLICKHOUSE_DATABASE_URL: z.string().default("url"),
    CLICKHOUSE_DATABASE_USERNAME: z.string().default("default"),
    CLICKHOUSE_DATABASE_PASSWORD: z.string().default("password"),
    ANALYTICS_PORT: z.coerce.number().default(8080),
    ANALYTICS_HOST: z.string().default("127.0.0.1"),
});

const accountEnvSchema = z.object({
    ACCOUNT_PORT: z.coerce.number().default(8081),
    ACCOUNT_HOST: z.string().default("127.0.0.1"),
});

const supabaseEnvSchema = z.object({
    PUBLIC_SUPABASE_URL: z.string().default("url"),
    PUBLIC_SUPABASE_KEY: z.string().default("key"),
});

const envSchema = analyticsEnvSchema.merge(accountEnvSchema).merge(supabaseEnvSchema);

export const env = envSchema.parse(process.env);
