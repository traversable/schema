import { z } from 'zod/v4'
import type { Primitive } from '@traversable/registry'
import { Array_isArray, fn, has, Object_assign, Object_fromEntries, Object_keys, pick, symbol } from '@traversable/registry'

import * as F from './functor.js'
import { tagged, TypeName } from './typename.js'
import { Invariant } from './utils.js'
import { toString } from './toString.js'

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

export type withDefault<T, Fallback = undefined>
  = T extends Primitive | Atom ? T | Fallback
  : T extends Set<any> ? Set<withDefault<ReturnType<(ReturnType<T['values']>['return'] & {})>['value'] & {}, Fallback>>
  : T extends Map<any, any> ? Map<
    withDefault<({} & ReturnType<{} & ReturnType<T['entries']>['return']>['value'])[0], Fallback>,
    withDefault<({} & ReturnType<{} & ReturnType<T['entries']>['return']>['value'])[1], Fallback>
  >
  : { [K in keyof T]-?: withDefault<T[K], Fallback> }

export function withDefault<T extends z.core.$ZodType>(type: T): withDefault<z.infer<T>>
export function withDefault<T extends z.core.$ZodType, Leaves extends Fallbacks>(type: T, options: Options<Leaves>): withDefault<z.infer<T>, Leaves[keyof Leaves]>
export function withDefault<T extends F.Z.Hole<Fixpoint>>(
  type: T, {
    fallbacks = withDefault.defaults.fallbacks,
    unionTreatment = withDefault.defaults.unionTreatment,
  }: Options = withDefault.defaults
) {
  const path = Array_isArray(unionTreatment) ? unionTreatment : []

  return F.fold<Fixpoint>((x, ix) => {
    if (pathsAreEqual([symbol.union, 0], ix)) {
      // console.log('x', x)
      // console.log('path is: [symbol.union, 0], x: ', toString(x))
    }

    // console.group('\n\nTEMP')
    // console.log('ix', ix)
    // console.groupEnd()

    switch (true) {
      default: return fn.exhaustive(x)
      case tagged('enum')(x): return x._zod.def.entries ?? CATCH_ALL
      case tagged('literal')(x): return x._zod.def.values[0]
      case F.isNullary(x): return fallbacks[x._zod.def.type] ?? CATCH_ALL
      case tagged('union')(x): {
        // if (pathIncludes(path, ix ?? [])) {
        //   const index = path[(ix ?? []).length + 1]
        // if (path.length > 0) {
        //   console.group('\n\nwithDefault')
        //   console.log('path', path)
        //   console.log('ix', ix)
        //   console.groupEnd()
        // }

        if (pathsAreEqual(path, ix)) {
          console.group('\n\nwithDefault, pathsAreEqual')
          console.log('path', path)
          console.log('ix', ix)
          console.groupEnd()
        }

        if (path.length > 0 && pathIncludes(path, ix)) {
          const index = path[ix.length + 1]
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
      case tagged('array')(x): return IS(x._zod.def.element) ? [x._zod.def.element] : Array.of<Fixpoint>()
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
      case tagged('promise')(x): return Invariant.Unimplemented('promise', 'v4.withDefault')
    }
  })(type, [])
}

export function withDefaultForgettingUnions<T extends z.core.$ZodType>(type: T): Fixpoint
export function withDefaultForgettingUnions<T extends F.Z.Hole<StructurePreservingFixpoint>>(type: T) {
  return F.fold<Fixpoint>((x, ix) => {
    console.log('ix', ix)
    switch (true) {
      default: return fn.exhaustive(x)
      case tagged('union')(x): return CATCH_ALL
      case tagged('enum')(x): return x._zod.def.entries ?? CATCH_ALL
      case tagged('literal')(x): return x._zod.def.values[0]
      case F.isNullary(x): return CATCH_ALL
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
      case tagged('object')(x): return x._zod.def.shape
      case tagged('tuple')(x): return [...x._zod.def.items, ...IS(x._zod.def.rest) ? [x._zod.def.rest] : []]
      case tagged('custom')(x): return x._zod.def ?? CATCH_ALL
      case tagged('lazy')(x): return x._zod.def.getter() ?? CATCH_ALL
      case tagged('pipe')(x): return x._zod.def.out ?? x._zod.def.in ?? CATCH_ALL
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

const pathsAreEqual = (xs: (keyof any)[], ys: (keyof any)[]) => xs.length === ys.length && xs.every((x, i) => x === ys[i])
const pathIncludes = (longer: (keyof any)[], shorter: (keyof any)[]) => {
  if (!longer) {
    // console.log('no longer, shorter: ', shorter)
    throw Error('no longer')
  }
  if (!shorter) {
    // console.log('no shorter, longer: ', longer)
    throw Error('no shorter')
  }
  return pathsAreEqual(longer.slice(0, shorter.length), shorter)
}

const IS = (x: unknown) => x != null
const ARE = (x: unknown, y: unknown) => x != null && y != null
const CATCH_ALL = undefined

withDefault.defaults = {
  unionTreatment: 'pickFirst',
  fallbacks: {
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
  }
} satisfies Required<Options>

export declare namespace withDefault {
  export {
    Fallbacks,
    Fixpoint,
    Hole,
  }
}
