import type { Join, Primitive, Showable, UnionToTuple } from '@traversable/registry'

/** @internal */
const Object_values = globalThis.Object.values

/** @internal */
const Object_assign = globalThis.Object.assign

export { enum_ as enum }
interface enum_<T> extends enum_.def<T> { }
declare namespace enum_ {
  type toString<T> = T extends readonly Primitive[]
    ? tupleToString<T>
    : objectToString<T>

  type memberToString<T> = never | T extends symbol ? 'symbol' : T extends bigint ? `${T}n` : T extends string ? `'${T}'` : `${T & Showable}`
  type tupleToString<T extends readonly Primitive[]> = never | Join<{ [I in keyof T]: memberToString<T[I]> }, ' | '>
  type objectToString<S, T = UnionToTuple<S[keyof S]>> = never | Join<{ [I in keyof T]: memberToString<T[I]> }, ' | '>

  interface jsonSchema<T> { get(): { enum: T } }

  type Values<T> = T extends readonly unknown[]
    ? never | { [I in keyof T]: T[I] extends undefined | symbol | bigint ? void : T[I] }
    : never | Exclude<T[keyof T], undefined | symbol | bigint>[]
    ;

  interface def<
    T,
    _type = T extends readonly unknown[] ? T[number] : T[keyof T]
  > {
    def: T
    _type: _type
    toString(): enum_.toString<T>
    jsonSchema(): { enum: Values<T> }
    (u: unknown): u is _type
  }
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
function enum_<const T extends readonly Primitive[]>(...primitives: readonly [...T]): enum_<[...T]>
function enum_<const T extends Record<string, Primitive>>(record: T): enum_<{ -readonly [K in keyof T]: T[K] }>
function enum_(
  ...args:
    | [...primitives: unknown[]]
    | [record: Record<string, unknown>]
) {
  const [head, ...tail] = args
  const values = !!head && typeof head === 'object' ? Object_values(head) : [head, ...tail]
  function enumGuard(u: unknown): u is never { return values.includes(u) }
  return Object_assign(
    enumGuard, {
    def: args,
    _type: <never>void 0,
    get: values,
    jsonSchema() { return { enum: values.map(primitiveToJsonSchema) } },
    toString() { return <never>values.map(primitiveToString).join(' | ') }
  })
}
