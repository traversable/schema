export const PACKAGES = [
  "packages/derive-codec",
  "packages/derive-equals",
  "packages/derive-validators",
  "packages/json",
  "packages/registry",
  "packages/schema",
  "packages/schema-compiler",
  "packages/schema-errors",
  "packages/schema-seed",
  "packages/schema-to-json-schema",
  "packages/schema-to-string",
  "packages/schema-valibot-adapter",
  "packages/typebox",
  "packages/typebox-test",
  "packages/zod",
  "packages/zod-test"
] as const
export type PACKAGES = typeof PACKAGES