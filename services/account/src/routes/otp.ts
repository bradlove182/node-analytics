import { encodeString } from "@api/utils"
import { TimeSpan } from "oslo"
import { alphabet, generateRandomString } from "oslo/crypto"
import z from "zod"
import type { FastifyPluginCallback } from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"

const OTP_LENGTH = 6
const OTP_DURATION = new TimeSpan(5, "m")

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
                    email: z.coerce.string().email("Invalid email"),
                }),
                response: {
                    200: z.object({
                        status: z.literal(200),
                        message: z.string(),
                        success: z.boolean(),
                        otp: z.string().length(OTP_LENGTH),
                    }),
                },
            },
        },
        async (request, response) => {
            const { body, redis } = request

            const email = await encodeString(body.email)

            const otp = generateRandomString(OTP_LENGTH, alphabet("0-9"))

            await redis.set(`otp:${email}`, otp)
            await redis.expire(`otp:${email}`, OTP_DURATION.seconds())

            return response.status(200).send({
                status: 200,
                success: true,
                message: "OTP sent successfully",
                otp,
            })
        },
    )

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
                response: {
                    200: z.object({
                        status: z.literal(200),
                        success: z.boolean(),
                        message: z.string(),
                    }),
                    500: z.object({
                        status: z.literal(500),
                        success: z.boolean(),
                        message: z.string(),
                    }),
                },
            },
        },
        async (request, response) => {
            const { body, redis } = request

            const otp = body.otp
            const email = await encodeString(body.email)

            const storedOTP = await redis.get(`otp:${email}`)

            if (storedOTP === otp) {
                return response.status(200).send({
                    status: 200,
                    success: true,
                    message: "OTP verified successfully",
                })
            }

            return response.status(500).send({
                status: 500,
                success: false,
                message: "OTP invalid",
            })
        },
    )

    done()
}
