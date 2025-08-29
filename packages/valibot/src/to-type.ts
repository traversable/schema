import * as v from 'valibot'
import { Array_isArray, escape, escapeJsDoc, has, parseKey } from '@traversable/registry'
import { hasType, tagged, F, isOptionalDeep, Invariant } from '@traversable/valibot-types'

export type WithOptionalTypeName = {
  /**
   * ## {@link WithOptionalTypeName `toType.Options.typeName`}
   * 
   * Use `Options.typeName` to give you type a name. If no type name
   * is provided, the returned type will be anonymous.
   * 
   * @example
   * console.log(vx.toType(v.number()))                         // => number
   * console.log(vx.toType(v.number(), { typeName: 'MyType' })) // => type MyType = number
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
   * console.log(vx.toType(v.number()))                         // => number
   * console.log(vx.toType(v.number(), { typeName: 'MyType' })) // => type MyType = number
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
   * console.log(vx.toType(v.object({ a: v.number() }), { typeName: 'MyType' })) 
   * // => type MyType = { a: number }
   * 
   * console.log(vx.toType(v.number(), { typeName: 'MyType', preferInterface: true }))
   * // => interface MyType { a: number }
   * 
   * console.log(vx.toType(v.number(), { typeName: 'MyType', preferInterface: true }))
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
] as const satisfies any[]

type UnsupportedSchema = F.V.Catalog[typeof unsupported[number]]

function isUnsupported(x: unknown): x is UnsupportedSchema {
  return hasType(x) && unsupported.includes(x.type as never)
}

function canBeInterface(x: unknown): boolean {
  return tagged('object', x)
    || tagged('objectWithRest', x)
    || tagged('looseObject', x)
    || tagged('strictObject', x)
    || tagged('array', x)
    || tagged('record', x)
    || tagged('tuple', x)
    || tagged('looseTuple', x)
    || tagged('strictTuple', x)
    || tagged('tupleWithRest', x)
    || tagged('intersect', x)
    || tagged('set', x)
    || tagged('map', x)
}

function needsNewtype(x: unknown): boolean {
  return tagged('object', x)
    || tagged('objectWithRest', x)
    || tagged('looseObject', x)
    || tagged('strictObject', x)
    || tagged('record', x)
    || tagged('tuple', x)
    || tagged('looseTuple', x)
    || tagged('strictTuple', x)
    || tagged('tupleWithRest', x)
    || tagged('intersect', x)
}

function preserveJsDocsEnabled(ix: F.Functor.Index) {
  return 'preserveJsDocs' in ix && ix.preserveJsDocs === true
}

function stringifyLiteral(value: unknown) {
  return typeof value === 'string' ? `"${escape(value)}"` : typeof value === 'bigint' ? `${value}n` : `${value}`
}

function getDescription<T>(x: F.V.Hole<T>): string | null {
  if (!has('pipe', Array_isArray)(x)) return null
  else {
    const description = x.pipe.find(has('description', (_) => typeof _ === 'string'))
    return description?.description ?? null
  }
}

function isReadonly(x: F.AnyValibotSchema): boolean {
  if (!has('pipe', Array_isArray)(x)) return false
  else return x.pipe.some(has('type', (_) => _ === 'readonly'))
}

const fold = F.fold<string>((x, ix, input) => {
  switch (true) {
    default: return x satisfies never
    case tagged('never')(x): return 'never'
    case tagged('any')(x): return 'any'
    case tagged('unknown')(x): return 'unknown'
    case tagged('void')(x): return 'void'
    case tagged('undefined')(x): return 'undefined'
    case tagged('null')(x): return 'null'
    case tagged('symbol')(x): return 'symbol'
    case tagged('NaN')(x): return 'number'
    case tagged('boolean')(x): return 'boolean'
    case tagged('bigint')(x): return 'bigint'
    case tagged('number')(x): return 'number'
    case tagged('string')(x): return 'string'
    case tagged('date')(x): return 'Date'
    case tagged('file')(x): return 'File'
    case tagged('blob')(x): return 'Blob'
    case tagged('instance')(x): return x.class.name
    case tagged('function')(x): return '(...args: unknown[]) => unknown'
    case tagged('set')(x): return `Set<${x.value}>`
    case tagged('map')(x): return `Map<${x.key}, ${x.value}>`
    case tagged('literal')(x): return stringifyLiteral(x.literal)
    case tagged('array')(x): return isReadonly(input) ? `ReadonlyArray<${x.item}>` : `Array<${x.item}>`
    case tagged('record')(x): return `Record<${x.key}, ${x.value}>`
    case tagged('intersect')(x):
      return x.options.length === 0 ? 'unknown'
        : x.options.length === 1 ? x.options[0]
          : `(${x.options.join(' & ')})`
    case tagged('variant')(x): {
      if (!tagged('variant', input)) {
        return Invariant.IllegalState('toType', 'expected input to be a variant schema', input)
      }
      else if (x.options.length === 0) return 'never'
      else {
        const xs = x.options.map((option, i) => {
          const original = input.options[i]
          const READONLY_OPEN = isReadonly(original) ? 'Readonly<' : ''
          const READONLY_CLOSE = isReadonly(original) ? '>' : ''
          const REST = 'rest' in option && typeof option.rest === 'string' ? `{ [x: string]: ${option.rest} }` : ''
          const OPT = Object.entries(original.entries).filter(([, v]) => isOptionalDeep(v)).map(([k]) => k)
          const xs = Object.entries(option.entries).map(
            ([k, v]) => {
              const description = getDescription(original[k])
              const READONLY = isReadonly(original.entries[k]) ? 'readonly ' : ''
              const JSDOCS = description == null || !preserveJsDocsEnabled(ix) ? null : [
                '\n/**',
                ` * ${escapeJsDoc(description)}`,
                ' */',
              ].filter((_) => _ !== null)
              return [
                JSDOCS === null ? null : JSDOCS.join('\n'),
                READONLY + parseKey(k) + (OPT.includes(k) ? '?: ' : ': ') + v,
              ].filter((_) => _ !== null).join('\n')
            }
          )
          return xs.length === 0
            ? `${READONLY_OPEN}{}${READONLY_CLOSE}`
            : `${READONLY_OPEN}{ ${xs.join(', ')} }${READONLY_CLOSE}${REST}`
        })
        return xs.length === 0 ? 'never' : xs.length === 1 ? xs[0] : `(${xs.join(' | ')})`
      }
    }
    case tagged('union')(x): return x.options.length === 0 ? 'never' : x.options.length === 1 ? x.options[0] : `(${x.options.join(' | ')})`
    case tagged('lazy')(x): return x.getter()
    case tagged('undefinedable')(x): return `undefined | ${x.wrapped}`
    case tagged('nullable')(x): return `null | ${x.wrapped}`
    case tagged('nonNullable')(x): return `Exclude<${x.wrapped}, null>`
    case tagged('nullish')(x): return `null | undefined | ${x.wrapped}`
    case tagged('nonNullish')(x): return `NonNullable<${x.wrapped}>`
    case tagged('nonOptional')(x): return `Exclude<${x.wrapped}, undefined>`
    case tagged('exactOptional')(x):
    case tagged('optional')(x): {
      if (!tagged(x.type as 'optional', input)) {
        return Invariant.IllegalState('toType', 'expected input to be an optional schema', input)
      } else if (tagged('optional', input.wrapped) || tagged('exactOptional', input.wrapped)) {
        return x.wrapped
      } else {
        return (ix as typeof ix & { isProperty: boolean }).isProperty ? x.wrapped : `undefined | ${x.wrapped}`
      }
    }
    case tagged('picklist')(x):
    case tagged('enum')(x): {
      const members = x.options.map(stringifyLiteral)
      return members.length === 0 ? 'never' : members.length === 1 ? members[0] : `(${members.join(' | ')})`
    }
    case tagged('looseObject')(x):
    case tagged('strictObject')(x):
    case tagged('object')(x): {
      if (!tagged(x.type as 'object', input)) {
        return Invariant.IllegalState('toType', `Expected input to be a${x.type === 'object' ? 'n' : ''} ${x.type} schema`, input)
      } else {
        const OPT = Object.entries(input.entries).filter(([, v]) => isOptionalDeep(v)).map(([k]) => k)
        const READONLY_OPEN = isReadonly(input) ? 'Readonly<' : ''
        const READONLY_CLOSE = isReadonly(input) ? '>' : ''
        const xs = Object.entries(x.entries).map(
          ([k, v]) => {
            const description = getDescription(input.entries[k])
            const READONLY = isReadonly(input.entries[k]) ? 'readonly ' : ''
            const JSDOCS = description == null || !preserveJsDocsEnabled(ix) ? null : [
              '\n/**',
              ` * ${escapeJsDoc(description)}`,
              ' */',
            ].filter((_) => _ !== null)
            return [
              JSDOCS === null ? null : JSDOCS.join('\n'),
              READONLY + parseKey(k) + (OPT.includes(k) ? '?: ' : ': ') + v,
            ].filter((_) => _ !== null).join('\n')
          }
        )
        return xs.length === 0
          ? `${READONLY_OPEN}{}${READONLY_CLOSE}`
          : `${READONLY_OPEN}{ ${xs.join(', ')} }${READONLY_CLOSE}`
      }
    }
    case tagged('objectWithRest')(x): {
      if (!tagged('objectWithRest', input)) {
        return Invariant.IllegalState('toType', 'Expected input to be an object with rest schema', input)
      } else {
        const OPT = Object.entries(input.entries).filter(([, v]) => isOptionalDeep(v)).map(([k]) => k)
        const REST = ` & { [x: string]: ${x.rest} }`
        const READONLY_OPEN = isReadonly(input) ? 'Readonly<' : ''
        const READONLY_CLOSE = isReadonly(input) ? '>' : ''
        const xs = Object.entries(x.entries).map(
          ([k, v]) => {
            const description = getDescription(input.entries[k])
            const READONLY = isReadonly(input.entries[k]) ? 'readonly ' : ''
            const JSDOCS = description == null || !preserveJsDocsEnabled(ix) ? null : [
              '\n/**',
              ` * ${escapeJsDoc(description)}`,
              ' */',
            ].filter((_) => _ !== null)
            return [
              JSDOCS === null ? null : JSDOCS.join('\n'),
              READONLY + parseKey(k) + (OPT.includes(k) ? '?: ' : ': ') + v,
            ].filter((_) => _ !== null).join('\n')
          }
        )
        return xs.length === 0
          ? `${READONLY_OPEN}{}${READONLY_CLOSE}`
          : `${READONLY_OPEN}{ ${xs.join(', ')} }${REST}${READONLY_CLOSE}`
      }
    }
    case tagged('looseTuple')(x):
    case tagged('strictTuple')(x):
    case tagged('tuple')(x): {
      if (!tagged(x.type as 'tuple', input)) {
        return Invariant.IllegalState('toType', `Expected input to be a ${x.type} schema`, input)
      } else {
        const READONLY = isReadonly(input) ? 'readonly ' : ''
        return `${READONLY}[${x.items.join(', ')}]`
      }
    }
    case tagged('tupleWithRest')(x): {
      if (!tagged('tupleWithRest', input)) {
        return Invariant.IllegalState('toType', 'Expected input to be a tupleWithRest schema', input)
      } else {
        const READONLY = isReadonly(input) ? 'readonly ' : ''
        const REST = `${x.items.length > 0 ? ', ' : ''}...${x.rest}[]`
        return `${READONLY}[${x.items.join(', ')}${REST}]`
      }
    }
    case isUnsupported(x): return import('@traversable/valibot-types').then(({ Invariant }) => Invariant.Unimplemented(x.type, 'toType')) as never
  }
})

