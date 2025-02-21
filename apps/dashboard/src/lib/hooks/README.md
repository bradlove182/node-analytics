# Understanding Global State Management in Svelte with Custom Hooks

When building web applications with Svelte, managing state across components can be challenging. Today, let's explore two powerful custom hooks that make state management more straightforward and efficient: `useState` and `useLocalStorage`.

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

## Why This Matters

This implementation provides several benefits:
- **SSR Compatibility**: Works seamlessly with server-side rendering
- **Global State**: Easily share state across components
- **Persistence**: Optional automatic saving to localStorage
- **Type Safety**: Full TypeScript support
- **Reactive**: Changes trigger automatic updates

## Usage Example

```typescript
// In a Svelte component
const counter = useState("counter", 0)
const preferences = useLocalStorage("preferences", { darkMode: false })

// Update values
counter.current++
preferences.current.darkMode = true
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

These hooks provide a clean, type-safe way to manage global state in Svelte applications. Whether you need simple state sharing or persistent storage, they offer a consistent API that works well with Svelte's paradigms.

Remember that while localStorage is convenient for small amounts of data, it has limitations (storage size, synchronous API, client-side only). For larger applications, you might want to combine these patterns with other storage solutions.
