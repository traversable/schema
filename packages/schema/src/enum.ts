import type { Join, Primitive, Returns, Showable, UnionToTuple } from '@traversable/registry'
import { URI } from '@traversable/registry'

/** @internal */
const Object_values = globalThis.Object.values

export type EnumType<T> = T extends readonly unknown[] ? T[number] : T[keyof T]

export type EnumValues<T> = T extends readonly unknown[]
  ? never | { [I in keyof T]: T[I] extends undefined | symbol | bigint ? void : T[I] }
  : never | Exclude<T[keyof T], undefined | symbol | bigint>[]
  ;

export type EnumToString<T> = T extends readonly Primitive[]
  ? TupleToString<T>
  : ObjectToString<T>

export type TupleToString<T extends readonly Primitive[]> = never | Join<{ [I in keyof T]: MemberToString<T[I]> }, ' | '>
export type ObjectToString<S, T = UnionToTuple<S[keyof S]>> = never | Join<{ [I in keyof T]: MemberToString<T[I]> }, ' | '>
export type MemberToString<T> = never | T extends symbol ? 'symbol' : T extends bigint ? `${T}n` : T extends string ? `'${T}'` : `${T & Showable}`

export { enum_ as enum }
interface enum_<V> {
  _type: EnumType<V>
  tag: URI.enum
  (u: unknown): u is this['_type']
  def: V
  toString(): EnumToString<V>
  toJsonSchema(): { enum: EnumValues<V> }
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
function enum_<const V extends readonly Primitive[]>(...primitives: readonly [...V]): enum_<[...V]>
function enum_<const V extends Record<string, Primitive>>(record: V): enum_<{ -readonly [K in keyof V]: V[K] }>
function enum_<V extends [Primitive[]] | [Record<string, Primitive>]>(...args: V): enum_<V> { return enum_.def(args) }
namespace enum_ {
  export function def<T extends [Primitive[]] | [Record<string, Primitive>]>(args: T): enum_<T>
  export function def<T extends [Primitive[]] | [Record<string, Primitive>]>(args: T): Omit<enum_<T>, '_type'> {
    const [head, ...tail] = args
    const values = !!head && typeof head === 'object' ? Object_values(head) : [head, ...tail]
    function enumGuard(u: unknown): u is never { return values.includes(u as never) }
    const toJsonSchema = () => ({ enum: values.map(primitiveToJsonSchema) }) as Returns<enum_<T>['toJsonSchema']>
    const toString = () => values.map(primitiveToString).join(' | ') as Returns<enum_<T>['toString']>
    enumGuard.def = args as never
    enumGuard.tag = URI.enum
    enumGuard.get = values
    enumGuard.toJsonSchema = toJsonSchema
    enumGuard.toString = toString
    return enumGuard as never
  }
}