export declare namespace toType {
  export type { Options }
  /**
   * ## {@link unsupported `toType.Unsupported`} 
   * 
   * These are the schema types that {@link toType `vx.toType`} does not
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
 * ## {@link toType `vx.toType`}
 *
 * Converts an arbitrary valibot schema into a string representing its underlying TypeScript type.
 *
 * @example
 * import * as vi from "vitest"
 * import * as v from 'valibot'
 * import { vx } from "@traversable/valibot"
 *
 * vi.expect(vx.toType(
 *   v.record(v.picklist(['a', 'b', 'c']), v.set(v.string()))
 * )).toMatchInlineSnapshot
 *   (`"Record<"a" | "b" | "c", Set<string>>"`)
 * 
 * vi.expect(vx.toType(
 *   v.objectWithRest({ a: v.optional(v.string()), b: v.number() }, v.boolean())
 * )).toMatchInlineSnapshot
 *   (`"{ a?: string, b: number } & { [x: string]: boolean }"`)
 * 
 * vi.expect(vx.toType(
 *   v.tupleWithRest([v.number()], v.boolean())
 * )).toMatchInlineSnapshot
 *   (`"[number, ...boolean[]]"`)
 * 
 * // Use the `typeName` option to give you type a name:
 * vi.expect(vx.toType(
 *   v.object({ a: v.optional(v.number()) }),
 *   { typeName: 'MyType' }
 * )).toMatchInlineSnapshot
 *   (`"type MyType = { a?: number }"`)
 */

export function toType(type: v.BaseSchema<any, any, any>, options?: toType.Options): string
export function toType<T>(type: F.V.Hole<T>, options?: toType.Options): string
export function toType(type: v.BaseSchema<any, any, any> | F.V.Hole<any>, options?: toType.Options): string {
  const $ = parseOptions(options)
  let TYPE = fold(type as never, { ...F.defaultIndex, ...$ } as never)
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
