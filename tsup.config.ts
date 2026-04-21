import { defineConfig } from "tsup";

// Ship ESM + CJS + types. No stylesheet — blocks render via Tailwind class
// strings evaluated by the consumer's build pipeline. See README for the
// design-token contract the consumer must provide.

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  minify: true,
  clean: true,
  treeshake: true,
  external: [
    "react",
    "react-dom",
    "react-markdown",
    "remark-gfm",
    "node-emoji",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "lucide-react",
  ],
});
