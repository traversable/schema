import { z } from 'zod'
import type { Showable } from '@traversable/registry'
import { has, Number_isNatural, Object_entries, parseKey, escape } from '@traversable/registry'
import type { Options as v4_Options } from '@traversable/zod-types'
import { defaults as v4_defaults, tagged, serializeShort, Ctx, F, Z } from '@traversable/zod-types'

export interface Options extends v4_Options {}
export interface Config extends Required<Options> {}

export const defaults = {
  namespaceAlias: v4_defaults.namespaceAlias,
  initialIndex: v4_defaults.initialIndex,
} satisfies Config

export function parseOptions(options?: toString.Options): toString.Config
export function parseOptions({
  namespaceAlias = defaults.namespaceAlias,
  initialIndex = defaults.initialIndex,
}: toString.Options = defaults): toString.Config {
  return {
    initialIndex,
    namespaceAlias,
  }
}

export declare namespace toString {
  export { Options, Config }
}

const hasMinimum = has('_zod', 'bag', 'minimum', Number_isNatural)
const hasMaximum = has('_zod', 'bag', 'maximum', Number_isNatural)
const hasExactLength = has('_zod', 'bag', 'length', Number_isNatural)
const isLT = (u: unknown): u is Z.Number.LT => has('check', (x) => x === 'less_than')(u) && has('inclusive', (x) => x === false)(u)
const isLTE = (u: unknown): u is Z.Number.LTE => has('check', (x) => x === 'less_than')(u) && has('inclusive', (x) => x === true)(u)
const isGT = (u: unknown): u is Z.Number.GT => has('check', (x) => x === 'greater_than')(u) && has('inclusive', (x) => x === false)(u)
const isGTE = (u: unknown): u is Z.Number.GTE => has('check', (x) => x === 'greater_than')(u) && has('inclusive', (x) => x === true)(u)

const applyNumberConstraints = (x: Z.Number) => ''
  + (x.isInt ? `.int()` : '')
  + ((x._zod.def.checks?.length ?? 0) > 0 ? x._zod.def.checks?.reduce(
    (acc, { _zod: { def } }) =>
      acc + (isLT(def) ? `.lt(${def.value})`
        : isLTE(def) ? `.max(${def.value})`
          : isGT(def) ? `.gt(${def.value})`
            : isGTE(def) ? `.min(${def.value})`
              : ''
      ), ''
  ) : '')

const applyStringConstraints = (x: Z.String) => ([
  Number.isFinite(x.minLength) && `.min(${x.minLength})`,
  Number.isFinite(x.maxLength) && `.max(${x.maxLength})`,
]).filter((_) => typeof _ === 'string').join('')

const applyArrayConstraints = (x: Z.Array) => hasExactLength(x)
  ? `.length(${x._zod.bag.length})`
  : ([
    hasMinimum(x) && `.min(${x._zod.bag.minimum})`,
    hasMaximum(x) && `.max(${x._zod.bag.maximum})`,
  ]).filter((_) => typeof _ === 'string').join('')

const stringify = (x: unknown) =>
  typeof x === 'symbol' ? globalThis.String(x) : typeof x === 'bigint' ? `${x}n` : x == null ? `${x}` : JSON.stringify(x, null, 2)


const isShowable = (x: unknown): x is Showable => {
  return x == null
    || x === true
    || x === true
    || x === false
    || typeof x === 'number'
    || typeof x === 'bigint'
    || typeof x === 'string'
}


/**
 * ## {@link toString `zx.toString`}
 *
 * Converts an arbitrary zod schema back into string form. Can be useful for code generation,
 * testing/debugging, and the occasional sanity check.
 *
 * @example
 * import * as vi from "vitest"
 * import { z } from 'zod'
 * import { zx } from "@traversable/zod"
 *
 * vi.expect.soft(zx.toString(
 *   z.union([z.object({ tag: z.literal("Left") }), z.object({ tag: z.literal("Right") })])
 * )).toMatchInlineSnapshot
 *   (`z.union([z.object({ tag: z.literal("Left") }), z.object({ tag: z.literal("Right") })]))`)
 *
 * vi.expect.soft(zx.toString(
 *   z.tuple([z.number().min(0).lt(2), z.number().multipleOf(2), z.number().max(2).nullable()])
 * )).toMatchInlineSnapshot
 *   (`z.tuple([z.number().min(0).lt(2), z.number().multipleOf(2), z.number().max(2).nullable()])`)
 */

