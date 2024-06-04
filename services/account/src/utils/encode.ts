import { sha256 } from "oslo/crypto";
import { encodeHex } from "oslo/encoding";

export const encodeString = async (string: string) => {
    const encoded = new TextEncoder().encode(string);
    const hashedString = await sha256(encoded);
    return encodeHex(hashedString);
};
