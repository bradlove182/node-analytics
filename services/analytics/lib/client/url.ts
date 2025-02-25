export function safeDecodeURI(s: string | undefined | null): string | undefined | null {
    if (s === undefined || s === null) {
        return s;
    }

    try {
        return decodeURI(s);
    } catch (e) {
        return s;
    }
}
