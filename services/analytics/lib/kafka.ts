import { env } from "@repo/environment";

const enabled = Boolean(env.KAFKA_URL && env.KAFKA_BROKER);

async function sendMessage() {
    return false;
}

export default {
    enabled,
    sendMessage
}