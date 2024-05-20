import { OTPService } from "@api/modules/otp";
import { FastifyPluginCallback } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { HMAC } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import z from "zod";

const hasher = new HMAC("SHA-256");

export const authRoutes: FastifyPluginCallback = (fastify, _, done) => {
    fastify.withTypeProvider<ZodTypeProvider>().post(
        "/otp",
        {
            schema: {
                body: z.object({
                    email: z.coerce.string().email(),
                }),
            },
        },
        async (request) => {
            const { body, redis } = request;

            const email = new TextEncoder().encode(body.email);
            const hashedEmail = await hasher.sign(OTPService.secret, email);
            const encodedEmail = encodeHex(hashedEmail);

            const existingOTP = await redis.get(`otp:${encodedEmail}`);

            if (existingOTP) {
                return {
                    existingOTP,
                };
            }

            const otp = await OTPService.generate();

            await redis.set(`otp:${encodedEmail}`, otp, {
                EX: OTPService.expiration.seconds(),
            });

            return {
                otp,
            };
        }
    );

    done();
};
