import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
});

export const pinSchema = z.object({
    email: z.string().email(),
    pin: z.string().min(1).max(6).array(),
});

export type LoginSchema = typeof loginSchema;
export type PinSchema = typeof pinSchema;
