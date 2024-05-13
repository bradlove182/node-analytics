import { generateOTP, generateSessionToken } from "@api/utils";
import type { FastifyPluginCallback } from "fastify";

export const testRoutes: FastifyPluginCallback = (fastify, _, done) => {
    fastify.get("/", async () => {
        const token = generateSessionToken();
        const otp = generateOTP();
        return { token, otp };
    });

    done();
};
