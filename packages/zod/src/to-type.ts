import { z } from 'zod'
import { escape, escapeJsDoc, parseKey } from '@traversable/registry'
import { hasTypeName, tagged, F, isOptionalDeep } from '@traversable/zod-types'
import { Json } from '@traversable/json'

export type WithOptionalTypeName = {
  /**
   * ## {@link WithOptionalTypeName `toType.Options.typeName`}
   * 
   * Use `Options.typeName` to give you type a name. If no type name
   * is provided, the returned type will be anonymous.
   * 
   * @example
   * console.log(zx.toType(z.number()))                         // => number
   * console.log(zx.toType(z.number(), { typeName: 'MyType' })) // => type MyType = number
   */
  typeName?: string
  /**
   * ## {@link WithOptionalTypeName `toType.Options.preserveJsDocs`}
   * 
   * Whether to include JSDoc annotations in the compiled type.
   * If `true`, object properties that have a defined `description`
   * property in their metadata will include the description above
   * the property name.
   * 
   * If the metadata includes an `example` property, the example will also
   * be included with an `@example` tag beneath the description.
   * 
   * @default false
   */
  preserveJsDocs?: boolean
}

export type WithInterface = {
  /**
   * ## {@link WithInterface `toType.Options.typeName`}
   * Use `Options.typeName` to give you type a name. If no type name
   * is provided, the returned type will be anonymous.
   * 
   * @example
   * console.log(zx.toType(z.number()))                         // => number
   * console.log(zx.toType(z.number(), { typeName: 'MyType' })) // => type MyType = number
   */
  typeName: NonNullable<WithOptionalTypeName['typeName']>
  /**
   * ## {@link WithInterface `toType.Options.preferInterface`}
   * 
   * Use the `preferInterface` option to tell the compiler that you'd prefer the generated
   * type to be an interface, if possible.
   * 
   * **Note:** This option has no effect unless you give you name a type via
   * {@link WithInterface `toType.Options.typeName`}.
   *
   * @example
   * console.log(zx.toType(z.object({ a: z.number() }), { typeName: 'MyType' })) 
   * // => type MyType = { a: number }
   * 
   * console.log(zx.toType(z.number(), { typeName: 'MyType', preferInterface: true }))
   * // => interface MyType { a: number }
   * 
   * console.log(zx.toType(z.number(), { typeName: 'MyType', preferInterface: true }))
   * // => interface MyType { a: number }
   */
  preferInterface: boolean
  /**
   * ## {@link WithInterface `toType.Options.includeNewtypeDeclaration`}
   * 
   * @default true
   */
  includeNewtypeDeclaration?: boolean
  /**
   * ## {@link WithInterface `toType.Options.preserveJsDocs`}
   * 
   * Whether to include JSDoc annotations in the compiled type.
   * If `true`, object properties that have a defined `description`
   * property in their metadata will include the description above
   * the property name.
   * 
   * If the metadata includes an `example` property, the example will also
   * be included with an `@example` tag beneath the description.
   * 
   * @default false
   */
  preserveJsDocs?: boolean
}

export type Options =
  | WithInterface
  | WithOptionalTypeName

const unsupported = [
  'custom',
  'promise',
  'transform',
] as const satisfies any[]

type UnsupportedSchema = F.Z.Catalog[typeof unsupported[number]]

function isUnsupported(x: unknown): x is UnsupportedSchema {
  return hasTypeName(x) && unsupported.includes(x._zod.def.type as never)
}

function canBeReadonly(x: unknown): boolean {
  return tagged('object', x)
    || tagged('tuple', x)
    || tagged('array', x)
    || tagged('record', x)
    || tagged('intersection', x)
    || (tagged('readonly', x) && canBeReadonly(x._zod.def.innerType))
    || (tagged('lazy', x) && canBeReadonly(x._zod.def.getter()))
    || (tagged('nullable', x) && canBeReadonly(x._zod.def.innerType))
    || (tagged('optional', x) && canBeReadonly(x._zod.def.innerType))
    || (tagged('union', x) && x._zod.def.options.every(canBeReadonly))
}

function canBeInterface(x: unknown): boolean {
  return tagged('object', x)
    || tagged('array', x)
    || tagged('record', x)
    || tagged('tuple', x)
    || tagged('intersection', x)
    || tagged('set', x)
    || tagged('map', x)
}

