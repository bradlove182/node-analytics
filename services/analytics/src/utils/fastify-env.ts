import { fastify } from "fastify";
import fastifyEnv from "@fastify/env";

const schema = {
    type: "object",
    required: ["DATABASE_URL"],
    properties: {
        DATABASE_URL: {
            type: "string",
        },
    },
};

const options = {
    dotenv: true,
    data: process.env,
    schema: schema,
};

export const loadEnviroments = async () => {
    const server = fastify({
        logger: true,
    });

    server.register(fastifyEnv, options).ready((err) => {
        if (err) console.error(err);
    });
};

loadEnviroments();
