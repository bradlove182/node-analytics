import { describe, expect, it } from "vitest"
import { generateIdFromEntropySize } from "."

describe.sequential("lib/crypto", () => {
    it("generateIdFromEntropySize()", () => {
        // check string is only lowercase
        for (let i = 0; i < 100; i++) {
            const id = generateIdFromEntropySize(10)
            expect(id).not.toMatch(/[A-Z]/)
        }

        // check output length
        const id1 = generateIdFromEntropySize(25)
        expect(id1.length).toBe(40)

        // check padding is omitted
        const id3 = generateIdFromEntropySize(8)
        expect(id3).not.toMatch(/=/)
    })
})
