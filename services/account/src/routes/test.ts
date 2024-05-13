import { generateOTP, generateSessionToken } from "@api/utils";
import type { FastifyPluginCallback } from "fastify";

export const testRoutes: FastifyPluginCallback = (fastify, _, done) => {
    fastify.get("/", async () => {
        const session = generateSessionToken();
        const otp = generateOTP();
        return { session, otp };
    });

    done();
};
