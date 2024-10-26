import { Logger } from "@api/utils"
import { env } from "@repo/environment"
import IORedis from "ioredis"

type RedisPrefixes = "session" | "otp"
type RedisKey = `${RedisPrefixes}:${string}`

class Redis {
    public static instance: IORedis

    public static async initialize() {
        this.instance = new IORedis({
            host: env.ACCOUNT_REDIS_HOST,
            port: env.ACCOUNT_REDIS_PORT,
            connectTimeout: 500,
            maxRetriesPerRequest: 1,
        })

        this.instance.on("error", (error) => {
            Logger.error("Redis", `Failed to connect to redis ${String(error)}`)
            throw new Error("Failed to connect to redis")
        })

        this.instance.on("connect", () => {
            Logger.info("Redis", "Connected to redis")
        })
    }

    /**
     *
     * @param key Key of the value to set
     * @param value Value to set
     *
     * @example
     * await Redis.set("session:user_xxx", new Date().toISOString());
     * await Redis.set("otp:user_xxx", new Date().toISOString());
     */
    public static async set(key: RedisKey, value: string) {
        await this.instance.set(key, value)
    }

    public static async incr(key: RedisKey) {
        await this.instance.incr(key)
    }

    public static async decr(key: RedisKey) {
        await this.instance.decr(key)
    }

    public static async expire(key: RedisKey, seconds: string | number) {
        await this.instance.expire(key, seconds)
    }

    /**
     *
     * @param key Key of the value to get
     * @example
     * const value = await Redis.get("session:user_xxx");
     * const visits = await Redis.get("visits");
     */
    public static async get<T = string>(key: RedisKey) {
        return this.instance.get(key) as T | undefined
    }

    /**
     *
     * @param key Key of the value to delete
     * @example
     * await Redis.del("session:user_xxx");
     * await Redis.del("visits");
     */
    public static async del(key: RedisKey) {
        await this.instance.del(key)
    }
}

export { Redis, type RedisPrefixes }
