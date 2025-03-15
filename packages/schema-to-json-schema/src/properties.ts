import { has, symbol } from '@traversable/registry'

export type RequiredKeys<
  T,
  _K extends keyof T = keyof T,
  _Req = _K extends _K ? T[_K]['jsonSchema' & keyof T[_K]] extends { [symbol.optional]: number } ? never : _K : never
> = [_Req] extends [never] ? [] : _Req[]

export const isRequired = (v: { [x: string]: unknown }) => (k: string) => {
  if (!has('jsonSchema')(v[k])) return false
  const jsonSchema = v[k].jsonSchema
  if (!(jsonSchema && symbol.optional in jsonSchema)) return true
  const optional = jsonSchema[symbol.optional]
  if (typeof optional !== 'number') return true
  else return optional === 0
}

export function wrapOptional(x: unknown) {
  return has('jsonSchema', symbol.optional, (u) => typeof u === 'number')(x)
    ? x.jsonSchema[symbol.optional] + 1
    : 1
}

export function unwrapOptional(x: unknown) {
  if (has(symbol.optional, (u) => typeof u === 'number')(x)) {
    const opt = x[symbol.optional]
    if (opt === 1) delete (x as Partial<typeof x>)[symbol.optional]
    else x[symbol.optional]--
  }
  return x
}

export function property(required: string[]) {
  return (x: unknown, k: string | number) => {
    if (!has('jsonSchema')(x)) return x
    else if (!required.includes(String(k))) return unwrapOptional(x.jsonSchema)
    else return x.jsonSchema
  }
}
