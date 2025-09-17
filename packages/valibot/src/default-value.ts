import * as v from 'valibot'
import type { Primitive, Showable } from '@traversable/registry'
import { fn, has, isPrimitive } from '@traversable/registry'
import type { AnyTag, AnyValibotSchema } from '@traversable/valibot-types'
import { isNullary, fold, tagged } from '@traversable/valibot-types'

export type Fixpoint =
  | undefined
  | readonly Fixpoint[]
  | { [x: string]: Fixpoint }

export type StructurePreservingFixpoint = { [K in keyof AnyTag]+?: unknown }

export type Hole<T> =
  | undefined
  | readonly T[]
  | { [x: string]: T }

export type Atom =
  | globalThis.Date
  | globalThis.RegExp

export type Fallbacks = { [K in AnyTag]+?: unknown }

export type UnionTreatment =
  | 'undefined'
  | 'preserveAll'
  | 'pickFirst'
  | (keyof any)[]

export type Options<Leaves extends Fallbacks = Fallbacks> = {
  fallbacks?: Leaves
  unionTreatment?: UnionTreatment
}

const CATCH_ALL = undefined
const NOT_NIL = (x: unknown) => x != null

const pathsAreEqual = (xs: (keyof any)[], ys: (keyof any)[]) => xs.length === ys.length && xs.every((x, i) => x === ys[i])

const pathIncludes = (longer: (keyof any)[], shorter: (keyof any)[]) => pathsAreEqual(
  longer.slice(0, shorter.length),
  shorter
)

export type Match<T, Matchers>
  = T extends Primitive ?
  | Matchers[T & keyof Matchers]
  | Matchers[`${T & Showable}` & keyof Matchers]
  : { [K in keyof T]: Match<T[K], Matchers> }

export type MatchPrimitive<
  T,
  TypeMap,
  M extends MergeTypeMap<TypeMap> = MergeTypeMap<TypeMap>
> = Match<T,
  & { [x: string]: M['string'] }
  & { [x: number]: M['number'] }
  & { [x: symbol]: M['boolean'] }
  & { [x: `${bigint}`]: M['bigint'] }
  & {
    true: M['boolean']
    false: M['boolean']
    null: M['null']
    undefined: M['undefined']
  }
>

export type DefaultTypeMap = {
  never: undefined
  any: undefined
  unknown: undefined
  undefined: undefined
  null: undefined
  boolean: undefined
  bigint: undefined
  number: undefined
  string: undefined
}

export type AnyTypeMap = {
  never: unknown
  any: unknown
  unknown: unknown
  undefined: unknown
  null: unknown
  boolean: unknown
  bigint: unknown
  number: unknown
  string: unknown
}

export type MergeTypeMap<T> = {
  [K in keyof DefaultTypeMap]: K extends keyof T ? T[K] : DefaultTypeMap[K]
}

export type defaultValue<
  T,
  TypeMap = DefaultTypeMap,
  M extends MergeTypeMap<TypeMap> = MergeTypeMap<TypeMap>
> = unknown extends T ? (0 extends T & 1 ? M['any'] : M['unknown'])
  : [T] extends [never] ? M['never']
  : T extends Primitive ? MatchPrimitive<T, M>
  : T extends Set<any> ? Set<defaultValue<ReturnType<(ReturnType<T['values']>['return'] & {})>['value'] & {}, TypeMap, M>>
  : T extends Map<any, any> ? Map<
    defaultValue<({} & ReturnType<{} & ReturnType<T['entries']>['return']>['value'])[0], TypeMap, M>,
    defaultValue<({} & ReturnType<{} & ReturnType<T['entries']>['return']>['value'])[1], TypeMap, M>
  >
  : { [K in keyof T]: defaultValue<T[K], TypeMap, M> }

/** 
 * ## {@link defaultValue `vx.defaultValue`}
 *
 * Derive a default value from a Valibot schema.
 * 
 * By default, {@link defaultValue `vx.defaultValue`} returns
 * `undefined` for primitive values.
 * 
 * If you'd like to change that behavior, you can pass a set
 * of fallbacks via {@link Options `Options['fallbacks']`}
 * 
 * Unions are special cases -- by default, 
 * {@link defaultValue `vx.defaultValue`} simply picks the first
 * union, and generates a default value for it. You can configure
 * this behavior via {@link Options `Options['unionTreatment']`}.
 * 
 * @example
 * import * as vi from 'vitest'
 * import * as v from 'valibot'
 * import { vx } from '@traversable/valibot'
 * 
 * const MySchema = v.object({
 *   abc: v.tuple([
 *     v.literal(123),
 *     v.set(
 *       v.array(v.number())
 *     )
 *   ]),
 *   def: v.string(),
 *   ghi: v.number(),
 *   jkl: v.boolean(),
 *   mno: v.optional(v.object({
 *     pqr: v.record(
 *       v.enum(['P', 'Q', 'R']),
 *       v.number()
 *     ),
 *   }))
 * })
 * 
 * vi.assert.deepEqual(
 *   vx.defaultValue(MySchema), 
 *   {
 *     abc: [123, new Set([[]])],
 *     def: undefined,
 *     ghi: undefined,
 *     jkl: undefined,
 *     mno: {
 *       pqr: {
 *         P: undefined,
 *         Q: undefined,
 *         R: undefined
 *       }
 *     }
 *   }
 * )
 * 
 * vi.assert.deepEqual(
 *   vx.defaultValue(
 *     MySchema, 
 *     { 
 *       fallbacks: { 
 *         number: 0,
 *         boolean: false,
 *         string: ''
 *       }
 *     }
 *   ), 
 *   {
 *     abc: [123, new Set([[]])],
 *     def: '',
 *     ghi: 0,
 *     jkl: false,
 *     mno: {
 *       pqr: { P: 0, Q: 0, R: 0 } 
 *     }
 *   }
 * )
 */

