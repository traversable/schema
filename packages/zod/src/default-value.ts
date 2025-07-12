import { z } from 'zod'
import type { Primitive } from '@traversable/registry'
import { Array_isArray, fn, has, isPrimitive, Object_assign, Object_fromEntries, Object_keys } from '@traversable/registry'

import * as F from './functor.js'
import { tagged, TypeName } from './typename.js'
import { Invariant } from './utils.js'

export type Fixpoint =
  | undefined
  | readonly Fixpoint[]
  | { [x: string]: Fixpoint }

export type StructurePreservingFixpoint = { [K in keyof TypeName]+?: unknown }

export type Hole<T> =
  | undefined
  | readonly T[]
  | { [x: string]: T }

export type Atom =
  | globalThis.Date
  | globalThis.RegExp

export type Fallbacks = { [K in F.Z.Nullary['_zod']['def']['type']]+?: unknown }

export type UnionTreatment =
  | 'undefined'
  | 'preserveAll'
  | 'pickFirst'
  | (keyof any)[]

export type Options<Leaves extends Fallbacks = Fallbacks> = {
  fallbacks?: Leaves
  unionTreatment?: UnionTreatment
}

/** @internal */
const pathsAreEqual = (xs: (keyof any)[], ys: (keyof any)[]) => xs.length === ys.length && xs.every((x, i) => x === ys[i])

/** @internal */
const pathIncludes = (longer: (keyof any)[], shorter: (keyof any)[]) => pathsAreEqual(
  longer.slice(0, shorter.length),
  shorter
)

/** @internal */
const IS = (x: unknown) => x != null

/** @internal */
const ARE = (x: unknown, y: unknown) => x != null && y != null

/** @internal */
const CATCH_ALL = undefined

export type defaultValue<T, Fallback = undefined>
  = T extends Primitive | Atom ? T | Fallback
  : T extends Set<any> ? Set<defaultValue<ReturnType<(ReturnType<T['values']>['return'] & {})>['value'] & {}, Fallback>>
  : T extends Map<any, any> ? Map<
    defaultValue<({} & ReturnType<{} & ReturnType<T['entries']>['return']>['value'])[0], Fallback>,
    defaultValue<({} & ReturnType<{} & ReturnType<T['entries']>['return']>['value'])[1], Fallback>
  >
  : { [K in keyof T]-?: defaultValue<T[K], Fallback> }

/** 
 * ## {@link defaultValue `zx.defaultValue`}
 *
 * Derive a defaultValue from a zod schema (v4, classic).
 * 
 * By default, {@link defaultValue `zx.defaultValue`} returns
 * `undefined` for primitive values.
 * 
 * If you'd like to change that behavior, you can pass a set
 * of fallbacks via {@link Options `Options['fallbacks']`}
 * 
 * Unions are special cases -- by default, 
 * {@link defaultValue `zx.defaultValue`} simply picks the first
 * union, and generates a default value for it. You can configure
 * this behavior via {@link Options `Options['unionTreatment']`}.
 * 
 * @example
 * import * as vi from 'vitest'
 * import { z } from 'zod'
 * import { zx } from '@traversable/zod'
 * 
 * const MySchema = z.object({
 *   abc: z.tuple([
 *     z.literal(123),
 *     z.set(z.array(z.number()))
 *   ]),
 *   def: z.string(),
 *   ghi: z.number(),
 *   jkl: z.boolean(),
 *   mno: z.optional(z.object({
 *     pqr: z.record(z.enum(['P', 'Q', 'R']), z.number()),
 *   }))
 * })
 * 
 * vi.assert.deepEqual(
 *   zx.defaultValue(MySchema), {
 *   abc: [123, new Set([[]])],
 *   def: undefined,
 *   ghi: undefined,
 *   jkl: undefined,
 *   mno: {
 *     pqr: { P: undefined, Q: undefined, R: undefined } 
 *   }
 * })
 * 
 * vi.assert.deepEqual(
 *   zx.defaultValue(
 *     MySchema, { 
 *      fallbacks: { 
 *        number: 0,
 *        boolean: false,
 *        string: ''
 *      } 
 *   }), 
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

export function defaultValue<T extends z.core.$ZodType>(type: T): defaultValue<z.infer<T>>
export function defaultValue<T extends z.core.$ZodType, Leaves extends Fallbacks>(type: T, options: Options<Leaves>): defaultValue<z.infer<T>, Leaves[keyof Leaves]>
export function defaultValue<T extends F.Z.Hole<Fixpoint>>(
  type: T, {
    fallbacks = defaultValue.defaults.fallbacks,
    unionTreatment = defaultValue.defaults.unionTreatment,
  }: Options = defaultValue.defaults
) {
  const path = Array_isArray(unionTreatment) ? unionTreatment : []

  return F.fold<Fixpoint>((x, ix) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case tagged('enum')(x): return x._zod.def.entries ?? CATCH_ALL
      case tagged('literal')(x): return x._zod.def.values[0]
      case F.isNullary(x): return fallbacks[x._zod.def.type] ?? CATCH_ALL
      case tagged('union')(x): {
        if (path.length > 0 && pathIncludes(path, ix.path)) {
          const index = path[ix.path.length + 1]
          if (index !== undefined && has(index)(x._zod.def.options)) return x._zod.def.options[index]
          else return CATCH_ALL
        }
        return unionTreatment === 'undefined' ? CATCH_ALL
          : unionTreatment === 'preserveAll' ? x._zod.def.options
            : x._zod.def.options.find(IS) ?? CATCH_ALL
      }
      case tagged('nonoptional')(x): return x._zod.def.innerType ?? CATCH_ALL
      case tagged('nullable')(x): return x._zod.def.innerType ?? CATCH_ALL
      case tagged('optional')(x): return x._zod.def.innerType ?? CATCH_ALL
      case tagged('success')(x): return x._zod.def.innerType ?? CATCH_ALL
      case tagged('readonly')(x): return x._zod.def.innerType ?? CATCH_ALL
      case tagged('array')(x): return !isPrimitive(x._zod.def.element) ? [x._zod.def.element] : Array.of<Fixpoint>()
      case tagged('set')(x): return new Set(IS(x._zod.def.valueType) ? [x._zod.def.valueType] : [])
      case tagged('map')(x): return new Map(ARE(x._zod.def.keyType, x._zod.def.valueType) ? [[x._zod.def.keyType, x._zod.def.valueType]] : [])
      case tagged('catch')(x): return x._zod.def.innerType ?? x._zod.def.catchValue ?? CATCH_ALL
      case tagged('default')(x): return x._zod.def.innerType ?? x._zod.def.defaultValue ?? CATCH_ALL
      case tagged('prefault')(x): return x._zod.def.innerType ?? x._zod.def.defaultValue ?? CATCH_ALL
      case tagged('object')(x): return x._zod.def.shape
      case tagged('tuple')(x): return [...x._zod.def.items, ...IS(x._zod.def.rest) ? [x._zod.def.rest] : []]
      case tagged('custom')(x): return x._zod.def ?? CATCH_ALL
      case tagged('lazy')(x): return x._zod.def.getter() ?? CATCH_ALL
      case tagged('pipe')(x): return x._zod.def.out ?? x._zod.def.in
      case tagged('transform')(x): return x._zod.def.transform(CATCH_ALL)
      case tagged('intersection')(x): return Object_assign(x._zod.def.left ?? {}, x._zod.def.right ?? {})
      case tagged('record')(x): {
        const keyType = x._zod.def.keyType
        return !keyType || typeof keyType !== 'object' ? {}
          : fn.pipe(Object_keys(keyType), (keys) => fn.map(keys, (k) => [k, x._zod.def.valueType ?? CATCH_ALL]), Object_fromEntries)
      }
      /** @deprecated */
      case tagged('promise')(x): return Invariant.Unimplemented('promise', 'withDefault')
    }
  })(type)
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
    template_literal: undefined,
    undefined: undefined,
    unknown: undefined,
    void: undefined,
  }
} satisfies Required<Options>

