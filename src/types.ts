// Starter types. The full discriminated union lands in Phase B/C as blocks
// are implemented. `Block` stays `unknown` at the public boundary so the
// consumer contract doesn't block until every phase is done.

export type Block = unknown;

export type BlockSize = "sm" | "default" | "lg";
