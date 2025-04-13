export interface toJsonSchema { (): void }
export function toJsonSchema(): toJsonSchema {
  function voidToJsonSchema(): void {
    return void 0
  }
  return voidToJsonSchema
}
