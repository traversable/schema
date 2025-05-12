import { z } from 'zod4'
import { Array_isArray, fn, has, Number_isNatural, Object_entries, parseKey } from '@traversable/registry'
import { Json } from '@traversable/json'
import type { Z } from './functor-v4.js'
import { fold } from './functor-v4.js'
import type { Options as v4_Options } from './utils-v4.js'
import { defaults as v4_defaults, Warn, tagged, ctx } from './utils-v4.js'

export interface Options extends v4_Options {
  format?: boolean
  maxWidth?: number
}
export interface Config extends Required<Options> {}

export const defaults = {
  // ...defaults,
  format: false,
  maxWidth: 99,
  namespaceAlias: v4_defaults.namespaceAlias,
  initialIndex: v4_defaults.initialIndex,
} satisfies Config

export function parseOptions(options?: toString.Options): toString.Config
export function parseOptions({
  format = defaults.format,
  maxWidth = defaults.maxWidth,
  namespaceAlias = defaults.namespaceAlias,
  initialIndex = defaults.initialIndex,
}: toString.Options = defaults): toString.Config {
  return {
    initialIndex,
    format,
    maxWidth,
    namespaceAlias,
  }
}

export declare namespace toString {
  export { Options, Config }
}

const hasMinimum = has('_zod', 'computed', 'minimum', Number_isNatural)
const hasMaximum = has('_zod', 'computed', 'maximum', Number_isNatural)
const hasExactLength = has('_zod', 'computed', 'length', Number_isNatural)
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
  ? `.length(${x._zod.computed.length})`
  : ([
    hasMinimum(x) && `.min(${x._zod.computed.minimum})`,
    hasMaximum(x) && `.max(${x._zod.computed.maximum})`,
  ]).filter((_) => typeof _ === 'string').join('')

export function serializeShort(json: Json): string
export function serializeShort(json: {} | null): string
export function serializeShort(json: unknown): string {
  return Json.fold<string>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x === null:
      case x === undefined:
      case typeof x === 'boolean':
      case typeof x === 'number':
      case typeof x === 'string': return JSON.stringify(x)
      case Array_isArray(x): return x.length === 0 ? '[]' : '[' + x.join(', ') + ']'
      case !!x && typeof x === 'object': {
        const xs = Object.entries(x)
        return xs.length === 0 ? '{}' : '{' + xs.map(([k, v]) => parseKey(k) + ': ' + v).join(',') + '}]'
      }
    }
  })(json as Json)
}

const stringify = (x: unknown) =>
  typeof x === 'symbol' ? globalThis.String(x)
    : typeof x === 'bigint' ? `${x}n`
      : JSON.stringify(x, null, 2)

/**
 * ## {@link toString `zod.toString`}
 *
 * Converts an arbitrary zod schema back into string form. Can be useful for code generation,
 * testing/debugging, and the occasional sanity check.
 *
 * Formatting support is experimental.
 *
 * @example
* import * as vi from "vitest"
* import { v4 } from "@traversable/schema-zod-adapter"
*
* vi.expect(v4.toString(
*   z.union([z.object({ tag: z.literal("Left") }), z.object({ tag: z.literal("Right") })])
* )).toMatchInlineSnapshot
*   (`z.union([z.object({ tag: z.literal("Left") }), z.object({ tag: z.literal("Right") })]))`)
*
* vi.expect(v4.toString(
*   z.tuple([z.number().min(0).lt(2), z.number().multipleOf(2), z.number().max(2).nullable()])
* )).toMatchInlineSnapshot
*   (`z.tuple([z.number().min(0).lt(2), z.number().multipleOf(2), z.number().max(2).nullable()])`)
*/

z.enum({ a: 1 })._zod.def.entries
z.enum(['a', 'b'])._zod.def.entries

