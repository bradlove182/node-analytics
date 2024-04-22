// ESM
import fastifyPlugin from "fastify-plugin";
import fastifyRedis from "@fastify/redis";
import { FastifyInstance, FastifyPluginOptions } from "fastify";

/**
 * @param {FastifyInstance} fastify
 * @param {Object} options
 */
async function redisConnector(fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.register(fastifyRedis, {
        url: options.url,
    });
    fastify.log.info({ actor: "Redis" }, "connected");
}

// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
export default fastifyPlugin(redisConnector);
