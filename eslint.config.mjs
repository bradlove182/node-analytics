import antfu from "@antfu/eslint-config"

export default antfu({
    svelte: true,
    typescript: true,
    stylistic: {
        indent: 4,
        semi: false,
        quotes: "double",
    },
    rules: {
        "yaml/indent": ["error", 4, { indicatorValueIndent: 2 }],
    },
    ignores: ["node_modules", ".svelte-kit", ".turbo", "dist", "build", "dev"],
})
