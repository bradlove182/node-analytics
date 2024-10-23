import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        environment: "node",
        setupFiles: ["./src/tests/setup.ts"],
        typecheck: {
            tsconfig: "tsconfig.json",
        },
        testTimeout: 100000,
        hookTimeout: 100000,
        isolate: true,
        poolOptions: {
            threads: {
                singleThread: true,
            },
        },
        maxWorkers: 1,
        fileParallelism: false,
    },
})
