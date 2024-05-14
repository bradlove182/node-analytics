import { otpTable, usersTable } from "@api/database/schemas";
import { generateOTP } from "@api/utils";
import { eq } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { FastifyPluginCallback } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { generateIdFromEntropySize } from "lucia";
import z from "zod";

// Schema for inserting a user - can be used to validate API requests
export const insertUserSchema = createInsertSchema(usersTable);
// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(usersTable);

export const insertOTPSchema = createInsertSchema(otpTable);

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
        async (request, response) => {
            const { db, body } = request;

            const existingUser = await db.query.usersTable.findFirst({
                where: eq(usersTable.email, body.email),
            });

            if (existingUser) {
                // Send OTP to users email
                return {
                    existingUser,
                };
            }

            const newUser = insertUserSchema.parse({
                id: crypto.randomUUID(),
                email: body.email,
            });

            //Create new user
            await db.insert(usersTable).values(newUser);

            return {
                user: newUser,
            };
        }
    );

    done();
};
