export const PACKAGES = [
  "packages/derive-codec",
  "packages/derive-equals",
  "packages/derive-validators",
  "packages/json",
  "packages/json-schema",
  "packages/json-schema-test",
  "packages/json-schema-types",
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
  "packages/typebox-types",
  "packages/zod",
  "packages/zod-test",
  "packages/zod-types"
] as const
export type PACKAGES = typeof PACKAGES