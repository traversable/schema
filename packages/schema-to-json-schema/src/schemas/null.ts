export interface toJsonSchema { (): { type: 'null', enum: [null] } }
export function toJsonSchema(): toJsonSchema {
  function nullToJsonSchema() { return { type: 'null' as const, enum: [null] satisfies [any] } }
  return nullToJsonSchema
}
