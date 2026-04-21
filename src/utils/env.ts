// Tiny helper so block components can log dev-only warnings without
// fighting TypeScript over Vite's import.meta.env typing in a library
// build. Resolves to `true` in Vite dev, Jest, Vitest, and plain Node;
// `false` under `NODE_ENV=production`.

declare const process: { env?: Record<string, string | undefined> } | undefined;

export function isDev(): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const env = (import.meta as any)?.env;
    if (env && typeof env === "object") {
      if (typeof env.DEV === "boolean") return env.DEV;
      if (typeof env.MODE === "string") return env.MODE !== "production";
    }
  } catch {
    // import.meta unavailable (CJS runtime) — fall through.
  }
  if (typeof process !== "undefined" && process.env) {
    return process.env.NODE_ENV !== "production";
  }
  return false;
}
