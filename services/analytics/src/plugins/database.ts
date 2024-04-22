import fastifyPlugin from "fastify-plugin";
import fastifyPostgres from "@fastify/postgres";
import {
    FastifyError,
    FastifyInstance,
    FastifyPluginAsync,
    FastifyPluginOptions,
    FastifyRequest,
} from "fastify";

interface DbPluginOptions {
    url: string;
}

interface Params {
    id: string;
}

/**
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */
const dbConnector: FastifyPluginAsync<DbPluginOptions> = async (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) => {
    fastify.register(fastifyPostgres, {
        connectionString: process.env.DATABASE_URL,
        ...options,
    });

    fastify.log.info({ actor: "Postgres" }, "connected");

    fastify.get("/user/:id", function (req: FastifyRequest<{ Params: Params }>, reply) {
        fastify.pg.query(
            "SELECT id, name FROM users WHERE id=$1",
            [req.params.id],
            function onResult(err: FastifyError, result: {}) {
                reply.send(err || result);
            }
        );
    });
};

// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
export default fastifyPlugin(dbConnector);
