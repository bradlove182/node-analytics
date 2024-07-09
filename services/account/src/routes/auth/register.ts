import { usersTable } from "@api/database/schemas";
import { Logger } from "@api/utils";
import { hash } from "@node-rs/argon2";
import { FastifyPluginCallback, FastifySchema } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { generateIdFromEntropySize } from "lucia";
import { z } from "zod";

const schema = {
    body: z.object({
        email: z.string().email("Invalid email").describe("Email address"),
        password: z.string().min(8, "Password must be at least 8 characters").describe("Password"),
    }),
    response: {
        200: z.object({
            status: z.literal(200),
            success: z.boolean(),
            message: z.string(),
        }),
        400: z.object({
            status: z.literal(400),
            success: z.boolean(),
            message: z.string(),
        }),
    },
} satisfies FastifySchema;

export const registerRoute: FastifyPluginCallback = (server, _, done) => {
    server.withTypeProvider<ZodTypeProvider>().post(
        "/register",
        {
            config: {
                rateLimit: {
                    max: 3,
                    timeWindow: "1 minute",
                },
            },
            schema,
        },
        async (request, response) => {
            const { db, body, auth } = request;
            const { email, password } = body;

            const passwordHash = await hash(password, {
                memoryCost: 19456,
                timeCost: 2,
                outputLen: 32,
                parallelism: 1,
            });

            const userId = generateIdFromEntropySize(10);

            try {
                await db.insert(usersTable).values({
                    id: userId,
                    email,
                    password_hash: passwordHash,
                    createdAt: new Date(),
                });

                const session = await auth.createSession(userId, {});
                const sessionCookie = auth.createSessionCookie(session.id);

                response.headers({
                    "Set-Cookie": sessionCookie.serialize(),
                });

                return response.status(200).send({
                    status: 200,
                    success: true,
                    message: "Registration successful",
                });
            } catch (error) {
                if (error instanceof Error) {
                    Logger.error("auth/register", error.message);
                    if (error.stack) {
                        Logger.error("auth/register", error.stack);
                    }
                }
                return response.status(400).send({
                    status: 400,
                    success: false,
                    message: "Registration failed, please try again.",
                });
            }
        }
    );

    done();
};