function needsNewtype(x: unknown): boolean {
  return tagged('object', x)
    || tagged('record', x)
    || tagged('tuple', x)
    || tagged('intersection', x)
}

function preserveJsDocsEnabled(ix: F.CompilerIndex) {
  return 'preserveJsDocs' in ix && ix.preserveJsDocs === true
}

function stringifyLiteral(value: unknown) {
  return typeof value === 'string' ? `"${escape(value)}"` : typeof value === 'bigint' ? `${value}n` : `${value}`
}

const stringifyExample = Json.fold<string>((x) => {
  switch (true) {
    default: return x satisfies never
    case x === undefined: return 'undefined'
    case typeof x === 'bigint': return `${x}n`
    case typeof x === 'string': return `"${escapeJsDoc(x)}"`
    case Json.isScalar(x): return String(x)
    case Json.isArray(x): return `[${x.join(', ')}]`
    case Json.isObject(x): {
      const xs = Object.entries(x).map(([k, v]) => `${parseKey(k)}: ${v}`)
      return xs.length === 0 ? '{}' : `{ ${xs.join(', ')} }`
    }
  }
})

const readonly = (x: F.Z.Readonly<string>, ix: F.CompilerIndex, input: z.ZodReadonly): string => {
  const { innerType } = input._zod.def
  if (tagged('file', innerType)) return `Readonly<File>`
  else if (tagged('unknown', innerType)) return `Readonly<unknown>`
  else if (tagged('set', innerType)) return `ReadonlySet<${compile(innerType._zod.def.valueType, ix)}>`
  else if (tagged('map', innerType)) return `ReadonlyMap<${compile(innerType._zod.def.keyType, ix)}, ${compile(innerType._zod.def.valueType, ix)}>`
  else if (canBeReadonly(innerType)) return `Readonly<${x._zod.def.innerType}>`
  else if (tagged('union', innerType)) {
    const readonlys = innerType._zod.def.options.filter((_) => canBeReadonly(_))
    const mutables = innerType._zod.def.options.filter((_) => !canBeReadonly(_))
    if (readonlys.length === 0) return x._zod.def.innerType
    else {
      return [
        ...readonlys.map((_) => `Readonly<${compile(_, ix)}>`),
        ...mutables.map((_) => compile(_, ix))
      ].join(' | ')
    }
  }
  else if (tagged('nullable', innerType) && canBeReadonly(innerType._zod.def.innerType)) return `Readonly<${x._zod.def.innerType}>`
  else if (tagged('nonoptional', innerType) && canBeReadonly(innerType._zod.def.innerType)) return `Readonly<${x._zod.def.innerType}>`
  else return x._zod.def.innerType
}

function templateLiteralParts(parts: unknown[]): string[][] {
  let out = [Array.of<string>()]
  let x = parts[0]
  for (let ix = 0, len = parts.length; ix < len; (void ix++, x = parts[ix])) {
    switch (true) {
      case x === undefined: out.forEach((xs) => xs.push('')); break
      case x === null: out.forEach((xs) => xs.push('null')); break
      case typeof x === 'string': out.forEach((xs) => xs.push(escape(String(x)))); break
      case tagged('null', x): out.forEach((xs) => xs.push('null')); break
      case tagged('undefined', x): out.forEach((xs) => xs.push('')); break
      case tagged('number', x): out.forEach((xs) => xs.push('${number}')); break
      case tagged('string', x): out.forEach((xs) => xs.push('${string}')); break
      case tagged('bigint', x): out.forEach((xs) => xs.push('${bigint}')); break
      case tagged('boolean', x): out = out.flatMap((xs) => [[...xs, 'true'], [...xs, 'false']]); break
      case tagged('literal', x): {
        const values = x._zod.def.values.map((_) => _ === undefined ? '' : escape(String(_)))
        out = out.flatMap((xs) => values.map((value) => [...xs, value]))
        break
      }
      default: out.forEach((xs) => xs.push(String(x))); break
    }
  }
  return out
}

function templateLiteral(x: F.Z.TemplateLiteral) {
  return templateLiteralParts(x._zod.def.parts).map((xs) => {
    let template = false
    let x: unknown
    for (let ix = 0, len = xs.length; ix < len; ix++) {
      x = xs[ix]
      if (x === '${string}' || x === '${bigint}' || x === '${number}') template = true
    }
    return template ? `\`${xs.join('')}\`` : `"${xs.join('')}"`
  }).join(' | ')
}

