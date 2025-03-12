import { pushState } from "$app/navigation"
import { getContext, hasContext, setContext } from "svelte"

export interface ContextState<T> {
    current: T
}

/**
 * This hook allows us to have global reactvity with contextual SSR data.
 */
export function useState<T>(name: string, initialValue: T): ContextState<T> {
    if (hasContext(name)) {
        return getContext<ContextState<T>>(name)
    }

    const state = $state<ContextState<T>>({ current: initialValue })

    setContext(name, state)

    return state
}

/**
 * This hook allows you to read a item from local storage and save it to a contextual state.
 * Everytime the state changes it will update the value in localStorage too.
 */
export function useLocalStorage<T>(key: string, initialValue: T): ContextState<T> {
    if (hasContext(key)) {
        return getContext<ContextState<T>>(key)
    }

    const state = $state<ContextState<T>>({ current: initialValue })

    if (typeof localStorage !== "undefined") {
        const storedState = localStorage.getItem(key)
        if (storedState) {
            state.current = JSON.parse(localStorage.getItem(key) as string)
        }
        else {
            localStorage.setItem(key, JSON.stringify(state.current))
        }
    }

    $effect(() => {
        localStorage.setItem(key, JSON.stringify(state.current))
    })

    setContext(key, state)

    return state
}

/**
 * A reactive hook that syncs an object's state with URL search parameters.
 * Updates the URL automatically when the state changes, and vice versa.
 *
 * @param accessor - A function that returns an object containing the search parameters
 * @example
 * const searchParams = $state({ query: 'test', page: '1' });
 * useSearchParams(() => searchParams);
 * // URL updates to "?query=test&page=1"
 */
export function useSearchParams<T extends Record<string, any>>(accessor: () => T) {
    const params = new URLSearchParams(accessor())

    $effect(() => {
        if (accessor()) {
            Object.keys(accessor()).forEach((key) => {
                params.set(key, accessor()[key])
            })
        }
    })

    $effect(() => {
        pushState(`?${params.toString()}`, accessor())
    })
}
