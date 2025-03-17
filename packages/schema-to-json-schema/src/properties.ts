import { has, symbol } from '@traversable/registry'

export type RequiredKeys<
  T,
  _K extends keyof T = keyof T,
  _Req = _K extends _K ? T[_K]['jsonSchema' & keyof T[_K]] extends { [symbol.optional]: number } ? never : _K : never
> = [_Req] extends [never] ? [] : _Req[]

export const hasSchema = has('jsonSchema', (u) => typeof u === 'function')
export const getSchema = <T>(u: T) => hasSchema(u) ? u.jsonSchema() : u

export const isRequired = (v: { [x: string]: unknown }) => (k: string) => {
  if (has('jsonSchema', symbol.optional, (x) => typeof x === 'number')(v[k]) && v[k].jsonSchema[symbol.optional] !== 0) return false
  else if (has(symbol.optional, (x) => typeof x === 'number')(v[k]) && v[k][symbol.optional] !== 0) return false
  else return true
}

export function wrapOptional(x: unknown) {
  return has(symbol.optional, (u) => typeof u === 'number')(x)
    ? x[symbol.optional] + 1
    : 1
}

export function unwrapOptional(x: unknown) {
  if (has(symbol.optional, (u) => typeof u === 'number')(x)) {
    const opt = x[symbol.optional]
    if (opt === 1) delete (x as Partial<typeof x>)[symbol.optional]
    else x[symbol.optional]--
  }
  return getSchema(x)
}

export function property(required: string[]) {
  return (x: unknown, k: string | number) => {
    if (!required.includes(String(k))) return unwrapOptional(x)
    else return getSchema(x)
  }
}
