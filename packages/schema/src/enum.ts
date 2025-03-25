import type { Join, Primitive, Returns, Showable, UnionToTuple } from '@traversable/registry'
import { URI } from '@traversable/registry'

/** @internal */
const Object_values = globalThis.Object.values

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
  toString(): EnumToString<V>
  toJsonSchema(): { enum: { -readonly [K in keyof V]: V[K] extends undefined | symbol | bigint ? void : V[K] } }
}
declare namespace enum_ {
  type type<S, T = EnumType<S>> = T
}

const primitiveToString = (x: Primitive) =>
  typeof x === 'bigint' ? `${String(x)}n`
    : typeof x === 'symbol' ? 'symbol'
      : x === void 0 ? 'undefined'
        : typeof x === 'string' ? `'${x}'`
          : globalThis.JSON.stringify(x)

const primitiveToJsonSchema = (x: Primitive) =>
  x === void 0 || typeof x === 'bigint' || typeof x === 'symbol'
    ? void 0
    : x

/**
 * ## {@link enum_ `t.enum`}
 */
function enum_<const V extends Primitive, T extends readonly V[]>(...primitives: readonly [...T]): enum_<[...T]>
function enum_<const V extends Primitive, T extends Record<string, V>>(record: T): enum_<T[keyof T][]>
function enum_<V extends [Primitive[]] | [Record<string, Primitive>]>(...args: V): {} {
  const [head, ...tail] = args
  const values = !!head && typeof head === 'object' ? Object_values(head) : [head, ...tail]
  return enum_.def(values)
}
namespace enum_ {
  export function def<T extends readonly unknown[]>(args: readonly [...T]): enum_<readonly [...T]>
  export function def<T extends Primitive[]>(values: T): enum_<T> {
    function enumGuard(u: unknown): u is never { return values.includes(u as never) }
    const toJsonSchema = () => ({ enum: values.map(primitiveToJsonSchema) }) as Returns<enum_<T>['toJsonSchema']>
    const toString = () => values.map(primitiveToString).join(' | ') as Returns<enum_<T>['toString']>
    enumGuard.def = values as never
    enumGuard.tag = URI.enum
    enumGuard.get = values
    enumGuard.toJsonSchema = toJsonSchema
    enumGuard.toString = toString
    return enumGuard as never
  }
}
