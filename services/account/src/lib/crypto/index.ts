import { encodeBase32LowerCaseNoPadding } from "@oslojs/encoding"

export function generateIdFromEntropySize(size: number): string {
    if (size % 5 !== 0) {
        throw new TypeError("Argument 'size' must be a multiple of 5")
    }
    const buffer = crypto.getRandomValues(new Uint8Array(size))
    return encodeBase32LowerCaseNoPadding(buffer)
}
