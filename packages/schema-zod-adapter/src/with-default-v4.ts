import { z } from 'zod/v4'
import type { Primitive } from '@traversable/registry'
import { fn, Object_assign, Object_fromEntries, Object_keys } from '@traversable/registry'

import * as F from './functor-v4.js'
import { tagged } from './typename-v4.js'
import { Invariant } from './utils-v4.js'

export type Fixpoint =
  | undefined
  | readonly Fixpoint[]
  | { [x: string]: Fixpoint }

export type Hole<T> =
  | undefined
  | readonly T[]
  | { [x: string]: T }

export type Atom =
  | globalThis.Date
  | globalThis.RegExp

export type Fallbacks = { [K in F.Z.Nullary['_zod']['def']['type']]+?: unknown }

export type withDefault<T, Fallback = undefined>
  = T extends Primitive | Atom ? T | Fallback
  : T extends Set<any> ? Set<withDefault<ReturnType<(ReturnType<T['values']>['return'] & {})>['value'] & {}, Fallback>>
  : T extends Map<any, any> ? Map<
    withDefault<({} & ReturnType<{} & ReturnType<T['entries']>['return']>['value'])[0], Fallback>,
    withDefault<({} & ReturnType<{} & ReturnType<T['entries']>['return']>['value'])[1], Fallback>
  >
  : { [K in keyof T]-?: withDefault<T[K], Fallback> }

export function withDefault<T extends z.core.$ZodType>(type: T): withDefault<z.infer<T>>
export function withDefault<T extends z.core.$ZodType, Leaves extends Fallbacks>(type: T, fallbacks: Leaves): withDefault<z.infer<T>, Leaves[keyof Leaves]>
export function withDefault<T extends F.Z.Hole<Fixpoint>>(type: T, fallbacks: Fallbacks = withDefault.defaults) {
  return F.fold<Fixpoint>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case tagged('enum')(x): return x._zod.def.entries ?? CATCH_ALL
      case F.isNullary(x): return fallbacks[x._zod.def.type] ?? CATCH_ALL
      case tagged('nonoptional')(x): return x._zod.def.innerType ?? CATCH_ALL
      case tagged('nullable')(x): return x._zod.def.innerType ?? CATCH_ALL
      case tagged('optional')(x): return x._zod.def.innerType ?? CATCH_ALL
      case tagged('success')(x): return x._zod.def.innerType ?? CATCH_ALL
      case tagged('readonly')(x): return x._zod.def.innerType ?? CATCH_ALL
      case tagged('array')(x): return IS(x._zod.def.element) ? [x._zod.def.element] : Array.of<Fixpoint>()
      case tagged('set')(x): return new Set(IS(x._zod.def.valueType) ? [x._zod.def.valueType] : [])
      case tagged('map')(x): return new Map(ARE(x._zod.def.keyType, x._zod.def.valueType) ? [[x._zod.def.keyType, x._zod.def.valueType]] : [])
      case tagged('catch')(x): return x._zod.def.innerType ?? x._zod.def.catchValue ?? CATCH_ALL
      case tagged('default')(x): return x._zod.def.innerType ?? x._zod.def.defaultValue ?? CATCH_ALL
      case tagged('prefault')(x): return x._zod.def.innerType ?? x._zod.def.defaultValue ?? CATCH_ALL
      case tagged('union')(x): return x._zod.def.options.find(IS) ?? CATCH_ALL
      case tagged('object')(x): return x._zod.def.shape
      case tagged('tuple')(x): return [...x._zod.def.items, ...IS(x._zod.def.rest) ? [x._zod.def.rest] : []]
      case tagged('custom')(x): return x._zod.def ?? CATCH_ALL
      case tagged('lazy')(x): return x._zod.def.getter() ?? CATCH_ALL
      case tagged('pipe')(x): return x._zod.def.out ?? x._zod.def.in
      case tagged('transform')(x): return x._zod.def.transform(CATCH_ALL)
      case tagged('intersection')(x): return Object_assign(x._zod.def.left ?? {}, x._zod.def.right ?? {})
      case tagged('record')(x): {
        const keyType = x._zod.def.keyType
        switch (true) {
          default: return {}
          case !!keyType && typeof keyType === 'object': {
            return fn.pipe(
              keyType,
              Object_keys,
              (keys) => fn.map(keys, (k) => [k, x._zod.def.valueType ?? CATCH_ALL]),
              Object_fromEntries,
            )
          }
        }
      }
      /** @deprecated */
      case tagged('promise')(x): return Invariant.Unimplemented('promise', 'v4.withDeafult')
    }
  })(type)
}

const IS = (x: unknown) => x != null
const ARE = (x: unknown, y: unknown) => x != null && y != null
const CATCH_ALL = undefined

withDefault.defaults = {
  any: undefined,
  bigint: undefined,
  boolean: undefined,
  date: undefined,
  enum: undefined,
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
} satisfies Required<Fallbacks>

export declare namespace withDefault {
  export {
    Fallbacks,
    Fixpoint,
    Hole,
  }
}
