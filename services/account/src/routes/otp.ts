import { FastifyPluginCallback } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { TimeSpan } from "oslo";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import { TOTPController } from "oslo/otp";
import z from "zod";

const OTP_LENGTH = 6;
const OTP_DURATION = new TimeSpan(15, "m");

const controller = new TOTPController({
    digits: OTP_LENGTH,
    period: OTP_DURATION,
});

export const otpRoutes: FastifyPluginCallback = (server, _, done) => {
    server.withTypeProvider<ZodTypeProvider>().post(
        "/",
        {
            config: {
                rateLimit: {
                    max: 3,
                    timeWindow: "1 minute",
                },
            },
            schema: {
                body: z.object({
                    email: z.coerce.string().email(),
                }),
            },
        },
        async (request) => {
            const { body, redis } = request;

            const email = new TextEncoder().encode(body.email);
            const hashedEmail = await sha256(email);
            const encodedEmail = encodeHex(hashedEmail);

            const otp = await controller.generate(hashedEmail);

            await redis.set(`otp:${encodedEmail}`, otp);
            await redis.expire(`otp:${encodedEmail}`, OTP_DURATION.seconds());

            return {
                otp,
            };
        }
    );

    server.withTypeProvider<ZodTypeProvider>().post(
        "/verify",
        {
            config: {
                rateLimit: {
                    max: 3,
                    timeWindow: "1 minute",
                },
            },
            schema: {
                body: z.object({
                    email: z.coerce.string().email(),
                    otp: z.coerce.string().length(OTP_LENGTH),
                }),
            },
        },
        async (request) => {
            const { body, redis } = request;

            const otp = body.otp;
            const email = new TextEncoder().encode(body.email);
            const hashedEmail = await sha256(email);
            const encodedEmail = encodeHex(hashedEmail);

            const storedOTP = await redis.get(`otp:${encodedEmail}`);

            const valid = Boolean((await controller.verify(otp, hashedEmail)) && storedOTP === otp);

            return {
                valid,
            };
        }
    );

    done();
};