// export function defaultValue<T extends AnyValibotSchema>(type: T): defaultValue<v.InferOutput<T>>
// export function defaultValue<T extends AnyValibotSchema, Leaves extends Fallbacks>(type: T, options: Options<Leaves>): defaultValue<v.InferOutput<T>, Leaves[keyof Leaves]>
// export function defaultValue<T extends AnyValibotSchema>(
export function defaultValue<T extends AnyValibotSchema>(type: T): defaultValue<v.InferOutput<T>>
export function defaultValue<T extends AnyValibotSchema, Leaves extends Fallbacks>(type: T, options: Options<Leaves>): defaultValue<v.InferOutput<T>, Leaves>
export function defaultValue<T extends AnyValibotSchema>(
  schema: T, {
    fallbacks = defaultValue.defaults.fallbacks,
    unionTreatment = defaultValue.defaults.unionTreatment,
  }: Options = defaultValue.defaults
) {
  const path = Array.isArray(unionTreatment) ? unionTreatment : []

  return fold<Fixpoint>((x, ix) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case tagged('enum')(x): return x.options ?? CATCH_ALL
      case tagged('literal')(x): return x.literal ?? CATCH_ALL
      case isNullary(x): return fallbacks[x.type] ?? CATCH_ALL
      case tagged('custom')(x): return CATCH_ALL
      case tagged('optional')(x): return x.wrapped ?? CATCH_ALL
      case tagged('exactOptional')(x): return x.wrapped ?? CATCH_ALL
      case tagged('nonOptional')(x): return x.wrapped ?? CATCH_ALL
      case tagged('nullable')(x): return x.wrapped ?? CATCH_ALL
      case tagged('nonNullable')(x): return x.wrapped ?? CATCH_ALL
      case tagged('nullish')(x): return x.wrapped ?? CATCH_ALL
      case tagged('nonNullish')(x): return x.wrapped ?? CATCH_ALL
      case tagged('undefinedable')(x): return x.wrapped ?? CATCH_ALL
      case tagged('object')(x):
      case tagged('looseObject')(x):
      case tagged('strictObject')(x):
      case tagged('objectWithRest')(x): return x.entries
      case tagged('tuple')(x):
      case tagged('looseTuple')(x):
      case tagged('strictTuple')(x):
      case tagged('tupleWithRest')(x): return x.items
      case tagged('array')(x): return !isPrimitive(x.item) ? [x.item] : Array.of<Fixpoint>()
      case tagged('set')(x): return new Set(NOT_NIL(x.value) ? [x.value] : [])
      case tagged('map')(x): return new Map(NOT_NIL(x.key) && NOT_NIL(x.value) ? [[x.key, x.value]] : [])
      case tagged('lazy')(x): return x.getter() ?? CATCH_ALL
      case tagged('intersect')(x): return Object.assign({}, ...x.options)
      case tagged('record')(x): return !x.key || typeof x.key !== 'object' ? {} : fn.pipe(
        Object.values(x.key),
        (value) => fn.map(value, (k) => [k, x.value ?? CATCH_ALL]),
        Object.fromEntries
      )
      case tagged('union')(x):
      case tagged('variant')(x): {
        if (path.length > 0 && pathIncludes(path, ix.path)) {
          const index = path[ix.path.length + 1]
          if (index !== undefined && has(index)(x.options)) return x.options[index]
          else return CATCH_ALL
        }
        return unionTreatment === 'undefined' ? CATCH_ALL
          : unionTreatment === 'preserveAll' ? x.options
            : x.options.find(NOT_NIL) ?? CATCH_ALL
      }
      case tagged('promise')(x): return import('@traversable/valibot-types').then(({ Invariant }) => Invariant.Unimplemented('promise', 'defaultValue'))
    }
  })(schema)
}

defaultValue.defaults = {
  unionTreatment: 'pickFirst',
  fallbacks: {
    any: undefined,
    bigint: undefined,
    boolean: undefined,
    date: undefined,
    file: undefined,
    literal: undefined,
    nan: undefined,
    never: undefined,
    null: undefined,
    number: undefined,
    string: undefined,
    symbol: undefined,
    undefined: undefined,
    unknown: undefined,
    void: undefined,
  }
} satisfies Required<Options>
