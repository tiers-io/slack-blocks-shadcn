import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@tiers-io/slack-blocks-shadcn": path.resolve(
        __dirname,
        "../src/index.ts",
      ),
    },
  },
  server: {
    port: 5180,
    open: true,
  },
});