const compile = F.compile<string>((x, ix, input) => {
  switch (true) {
    default: return x satisfies never
    case tagged('never')(x): return 'never'
    case tagged('any')(x): return 'any'
    case tagged('unknown')(x): return 'unknown'
    case tagged('void')(x): return 'void'
    case tagged('undefined')(x): return 'undefined'
    case tagged('null')(x): return 'null'
    case tagged('symbol')(x): return 'symbol'
    case tagged('nan')(x): return 'number'
    case tagged('boolean')(x): return 'boolean'
    case tagged('bigint')(x): return 'bigint'
    case tagged('number')(x): return 'number'
    case tagged('string')(x): return 'string'
    case tagged('date')(x): return 'Date'
    case tagged('file')(x): return 'File'
    case tagged('set')(x): return `Set<${x._zod.def.valueType}>`
    case tagged('map')(x): return `Map<${x._zod.def.keyType}, ${x._zod.def.valueType}>`
    case tagged('readonly')(x): return readonly(x, ix, input as z.ZodReadonly)
    case tagged('nullable')(x): return `null | ${x._zod.def.innerType}`
    case tagged('literal')(x): return x._zod.def.values.length === 0 ? 'never' : x._zod.def.values.map(stringifyLiteral).join(' | ')
    case tagged('array')(x): return `Array<${x._zod.def.element}>`
    case tagged('record')(x): return `Record<${x._zod.def.keyType}, ${x._zod.def.valueType}>`
    case tagged('intersection')(x): return `${x._zod.def.left} & ${x._zod.def.right}`
    case tagged('union')(x): return x._zod.def.options.length === 0 ? 'never' : `(${x._zod.def.options.join(' | ')})`
    case tagged('lazy')(x): return x._zod.def.getter()
    case tagged('pipe')(x): return x._zod.def.out
    case tagged('default')(x): return x._zod.def.innerType
    case tagged('prefault')(x): return x._zod.def.innerType
    case tagged('catch')(x): return x._zod.def.innerType
    case tagged('nonoptional')(x): return `Exclude<${x._zod.def.innerType}, undefined>`
    case tagged('success')(x): return x._zod.def.innerType
    case tagged('template_literal')(x): return templateLiteral(x)
    case tagged('optional')(x): {
      if (tagged('optional', (input as z.core.$ZodOptional)._zod.def.innerType)) return x._zod.def.innerType
      else return ix.isProperty ? x._zod.def.innerType : `undefined | ${x._zod.def.innerType}`
    }
    case tagged('enum')(x): {
      const members = Object.values((input as z.ZodEnum)._zod.def.entries).map((v) => typeof v === 'string' ? `"${v}"` : `${v}`)
      return members.length === 0 ? 'never' : members.length === 1 ? members.join(' | ') : `(${members.join(' | ')})`
    }
    case tagged('object')(x): {
      if (!tagged('object', input)) throw Error('Expected input to be an object')
      const { catchall, shape } = x._zod.def
      const OPT = Object.entries((input as z.ZodObject)._zod.def.shape).filter(([, v]) => isOptionalDeep(v)).map(([k]) => k)
      const xs = Object.entries(shape).map(
        ([k, v]) => {
          const { description, example } = input._zod.def.shape[k].meta() || {}
          const EXAMPLE = example === undefined ? null : stringifyExample(example as Json<string>)
          const JSDOCS = description === undefined || !preserveJsDocsEnabled(ix) ? null : [
            '/**',
            ` * ${escapeJsDoc(description)}`,
            EXAMPLE === null ? null : ' *',
            EXAMPLE === null ? null : ` * @example ${EXAMPLE}`,
            ' */',
          ].filter((_) => _ !== null)

          return [
            JSDOCS === null ? null : JSDOCS.join('\n'),
            parseKey(k) + (OPT.includes(k) ? '?: ' : ': ') + v,
          ].filter((_) => _ !== null).join('\n')
        }
      )
      const and = typeof catchall === 'string' ? ` & { [x: string]: ${catchall} }` : ''
      return xs.length === 0 ? '{}' : `{ ${xs.join(', ')} }${and}`
    }
    case tagged('tuple')(x): {
      const { items, rest } = x._zod.def
      const and = typeof rest === 'string' ? `, ...${rest}[]` : ''
      const lastRequiredIndex = (input as z.ZodTuple)._zod.def.items.findLastIndex((x) => !isOptionalDeep(x))
      const req = lastRequiredIndex === -1 ? [] : items.slice(0, lastRequiredIndex + 1)
      const opt = lastRequiredIndex === -1 ? items : items.slice(lastRequiredIndex + 1)
      const body = [...req, ...opt.map((item) => `_?: ${item.startsWith('undefined | ') ? item.substring('undefined | '.length) : item}`)]
      return `[${body.join(', ')}${and}]`
    }
    case isUnsupported(x): return import('@traversable/zod-types').then(({ Invariant }) => Invariant.Unimplemented(x._zod.def.type, 'toType')) as never
  }
})