export function toString(schema: z.ZodType, options?: toString.Options): string {
  return fold<string>((x, ix) => {
    const { format: FORMAT, namespaceAlias: z, maxWidth: MAX_WIDTH } = parseOptions(options)
    const JOIN = ',\n' + '  '.repeat(ix.length + 1)
    switch (true) {
      default: return x satisfies never
      // deprecated
      case tagged('promise')(x): return Warn.Deprecated('promise', 'toString')(`${z}.promise(${x._zod.def.innerType})`)
      //  leaves, a.k.a. "nullary" types
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
        const entries = Object_entries(x._zod.def.entries)
        return entries.length === 0
          ? `${z}.enum({})`
          : `${z}.enum({ ${entries.map(([k, v]) => `${parseKey(k)}: ${stringify(v)}`).join(', ')} })`
      }
      ///  branches, a.k.a. "unary" types
      case tagged('set')(x): return `${z}.set(${x._zod.def.valueType})`
      case tagged('map')(x): return `${z}.map(${x._zod.def.keyType}, ${x._zod.def.valueType})`
      case tagged('readonly')(x): return `${x._zod.def.innerType}.readonly()`
      case tagged('nullable')(x): return `${x._zod.def.innerType}.nullable()`
      case tagged('optional')(x): return `${x._zod.def.innerType}.optional()`
      case tagged('literal')(x): return `${z}.literal(${x._zod.def.values.map(stringify).join(', ')})`
      case tagged('array')(x): return `${z}.array(${x._zod.def.element})${applyArrayConstraints(x)}`
      case tagged('record')(x): return `${z}.record(${x._zod.def.keyType}, ${x._zod.def.valueType})`
      case tagged('intersection')(x): return `${z}.intersection(${x._zod.def.left}, ${x._zod.def.right})`
      case tagged('union')(x): return `${z}.union([${x._zod.def.options.join(', ')}])`
      case tagged('lazy')(x): return `${z}.lazy(() => ${x._zod.def.getter()})`
      case tagged('pipe')(x): return `${x._zod.def.in}.pipe(${x._zod.def.out})`
      case tagged('default')(x): return `${x._zod.def.innerType}.default(${serializeShort(x._zod.def.defaultValue(ctx)!)})`
      case tagged('catch')(x): return `${x._zod.def.innerType}.catch(${x._zod.def.innerType}, ${serializeShort(x._zod.def.catchValue(ctx)!)})`
      case tagged('template_literal')(x): return `${z}.templateLiteral([${x._zod.def.parts.join(', ')}])`
      case tagged('nonoptional')(x): return `${z}.nonoptional(${x._zod.def.innerType})`
      // TODO: revisit 
      // case tagged('transform')(x): return `${z}.transform(${x._zod.def.transform})`
      case tagged('transform')(x): return `${z}.transform(function() {})`
      case tagged('success')(x): return `${z}.success(${x._zod.def.innerType})`
      case tagged('object')(x): {
        const BODY = Object
          .entries(x._zod.def.shape)
          .map(([k, v]) => parseKey(k) + ': ' + v)
        const CATCHALL = typeof x._zod.def.catchall === 'string' ? `.catchall(${x._zod.def.catchall})` : ''
        if (BODY.length === 0) return `${z}.object({})${CATCHALL}`
        else {
          const SINGLE_LINE = `${z}.object({ ${BODY.join(', ')} })${CATCHALL}`
          const WIDTH = ix.length * 2 + SINGLE_LINE.length
          return !FORMAT ? SINGLE_LINE
            : WIDTH < MAX_WIDTH ? SINGLE_LINE
              : `${z}.object({`
              + '\n'
              + '  '.repeat(ix.length + 1)
              + BODY.join(JOIN)
              + '\n'
              + '  '.repeat(ix.length)
              + '})'
              + CATCHALL
        }
      }
      case tagged('tuple')(x): {
        const REST = typeof x._zod.def.rest === 'string' ? `.rest(${x._zod.def.rest})` : ''
        const BODY = x._zod.def.items
        if (BODY.length === 0) return `${z}.tuple([])${REST}`
        else {
          const SINGLE_LINE = `${z}.tuple([${BODY.join(', ')}])${REST}`
          const WIDTH = ix.length * 2 + SINGLE_LINE.length
          return !FORMAT ? SINGLE_LINE
            : WIDTH < MAX_WIDTH
              ? SINGLE_LINE
              : `${z}.tuple([`
              + '\n'
              + '  '.repeat(ix.length + 1)
              + BODY.join(JOIN)
              + '\n'
              + '  '.repeat(ix.length)
              + `])`
              + REST
        }
      }
    }
  })(schema as never, [])
}