// export declare namespace withDefault {
//   export {
//     Fallbacks,
//     Fixpoint,
//     Hole,
//   }
// }

// export function withDefaultForgettingUnions<T extends z.core.$ZodType>(type: T): Fixpoint
// export function withDefaultForgettingUnions<T extends F.Z.Hole<StructurePreservingFixpoint>>(type: T) {
//   return F.fold<Fixpoint>((x, ix) => {
//     console.log('ix', ix)
//     switch (true) {
//       default: return fn.exhaustive(x)
//       case tagged('union')(x): return CATCH_ALL
//       case tagged('enum')(x): return x._zod.def.entries ?? CATCH_ALL
//       case tagged('literal')(x): return x._zod.def.values[0]
//       case F.isNullary(x): return CATCH_ALL
//       case tagged('nonoptional')(x): return x._zod.def.innerType ?? CATCH_ALL
//       case tagged('nullable')(x): return x._zod.def.innerType ?? CATCH_ALL
//       case tagged('optional')(x): return x._zod.def.innerType ?? CATCH_ALL
//       case tagged('success')(x): return x._zod.def.innerType ?? CATCH_ALL
//       case tagged('readonly')(x): return x._zod.def.innerType ?? CATCH_ALL
//       case tagged('array')(x): return IS(x._zod.def.element) ? [x._zod.def.element] : Array.of<Fixpoint>()
//       case tagged('set')(x): return new Set(IS(x._zod.def.valueType) ? [x._zod.def.valueType] : [])
//       case tagged('map')(x): return new Map(ARE(x._zod.def.keyType, x._zod.def.valueType) ? [[x._zod.def.keyType, x._zod.def.valueType]] : [])
//       case tagged('catch')(x): return x._zod.def.innerType ?? x._zod.def.catchValue ?? CATCH_ALL
//       case tagged('default')(x): return x._zod.def.innerType ?? x._zod.def.defaultValue ?? CATCH_ALL
//       case tagged('prefault')(x): return x._zod.def.innerType ?? x._zod.def.defaultValue ?? CATCH_ALL
//       case tagged('object')(x): return x._zod.def.shape
//       case tagged('tuple')(x): return [...x._zod.def.items, ...IS(x._zod.def.rest) ? [x._zod.def.rest] : []]
//       case tagged('custom')(x): return x._zod.def ?? CATCH_ALL
//       case tagged('lazy')(x): return x._zod.def.getter() ?? CATCH_ALL
//       case tagged('pipe')(x): return x._zod.def.out ?? x._zod.def.in ?? CATCH_ALL
//       case tagged('transform')(x): return x._zod.def.transform(CATCH_ALL)
//       case tagged('intersection')(x): return Object_assign(x._zod.def.left ?? {}, x._zod.def.right ?? {})
//       case tagged('record')(x): {
//         const keyType = x._zod.def.keyType
//         switch (true) {
//           default: return {}
//           case !!keyType && typeof keyType === 'object': {
//             return fn.pipe(
//               keyType,
//               Object_keys,
//               (keys) => fn.map(keys, (k) => [k, x._zod.def.valueType ?? CATCH_ALL]),
//               Object_fromEntries,
//             )
//           }
//         }
//       }
//       /** @deprecated */
//       case tagged('promise')(x): return Invariant.Unimplemented('promise', 'withDeafult')
//     }
//   })(type as never, [])
// }