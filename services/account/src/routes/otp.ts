import { FastifyPluginCallback } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { TimeSpan } from "oslo";
import { alphabet, generateRandomString, sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import z from "zod";

const OTP_LENGTH = 6;
const OTP_DURATION = new TimeSpan(5, "m");

const encodeEmail = async (email: string) => {
    const encoded = new TextEncoder().encode(email);
    const hashedEmail = await sha256(encoded);
    return encodeHex(hashedEmail);
};

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
        async (request, response) => {
            const { body, redis } = request;

            const email = encodeEmail(body.email);

            const otp = generateRandomString(OTP_LENGTH, alphabet("0-9"));

            await redis.set(`otp:${email}`, otp);
            await redis.expire(`otp:${email}`, OTP_DURATION.seconds());

            return response.status(200).send({
                status: 200,
                success: true,
                message: "OTP sent successfully",
                otp,
            });
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
        async (request, response) => {
            const { body, redis } = request;

            const otp = body.otp;
            const email = encodeEmail(body.email);

            const storedOTP = await redis.get(`otp:${email}`);

            if (storedOTP === otp) {
                return response.status(200).send({
                    status: 200,
                    success: true,
                    message: "OTP verified successfully",
                });
            }

            return response.status(500).send({
                status: 500,
                success: false,
                message: "OTP invalid",
            });
        }
    );

    done();
};
