import { replaceState } from "$app/navigation"
import { page } from "$app/state"
import { getContext, hasContext, setContext, tick, untrack } from "svelte"

export interface ContextState<T> {
    current: T
}

/**
 * A reactive hook that creates or retrieves a shared state using Svelte's context system.
 * Provides global state management that works with SSR and maintains reactivity.
 *
 * @param name - Unique identifier for the context
 * @param initialValue - The default value if context doesn't exist
 * @returns A ContextState object containing the current value
 * @example
 * const counter = useState('counter', 0);
 * // Access value with counter.current
 * // Updates to counter.current are reactive across components
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
 * A reactive hook that syncs state between localStorage and a contextual state.
 * Provides SSR-safe localStorage persistence with Svelte's contextual state management.
 *
 * @param key - The localStorage key to store/retrieve the value
 * @param initialValue - The default value if nothing exists in localStorage
 * @returns A ContextState object containing the current value
 * @example
 * const theme = useLocalStorage('theme', 'light');
 * // Access value with theme.current
 * // Updates to theme.current automatically sync to localStorage
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
 * Automatically updates the URL query string when the state object changes.
 * Uses replaceState to update the URL without adding to browser history.
 *
 * @param state - An object containing the search parameters to sync with URL
 * @example
 * const searchParams = $state({ query: 'test', page: '1' });
 * useSearchParams(searchParams);
 * // URL updates to "?query=test&page=1"
 */
export function useSearchParams<T extends Record<string, any>>(state: T) {
    const params = new URLSearchParams(state)

    $effect(() => {
        if (state) {
            Object.keys(state).forEach(key => params.set(key, state[key]))
            tick().then(() => {
                replaceState(`?${params.toString()}`, page.state)
            })
        }
    })
}

/**
 * A reactive hook that automatically focuses a DOM element when it's mounted or updated.
 * Uses Svelte's effect system to handle focus management in a reactive way.
 * The focus is applied after the next tick to ensure the DOM is ready.
 *
 * @param element - The HTMLElement to focus
 * @example
 * let inputElement: HTMLInputElement;
 * useFocus(inputElement);
 *
 * <input bind:this={inputElement} />
 */
export function useFocus(element: () => HTMLElement | undefined | null) {
    $effect(() => {
        if (element()) {
            untrack(() => {
                tick().then(() => element()?.focus())
            })
        }
    })
}
