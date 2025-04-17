export interface toJsonSchema { (): { type: 'boolean' } }
export function toJsonSchema(): toJsonSchema {
  function booleanToJsonSchema() { return { type: 'boolean' as const } }
  return booleanToJsonSchema
}