export declare namespace toType {
  export type { Options }
  /**
   * ## {@link unsupported `toType.Unsupported`} 
   * 
   * These are the schema types that {@link toType `zx.toType`} does not
   * support, either because they haven't been implemented yet, or because
   * we haven't found a reasonable interpretation of them in this context.
   * 
   * If you'd like to see one of these supported or have an idea for how
   * it could be done, we'd love to hear from you!
   * 
   * Here's the link to [raise an issue](https://github.com/traversable/schema/issues).
   */
  export type Unsupported = typeof unsupported
}

/**
 * ## {@link toType `zod.toType`}
 *
 * Converts an arbitrary zod schema into a string representing its underlying TypeScript type.
 *
 * @example
 * import * as vi from "vitest"
 * import { z } from 'zod'
 * import { zx } from "@traversable/zod"
 *
 * vi.expect(zx.toType(
 *   z.record(z.enum(['a', 'b', 'c']), z.set(z.string()))
 * )).toMatchInlineSnapshot
 *   (`"Record<"a" | "b" | "c", Set<string>>"`)
 * 
 * vi.expect(zx.toType(
 *   z.object({ a: z.optional(z.string()), b: z.number() }).catchall(z.boolean())
 * )).toMatchInlineSnapshot
 *   (`"{ a?: string, b: number } & { [x: string]: boolean }"`)
 * 
 * vi.expect(zx.toType(
 *   z.tuple([z.number()]).rest(z.boolean())
 * )).toMatchInlineSnapshot
 *   (`"[number, ...boolean[]]"`)
 * 
 * // Use the `typeName` option to give you type a name:
 * vi.expect(zx.toType(
 *   z.object({ a: z.optional(z.number()) }),
 *   { typeName: 'MyType' }
 * )).toMatchInlineSnapshot
 *   (`"type MyType = { a?: number }"`)
 */

export function toType(type: z.core.$ZodType, options?: toType.Options): string
export function toType<T>(type: F.Z.Hole<T>, options?: toType.Options): string
export function toType(type: z.ZodType | z.core.$ZodType | F.Z.Hole<any>, options?: toType.Options): string {
  const $ = parseOptions(options)
  let TYPE = compile(type as never, { ...F.defaultIndex, ...$ } as never)
  if (TYPE.startsWith('(') && TYPE.endsWith(')')) TYPE = TYPE.slice(1, -1)
  const NEWTYPE = !$.includeNewtypeDeclaration ? null : [
    `// @ts-expect-error: newtype hack`,
    `interface newtype<T extends {}> extends T {}`,
  ].join('\n')
  return $.typeName === undefined ? TYPE
    : $.preferInterface && canBeInterface(type) ? [
      needsNewtype(type) ? NEWTYPE : null,
      `interface ${$.typeName} extends ${needsNewtype(type) ? `newtype<${TYPE}>` : TYPE} {}`
    ].filter((_) => _ !== null).join('\n')
      : `type ${$.typeName} = ${TYPE}`
}

toType.unsupported = unsupported

function parseOptions(options?: toType.Options): Partial<WithInterface>
function parseOptions($: toType.Options = {}): Partial<WithInterface> {
  return {
    typeName: $?.typeName,
    ...'includeNewtypeDeclaration' in $ && { includeNewtypeDeclaration: $.includeNewtypeDeclaration },
    ...'preferInterface' in $ && { preferInterface: $.preferInterface },
    ...'preserveJsDocs' in $ && { preserveJsDocs: $.preserveJsDocs },
  }
}
