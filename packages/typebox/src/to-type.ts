import * as typebox from '@sinclair/typebox'
import { F } from '@traversable/typebox-types'
import {
  PatternNeverExact,
  PatternNumberExact,
  PatternStringExact,
} from '@sinclair/typebox/type'
import { Object_entries, Object_values, parseKey, stringifyKey } from '@traversable/registry'

function canBeInterface(x: unknown): boolean {
  return F.tagged('object')(x)
    || F.tagged('array')(x)
    || F.tagged('record')(x)
    || F.tagged('tuple')(x)
    || F.tagged('allOf')(x)
}

function needsNewtype(x: unknown): boolean {
  return F.tagged('object')(x)
    || F.tagged('record')(x)
    || F.tagged('tuple')(x)
    || F.tagged('allOf')(x)
}

const algebra = F.fold<string>((x, ix, input) => {
  switch (true) {
    default: return x satisfies never
    case F.tagged('optional')(x): return ix.isProperty ? x.schema : `undefined | ${x.schema}`
    case F.tagged('never')(x): return 'never'
    case F.tagged('any')(x): return 'any'
    case F.tagged('unknown')(x): return 'unknown'
    case F.tagged('void')(x): return 'void'
    case F.tagged('undefined')(x): return 'undefined'
    case F.tagged('null')(x): return 'null'
    case F.tagged('symbol')(x): return 'symbol'
    case F.tagged('boolean')(x): return 'boolean'
    case F.tagged('number')(x): return 'number'
    case F.tagged('bigInt')(x): return 'bigint'
    case F.tagged('integer')(x): return 'number'
    case F.tagged('string')(x): return 'string'
    case F.tagged('date')(x): return 'Date'
    case F.tagged('literal')(x): return typeof x.const === 'string' ? stringifyKey(x.const) : `${x.const}`
    case F.tagged('array')(x): return `Array<${x.items}>`
    case F.tagged('allOf')(x): return x.allOf.length === 0 ? 'unknown' : x.allOf.length === 1 ? x.allOf[0] : `(${x.allOf.join(' & ')})`
    case F.tagged('anyOf')(x): return x.anyOf.length === 0 ? 'unknown' : x.anyOf.length === 1 ? x.anyOf[0] : `(${x.anyOf.join(' | ')})`
    case F.tagged('record')(x): {
      let KEY = PatternNeverExact in x.patternProperties ? 'never' : [
        PatternNumberExact in x.patternProperties ? 'number' : null,
        PatternStringExact in x.patternProperties ? 'string' : null,
      ].filter((_) => _ !== null).join(' | ')
      return `Record<${KEY}, ${Object_values(x.patternProperties).join(' | ')}>`
    }
    case F.tagged('object')(x): {
      const OPT = Object_entries((input as typebox.TObject).properties).filter(([, v]) => F.isOptional(v)).map(([k]) => k)
      const xs = Object_entries(x.properties).map(([k, v]) => `${parseKey(k)}${OPT.includes(k) ? '?' : ''}: ${v}`)
      return xs.length === 0 ? '{}' : `{ ${xs.join(', ')} }`
    }
    case F.tagged('tuple')(x): {
      const lastRequiredIndex = (input as typebox.TTuple).items?.findLastIndex((x) => !F.isOptional(x)) ?? -1
      const req = lastRequiredIndex === -1 ? [] : x.items.slice(0, lastRequiredIndex + 1)
      const opt = lastRequiredIndex === -1 ? x.items : x.items.slice(lastRequiredIndex + 1)
      const body = [...req, ...opt.map((item) => `_?: ${item.startsWith('undefined | ') ? item.substring('undefined | '.length) : item}`)]
      /** TODO: handle "rest" properties */
      return `[${body.join(', ')}]`
    }
  }
})

