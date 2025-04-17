export interface toJsonSchema { (): never }
export function toJsonSchema(): toJsonSchema {
  function neverToJsonSchema() { return void 0 as never }
  return neverToJsonSchema
}