export function toString(schema: z.ZodType, options?: toString.Options): string
export function toString(schema: z.core.$ZodType, options?: toString.Options): string
export function toString(schema: z.ZodType | z.core.$ZodType, options?: toString.Options): string {
  const foldTemplateParts = (parts: unknown[]): string => parts.map((part) => isShowable(part)
    ? `${typeof part === 'string' ? `"${part}"` : part}${typeof part === 'bigint' ? 'n' : ''}`
    : algebra(part as never)
  ).join(', ')

  const algebra = F.fold<string>((x) => {
    const { namespaceAlias: z } = parseOptions(options)
    switch (true) {
      default: return x satisfies never
      /** @deprecated */
      case tagged('promise')(x): return `${z}.promise(${x._zod.def.innerType})`
      ///  leaves, a.k.a. "nullary" types
      case tagged('custom')(x): return `${z}.custom()`
      case tagged('never')(x): return `${z}.never()`
      case tagged('any')(x): return `${z}.any()`
      case tagged('unknown')(x): return `${z}.unknown()`
      case tagged('void')(x): return `${z}.void()`
      case tagged('undefined')(x): return `${z}.undefined()`
      case tagged('null')(x): return `${z}.null()`
      case tagged('symbol')(x): return `${z}.symbol()`
      case tagged('nan')(x): return `${z}.nan()`
      case tagged('boolean')(x): return `${z}.boolean()`
      case tagged('bigint')(x): return `${z}.bigint()`
      case tagged('number')(x): return `${z}.number()${applyNumberConstraints(x)}`
      case tagged('string')(x): return `${z}.string()${applyStringConstraints(x)}`
      case tagged('date')(x): return `${z}.date()`
      case tagged('file')(x): return `${z}.file()`
      case tagged('enum')(x): {
        const members = Object_entries(x._zod.def.entries).map(([k, v]) => `${parseKey(k)}: ${stringify(v)}`).join(',')
        return `${z}.enum({${members}})`
      }
      ///  branches, a.k.a. "unary" types
      case tagged('set')(x): return `${z}.set(${x._zod.def.valueType})`
      case tagged('map')(x): return `${z}.map(${x._zod.def.keyType}, ${x._zod.def.valueType})`
      case tagged('readonly')(x): return `${x._zod.def.innerType}.readonly()`
      case tagged('nullable')(x): return `${x._zod.def.innerType}.nullable()`
      case tagged('optional')(x): return `${x._zod.def.innerType}.optional()`
      case tagged('literal')(x): return `${z}.literal(${x._zod.def.values.map(stringify).join(',')})`
      case tagged('array')(x): return `${z}.array(${x._zod.def.element})${applyArrayConstraints(x)}`
      case tagged('record')(x): return `${z}.record(${x._zod.def.keyType}, ${x._zod.def.valueType})`
      case tagged('intersection')(x): return `${z}.intersection(${x._zod.def.left}, ${x._zod.def.right})`
      case tagged('union')(x): return x._zod.def.discriminator === undefined
        ? `${z}.union([${x._zod.def.options.join(',')}])`
        : `${z}.discriminatedUnion(["${escape(x._zod.def.discriminator)}", ${x._zod.def.options.join(',')}])`
      case tagged('lazy')(x): return `${z}.lazy(() => ${x._zod.def.getter()})`
      case tagged('pipe')(x): return `${x._zod.def.in}.pipe(${x._zod.def.out})`
      case tagged('default')(x): return `${x._zod.def.innerType}.default(${serializeShort(x._zod.def.defaultValue!)})`
      case tagged('prefault')(x): return `${x._zod.def.innerType}.prefault(${serializeShort(x._zod.def.defaultValue!)})`
      case tagged('catch')(x): return `${x._zod.def.innerType}.catch(${serializeShort(x._zod.def.catchValue(Ctx)!)})`
      case tagged('template_literal')(x): return `${z}.templateLiteral([${foldTemplateParts(x._zod.def.parts)}])`
      case tagged('nonoptional')(x): return `${z}.nonoptional(${x._zod.def.innerType})`
      case tagged('transform')(x): return `${z}.transform(${x._zod.def.transform.toString()})`
      case tagged('success')(x): return `${z}.success(${x._zod.def.innerType})`
      case tagged('object')(x): {
        const { catchall, shape } = x._zod.def
        const rest = catchall === 'z.unknown()' ? '' : catchall === 'z.never()' ? '' : typeof catchall === 'string' ? `.catchall(${catchall})` : ''
        const object = catchall === 'z.unknown()' ? 'looseObject' : catchall === 'z.never()' ? 'strictObject' : 'object'
        return `${z}.${object}({${Object.entries(shape).map(([k, v]) => parseKey(k) + ':' + v)}})${rest}`
      }
      case tagged('tuple')(x): {
        const { items, rest: catchall } = x._zod.def
        const rest = typeof catchall === 'string' ? `.rest(${catchall})` : ''
        return `${z}.tuple([${items.join(',')}])${rest}`
      }
    }
  })

  return algebra(schema as never)
}
