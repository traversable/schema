import { has, symbol } from '@traversable/registry'

export type RequiredKeys<T, Req = Exclude<keyof T, OptionalKeys<T>>> = [Req] extends [never] ? [] : Req[]

export type OptionalKeys<
  T,
  K extends keyof T = keyof T,
  Opt = K extends K ? T[K] extends { [symbol.optional]: true } ? K : never : never
> = Opt

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

function unwrapOptional(x: unknown) {
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
