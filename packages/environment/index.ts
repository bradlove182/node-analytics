import { z } from "zod";

const baseEnvSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const analyticsEnvSchema = z.object({
    CLICKHOUSE_DATABASE_URL: z.string().default("url"),
    CLICKHOUSE_DATABASE_USERNAME: z.string().default("default"),
    CLICKHOUSE_DATABASE_PASSWORD: z.string().default(""),
    ANALYTICS_PORT: z.coerce.number().default(8080),
    ANALYTICS_HOST: z.string().default("127.0.0.1"),
});

const accountEnvSchema = z.object({
    ACCOUNT_PORT: z.coerce.number().default(8081),
    ACCOUNT_HOST: z.string().default("127.0.0.1"),
    ACCOUNT_DATABASE_URL: z.string().default("postgres://user:password@127.0.0.1:5432/postgres"),
    ACCOUNT_REDIS_HOST: z.string().default("127.0.0.1"),
    ACCOUNT_REDIS_PORT: z.coerce.number().default(6379),
});

const supabaseEnvSchema = z.object({
    PUBLIC_SUPABASE_URL: z.string().default("url"),
    PUBLIC_SUPABASE_KEY: z.string().default("key"),
});

const envSchema = baseEnvSchema
    .merge(analyticsEnvSchema)
    .merge(accountEnvSchema)
    .merge(supabaseEnvSchema);

export const env = envSchema.parse(process.env);
