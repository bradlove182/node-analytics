import crypto from "crypto";

export const generateRandomString = (length: number): string => {
    let token = "";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const randomArray = new Uint8Array(length);
    crypto.getRandomValues(randomArray);
    randomArray.forEach((number) => {
        token += chars[number % chars.length];
    });

    return token;
};

export const generateRandomIntegerArray = (length: number) => {
    const max = 10;
    const randomArray = new Uint32Array(length);
    crypto.getRandomValues(randomArray);
    return randomArray.map((number) => number % max);
};

export const generateSessionToken = () => generateRandomString(256);

export const generateOTP = () => generateRandomIntegerArray(4).join("");