/**
 * ## {@link toType `box.toType`}
 *
 * Converts an arbitrary typebox schema into a string representing its underlying TypeScript type.
 *
 * @example
 * import * as vi from 'vitest'
 * import * as T from '@sinclair/typebox'
 * import { box } from '@traversable/typebox'
 *
 * vi.expect(box.toType(
 *   T.Record(T.Enum({ a: 'A', b: 'B', c: 'C' }), T.Literal(1))
 * )).toMatchInlineSnapshot
 *   (`"{ A: 1, B: 1, C: 1 }"`)
 * 
 * vi.expect(box.toType(
 *   T.Intersect([T.Number(), T.Union([T.Literal(1), T.Literal(2), T.Literal(3)])])
 * )).toMatchInlineSnapshot
 *   (`"number & (1 | 2 | 3)"`)
 * 
 * vi.expect(box.toType(
 *   T.Object({
 *     x: T.Optional(T.Array(T.Number())),
 *     y: T.Optional(T.Array(T.Number())),
 *     z: T.Optional(T.Array(T.Number())),
 *   })
 * )).toMatchInlineSnapshot
 *   (`"{ x?: Array<number>, y?: Array<number>, z?: Array<number> }"`)
 * 
 * // Use the `typeName` option to give you type a name:
 * vi.expect(box.toType(
 *   T.Object({ a: T.Optional(T.Number()) }),
 *   { typeName: 'MyType' }
 * )).toMatchInlineSnapshot
 *   (`"type MyType = { a?: number }"`)
 */

export function toType(schema: typebox.TAnySchema, options?: toType.Options): string
export function toType(schema: typebox.TAnySchema, options?: toType.Options): string {
  const $ = parseOptions(options)
  let TYPE = algebra(schema as never)
  if (TYPE.startsWith('(') && TYPE.endsWith(')')) TYPE = TYPE.slice(1, -1)
  const NEWTYPE = !$.includeNewtypeDeclaration ? null : [
    `// @ts-expect-error: newtype hack`,
    `interface newtype<T extends {}> extends T {}`,
  ].join('\n')
  return $.typeName === undefined ? TYPE
    : $.preferInterface && canBeInterface(schema) ? [
      needsNewtype(schema) ? NEWTYPE : null,
      `interface ${$.typeName} extends ${needsNewtype(schema) ? `newtype<${TYPE}>` : TYPE} {}`
    ].filter((_) => _ !== null).join('\n')
      : `type ${$.typeName} = ${TYPE}`
}

function parseOptions(options?: toType.Options): Partial<typeof optionsWithInterface>
function parseOptions(options: toType.Options = {}): Partial<typeof optionsWithInterface> {
  return {
    typeName: options?.typeName,
    ...'preferInterface' in options && { preferInterface: options.preferInterface },
    ...'includeNewtypeDeclaration' in options && { includeNewtypeDeclaration: options.includeNewtypeDeclaration },
  }
}

export declare namespace toType {
  export type { Options }
}

declare const optionsWithInterface: {
  typeName: typeof optionsWithOptionalTypeName['typeName'] & {}
  /**
   * ## {@link optionsWithInterface.preferInterface `toType.Options.preferInterface`}
   * 
   * Use the `preferInterface` option to tell the compiler that you'd prefer the generated
   * type to be an interface, if possible.
   * 
   * **Note:** This option has no effect unless you give you name a type via
   * {@link options.typeName `toType.Options.typeName`}.
   *
   * @example
   * console.log(box.toType(T.Object({ a: T.Number() }), { typeName: 'MyType' })) 
   * // => type MyType = { a: number }
   * 
   * console.log(box.toType(T.Object({ a: T.Number() }), { typeName: 'MyType', preferInterface: true }))
   * // => interface MyType { a: number }
   */
  preferInterface: boolean
  /**
   * ## {@link optionsWithInterface.includeNewtypeDeclaration `toType.Options.includeNewtypeDeclaration`}
   * 
   * Default: true
   */
  includeNewtypeDeclaration?: boolean
}

declare const optionsWithOptionalTypeName: {
  /**
   * ## {@link options.typeName `toType.Options.typeName`}
   * 
   * Use `Options.typeName` to give you type a name. If no type name
   * is provided, the returned type will be anonymous.
   * 
   * @example
   * console.log(box.toType(T.Number()))                         // => number
   * console.log(box.toType(T.Number(), { typeName: 'MyType' })) // => type MyType = number
   */
  typeName?: string
}

declare const options:
  | typeof optionsWithInterface
  | typeof optionsWithOptionalTypeName

export type Options = typeof options

