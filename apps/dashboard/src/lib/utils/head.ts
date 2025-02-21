export function getAppTitle(prefix?: string) {
    const appTitle = "Analytics"

    return prefix ? `${prefix} - ${appTitle}` : appTitle
}
