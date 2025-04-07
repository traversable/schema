import { has, symbol as Sym } from '@traversable/registry'

export type RequiredKeys<
  T,
  _K extends keyof T = keyof T,
  _Req = _K extends _K ? T[_K]['toJsonSchema' & keyof T[_K]] extends { [Sym.optional]: number } ? never : _K : never
> = [_Req] extends [never] ? [] : _Req[]

export const hasSchema = has('toJsonSchema', (u) => typeof u === 'function')
export const getSchema = <T>(u: T) => hasSchema(u) ? u.toJsonSchema() : u

export const isRequired = (v: { [x: string]: unknown }) => (k: string) => {
  if (has('toJsonSchema', Sym.optional, (x) => typeof x === 'number')(v[k]) && v[k].toJsonSchema[Sym.optional] !== 0) return false
  else if (has(Sym.optional, (x) => typeof x === 'number')(v[k]) && v[k][Sym.optional] !== 0) return false
  else return true
}

export function wrapOptional(x: unknown) {
  return has(Sym.optional, (u) => typeof u === 'number')(x)
    ? x[Sym.optional] + 1
    : 1
}

export function unwrapOptional(x: unknown) {
  if (has(Sym.optional, (u) => typeof u === 'number')(x)) {
    const opt = x[Sym.optional]
    if (opt === 1) delete (x as Partial<typeof x>)[Sym.optional]
    else x[Sym.optional]--
  }
  return getSchema(x)
}

export function property(required: string[]) {
  return (x: unknown, k: string | number) => {
    if (!required.includes(String(k))) return unwrapOptional(x)
    else return getSchema(x)
  }
}
