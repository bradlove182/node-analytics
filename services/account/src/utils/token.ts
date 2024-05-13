import crypto from "crypto";
import { generateIdFromEntropySize } from "lucia";

export const generateRandomIntegerArray = (length: number) => {
    const max = 10;
    const randomArray = new Uint32Array(length);
    crypto.getRandomValues(randomArray);
    return randomArray.map((number) => number % max);
};

export const generateSessionToken = () => generateIdFromEntropySize(128);

export const generateOTP = () => generateRandomIntegerArray(4).join("");
