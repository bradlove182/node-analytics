export type TimeSpanUnit = "ms" | "s" | "m" | "h" | "d" | "w"

export interface TimeSpan {
    milliseconds: () => number
    seconds: () => number
    toDate: () => Date
}

/**
 * Converts a value and unit to milliseconds
 */
export function milliseconds(value: number, unit: TimeSpanUnit): number {
    switch (unit) {
        case "ms":
            return value
        case "s":
            return value * 1000
        case "m":
            return value * 1000 * 60
        case "h":
            return value * 1000 * 60 * 60
        case "d":
            return value * 1000 * 60 * 60 * 24
        default:
            return value * 1000 * 60 * 60 * 24 * 7
    }
}

/**
 * Converts a value and unit to seconds
 */
export function seconds(value: number, unit: TimeSpanUnit): number {
    return milliseconds(value, unit) / 1000
}

/**
 * Converts a value and unit to a Date
 */
export function toDate(value: number, unit: TimeSpanUnit): Date {
    return new Date(Date.now() + milliseconds(value, unit))
}

/**
 * Returns a TimeSpan with helper functions
 */
export function createTimeSpan(value: number, unit: TimeSpanUnit): TimeSpan {
    return {
        milliseconds: () => milliseconds(value, unit),
        seconds: () => seconds(value, unit),
        toDate: () => toDate(value, unit),
    }
}
