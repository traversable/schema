import type { Join, Primitive, Returns, Showable, UnionToTuple } from '@traversable/registry'
import { Array_isArray, Object_assign, Object_entries, Object_values, parseKey, URI } from '@traversable/registry'

export type EnumType<T> = T extends readonly unknown[] ? T[number] : T[keyof T]

export type EnumToString<T> = number extends T['length' & keyof T]
  ? NonFiniteArrayToString<T[number & keyof T]>
  : FiniteArrayToString<T>

export type FiniteArrayToString<T> = never | Join<{ [I in keyof T]: MemberToString<T[I]> }, ' | '>
export type NonFiniteArrayToString<S, T = UnionToTuple<S>> = never | Join<{ [I in keyof T]: MemberToString<T[I]> }, ' | '>
export type MemberToString<T> = never | T extends symbol ? 'symbol' : T extends bigint ? `${T}n` : T extends string ? `'${T}'` : `${T & Showable}`

export { enum_ as enum }
interface enum_<V> {
  _type: EnumType<V>
  tag: URI.enum
  (u: unknown): u is this['_type']
  def: V
  toType(): EnumToString<V>
  toJsonSchema(): { enum: { -readonly [K in keyof V]: V[K] extends undefined | symbol | bigint ? void : V[K] } }
}
declare namespace enum_ {
  type type<S, T = EnumType<S>> = T
}

const isPrimitive = (x: unknown): x is Primitive => {
  const type = typeof x
  return x == null
    || x === true
    || x === false
    || type === 'symbol'
    || type === 'bigint'
    || type === 'number'
    || type === 'string'
}

const primitiveToString = (x: Primitive, onSymbol?: (symbol: symbol) => string) =>
  typeof x === 'bigint' ? `${x}n`
    : typeof x === 'symbol' ? (onSymbol ?? ((x) => `Symbol(${String(x)})`))(x)
      : x === void 0 ? 'undefined'
        : typeof x === 'string' ? `'${x}'`
          : globalThis.JSON.stringify(x)

const primitiveToJsonSchema = (x: Primitive) =>
  x === void 0 || typeof x === 'bigint' || typeof x === 'symbol'
    ? void 0
    : x

function enumToString(args: Primitive[] | [Record<string, Primitive>]) {
  if (!!args[0] && typeof args[0] === 'object') {
    const BODY = Object_entries(args[0]).map(([k, v]) => `${parseKey(k)}: ${primitiveToString(v)}`)
    return BODY.length === 0 ? `t.enum({})` : `t.enum({ ${BODY.join(', ')} })`
  } else if (args.every(isPrimitive)) {
    return `t.enum(${args.map((_) => primitiveToString(_ as Primitive)).join(', ')})`
  }
}

function parseArgs(args: unknown[]): unknown[] {
  if (Array_isArray(args) && args.every(isPrimitive)) return args
  else return Object_values(args[0] ?? {})
}

/**
 * ## {@link enum_ `t.enum`}
 */
function enum_<const V extends Primitive, T extends readonly V[]>(...primitives: readonly [...T]): enum_<[...T]>
function enum_<const V extends Primitive, T extends Record<string, V>>(...record: [T]): enum_<T[keyof T][]>
function enum_(...args: [...Primitive[]] | [Record<string, Primitive>]): {} {
  const STR = enumToString(args)
  return Object_assign(
    enum_.def(parseArgs(args)),
    { toString() { return STR } },
  )
}
namespace enum_ {
  export let prototype = { tag: URI.enum }
  export function def<T extends readonly unknown[]>(args: readonly [...T]): enum_<readonly [...T]>
  /* v8 ignore next 1 */
  export function def<T extends Primitive[]>(values: T): enum_<T> {
    function enumGuard(u: unknown): u is never { return values.includes(u as never) }
    const toJsonSchema = () => ({ enum: values.map(primitiveToJsonSchema) }) as Returns<enum_<T>['toJsonSchema']>
    const toType = () => values.map((_) => primitiveToString(_, () => 'symbol')).join(' | ') as Returns<enum_<T>['toString']>
    enumGuard.def = values as never
    enumGuard.get = values
    enumGuard.toJsonSchema = toJsonSchema
    enumGuard.toType = toType
    return Object_assign(enumGuard, prototype) as never
  }
}
