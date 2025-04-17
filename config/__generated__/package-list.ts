export const PACKAGES = [
  "packages/derive-codec",
  "packages/derive-equals",
  "packages/derive-validators",
  "packages/json",
  "packages/registry",
  "packages/schema",
  "packages/schema-arbitrary",
  "packages/schema-core",
  "packages/schema-generator",
  "packages/schema-jit-compiler",
  "packages/schema-seed",
  "packages/schema-to-json-schema",
  "packages/schema-to-string",
  "packages/schema-valibot-adapter",
  "packages/schema-zod-adapter"
] as const
export type PACKAGES = typeof PACKAGES