# Understanding Global State Management in Svelte with Custom Hooks

When building web applications with Svelte, managing state across components can be challenging. Today, let's explore three powerful custom hooks that make state management more straightforward and efficient: `useState`, `useLocalStorage`, and `useSearchParams`.

## The Basic State Hook

Let's start with the simpler of the two hooks, `useState`. This hook provides a way to create global reactive state that works seamlessly with Svelte's server-side rendering (SSR).

```typescript
const counter = useState("counter", 0)
// Later: counter.current++
```

The hook does three main things:
1. Checks if a state with the given name already exists in the context
2. If not, creates a new reactive state object using Svelte's `$state` feature
3. Stores the state in Svelte's context system for global access

This pattern ensures that we maintain a single source of truth across our application while keeping the state reactive.

## Persistent State with Local Storage

The `useLocalStorage` hook takes our state management a step further by adding persistence. It works similarly to `useState` but automatically syncs the state with the browser's localStorage.

```typescript
const settings = useLocalStorage("user-settings", { theme: "dark" })
// Changes to settings.current will automatically save to localStorage
```

Here's what makes it special:
1. When initialized, it checks localStorage for existing data
2. If found, it loads the stored value instead of using the initial value
3. Uses Svelte's `$effect` to automatically save changes to localStorage
4. Handles JSON serialization/deserialization automatically

## URL-Synced State with Search Parameters

The `useSearchParams` hook provides another way to persist state - directly in the URL's query string. This is particularly useful for sharing application state through links or maintaining state across page refreshes.

```typescript
const filters = $state({ category: "books", sort: "newest" })
useSearchParams(filters)
// URL updates to "?category=books&sort=newest"
```

Key features of this hook:
1. Automatically syncs an object's properties to URL search parameters
2. Updates the URL whenever the state object changes
3. Uses `replaceState` to update the URL without adding to browser history
4. Makes application state shareable via URL

This is especially valuable for:
- Search and filter functionality
- Pagination controls
- Tab selections
- Any state that should be preserved in bookmarks or shared links

## Why This Matters

This implementation provides several benefits:
- **SSR Compatibility**: Works seamlessly with server-side rendering
- **Global State**: Easily share state across components
- **Multiple Persistence Options**: State can be ephemeral, saved to localStorage, or synced with URL parameters
- **Type Safety**: Full TypeScript support
- **Reactive**: Changes trigger automatic updates

## Usage Example

```typescript
// In a Svelte component
const counter = useState("counter", 0)
const preferences = useLocalStorage("preferences", { darkMode: false })
const searchFilters = $state({ query: "", page: 1 })
useSearchParams(searchFilters)

// Update values
counter.current++
preferences.current.darkMode = true
searchFilters.query = "svelte hooks"
```

The beauty of this system is its simplicity. You get powerful state management capabilities with minimal boilerplate code, and it integrates perfectly with Svelte's existing patterns.

## Technical Considerations

One important detail is the use of the `ContextState` interface:

```typescript
export interface ContextState<T> {
    current: T
}
```

This wrapper object ensures that our state updates trigger proper reactivity, as Svelte tracks assignments to properties rather than to variables directly.

## Conclusion

These hooks provide a clean, type-safe way to manage global state in Svelte applications. Whether you need simple state sharing, persistent storage, or URL-synced parameters, they offer a consistent API that works well with Svelte's paradigms.

Remember that each persistence method has its own use cases:
- `useState` for ephemeral state that only needs to exist during the session
- `useLocalStorage` for persistent settings that should survive page refreshes
- `useSearchParams` for state that should be shareable or bookmarkable via URL

For larger applications, you might want to combine these patterns with other storage solutions.
