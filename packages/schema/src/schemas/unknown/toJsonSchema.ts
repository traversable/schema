export interface toJsonSchema { (): { type: 'object', properties: {}, nullable: true } }
export function toJsonSchema(): toJsonSchema {
  function anyToJsonSchema() { return { type: 'object', properties: {}, nullable: true } as const }
  return anyToJsonSchema
}
