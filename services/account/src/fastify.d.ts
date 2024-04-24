import type { client } from "@api/client";

declare module "fastify" {
    /* eslint-disable-next-line no-unused-vars */
    interface FastifyRequest {
        client: typeof client;
    }
}
