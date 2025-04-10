export interface toJsonSchema { (): { type: 'object', properties: {}, nullable: true } }
export function toJsonSchema(): toJsonSchema {
  function unknownToJsonSchema() { return { type: 'object', properties: {}, nullable: true } as const }
  return unknownToJsonSchema
}
