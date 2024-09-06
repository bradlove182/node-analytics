import antfu from "@antfu/eslint-config"

export default antfu({
    stylistic: {
        indent: 4,
        semi: false,
        quotes: "double",
    },
    ignores: ["node_modules", ".svelte-kit", ".turbo", "dist", "build", "dev"],
})
