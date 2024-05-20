import { usersTable } from "@api/database/schemas";
import { OTPService } from "@api/modules/otp";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { FastifyPluginCallback } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";
import z from "zod";

// Schema for inserting a user - can be used to validate API requests
export const insertUserSchema = createInsertSchema(usersTable);
// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(usersTable);

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
            const hashedEmail = await sha256(email);
            const hex = encodeHex(hashedEmail);

            const existingOTP = await redis.get(`otp:${hex}`);

            if (existingOTP) {
                return {
                    existingOTP,
                };
            }

            const otp = await OTPService.generate();

            await redis.set(`otp:${hex}`, otp, {
                EX: OTPService.expiration.seconds(),
            });

            return {
                otp,
            };
        }
    );

    done();
};
