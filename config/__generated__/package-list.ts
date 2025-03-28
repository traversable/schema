export const PACKAGES = [
  "packages/derive-codec",
  "packages/derive-equals",
  "packages/derive-lenses",
  "packages/derive-validators",
  "packages/json",
  "packages/registry",
  "packages/schema",
  "packages/schema-seed",
  "packages/schema-to-json-schema",
  "packages/schema-to-string",
  "packages/schema-valibot-adapter",
  "packages/schema-zod-adapter"
] as const
export type PACKAGES = typeof PACKAGES