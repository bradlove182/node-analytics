
declare module "@repo/eslint-config" {
    import type { Linter } from "eslint";

    const config: Linter.Config;
    export default config;
}
