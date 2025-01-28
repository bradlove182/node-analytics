export function verifyRequestOrigin(origin: string, allowedDomains: string[]): boolean {
    if (allowedDomains.length === 0) {
        return false
    }
    const originHost = parseURL(origin)?.host ?? null
    if (originHost === null) {
        return false
    }
    for (const domain of allowedDomains) {
        if (originHost === domain) {
            return true
        }
    }
    return false
}

export function parseURL(url: URL | string): URL | null {
    try {
        return new URL(url)
    }
    catch {
        return null
    }
}
