export const PACKAGES = [
  "packages/json",
  "packages/registry",
  "packages/schema",
  "packages/schema-core",
  "packages/schema-valibot-adapter",
  "packages/schema-zod-adapter"
] as const
export type PACKAGES = typeof PACKAGES