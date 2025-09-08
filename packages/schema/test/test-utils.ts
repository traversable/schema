import * as fc from 'fast-check'
import * as fs from 'node:fs'
import * as path from 'node:path'

import { t } from '@traversable/schema'
import type * as T from '@traversable/registry'
import { findPaths, fn, Object_entries, omitWhereKeys, parseKey } from '@traversable/registry'
import { Json } from '@traversable/json'

import * as Seed from './seed.js'

export const PATTERN = {
  alphanumeric: '^[a-zA-Z0-9]*$',
  ident: '^[$_a-zA-Z][$_a-zA-Z0-9]*$',
  exponential: 'e[-|+]?',
} as const satisfies Record<string, string>

export const REG_EXP = {
  alphanumeric: new RegExp(PATTERN.alphanumeric, 'u'),
  ident: new RegExp(PATTERN.ident, 'u'),
  exponential: new RegExp(PATTERN.exponential, 'u'),
} satisfies Record<string, RegExp>

export const LEAST_UPPER_BOUND = 0x100000000
export const GREATEST_LOWER_BOUND = 1e-8
export const floatConstraints = { noDefaultInfinity: true, min: -LEAST_UPPER_BOUND, max: +LEAST_UPPER_BOUND } satisfies fc.FloatConstraints

export const hasMessage = t.has('message', t.string)
export const getErrorMessage = (e: unknown) => hasMessage(e) ? e.message : JSON.stringify(e, null, 2)

export const invalidDataToPaths = (data: unknown) => findPaths(data, (x) => x === Seed.invalidValue).map((path) => path.map(String))

export const getExponential = (x: number) => Number.parseInt(String(x).split(REG_EXP.exponential)[1])

export const isBounded = (x: number) => x <= -GREATEST_LOWER_BOUND || +GREATEST_LOWER_BOUND <= x

export const toFixed = (x: number) => {
  const exponential = getExponential(x)
  return Number.isNaN(x) ? x : x.toFixed(exponential) as never
}

const ident = fc.stringMatching(REG_EXP.ident)

type Key = string | number

const pathInto = fc.array(
  fc.oneof(fc.integer(), ident),
  { maxLength: 5 }
) as fc.Arbitrary<
  | [Key, Key, Key, Key, Key]
  | [Key, Key, Key, Key]
  | [Key, Key, Key]
  | [Key, Key]
  | [Key]
  | []
>

export const needle = Symbol.for('@traversable/schema::needle')
export const alphanumeric = fc.stringMatching(REG_EXP.alphanumeric)
export const int32toFixed = fc.float(floatConstraints).filter(isBounded).map(toFixed)

interface Tree { [x: string | number]: TreeWithNeedle }
type TreeWithNeedle = typeof needle | Tree

export function needleInAHaystack() {
  const treeConstraints = { maxDepth: 5, depthSize: globalThis.Number.POSITIVE_INFINITY }
  return fc.tuple(
    pathInto,
    fc.dictionary(ident, fc.jsonValue(treeConstraints)),
    fc.dictionary(ident, fc.jsonValue(treeConstraints)),
    fc.dictionary(ident, fc.jsonValue(treeConstraints)),
    fc.dictionary(ident, fc.jsonValue(treeConstraints)),
    fc.dictionary(ident, fc.jsonValue(treeConstraints)),
  ).map(
    ([path, $1, $2, $3, $4, $5]) => {
      const [k1, k2, k3, k4, k5] = path
      let out: unknown = needle
      k5 !== undefined && void (out = { ...$5, [k5]: out })
      k4 !== undefined && void (out = { ...$4, [k4]: out })
      k3 !== undefined && void (out = { ...$3, [k3]: out })
      k2 !== undefined && void (out = { ...$2, [k2]: out })
      k1 !== undefined && void (out = { ...$1, [k1]: out })
      return [
        out as Tree,
        path,
      ] as const
    }
  )
}

type JsonValue =
  | undefined
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | { [x: string]: JsonValue }

interface JsonBuilder {
  null: null
  boolean: boolean
  number: number
  string: string
  array: JsonValue[]
  object: Record<string, JsonValue>
  tree: JsonValue
}

function jsonValueBuilder(go: fc.LetrecTypedTie<JsonBuilder>) {
  return {
    null: fc.constant(null),
    boolean: fc.boolean(),
    number: int32toFixed,
    string: alphanumeric,
    array: fc.array(go('tree')),
    object: fc.dictionary(ident, go('tree')),
    tree: fc.oneof(
      go('null'),
      go('boolean'),
      go('number'),
      go('string'),
      go('array'),
      go('object'),
    ),
  }
}

export const jsonValue = fc.letrec<JsonBuilder>(jsonValueBuilder)

export const arbitrary = {
  alphanumeric,
  ident,
  int32toFixed,
  needleInAHaystack,
  jsonValue: jsonValue.tree,
}

export type DefaultSchemas = never | Exclude<
  t.F<t.Schema>,
  { tag: `${T.NS}${typeof defaults.exclude[number]}` }
>

export type Options<TypeName extends t.TypeName = typeof exclude[number]> = {
  exclude?: [TypeName] extends [never] ? [] : TypeName[]
  jsonArbitrary?: fc.Arbitrary<JsonValue>
  minDepth?: number
}

type ExcludeBy<TypeName extends t.TypeName> = Exclude<t.F<t.Schema>, { tag: `${T.NS}${TypeName}` }>

export declare namespace SchemaGenerator { export { Options } }

export function SchemaGenerator(): fc.Arbitrary<DefaultSchemas>
export function SchemaGenerator<TypeName extends Exclude<t.TypeName, 'ref'>>(options?: Options<TypeName>): fc.Arbitrary<ExcludeBy<TypeName>>
export function SchemaGenerator({
  exclude = defaults.exclude,
  jsonArbitrary = defaults.jsonArbitrary,
  minDepth = defaults.minDepth,
}: Options = defaults): unknown {
  return Seed.schemaWithMinDepth(
    { exclude, eq: { jsonArbitrary } },
    minDepth,
  ) satisfies fc.Arbitrary<t.Schema>
}

export const exclude = [
  'any',
  'bigint',
  'intersect',
  'never',
  'symbol',
  'undefined',
  'unknown',
  'void',
] as const satisfies string[]

export const defaults = {
  exclude,
  jsonArbitrary: jsonValue.tree,
  minDepth: 3,
} satisfies Required<Options>

export type LogFailureDeps<T extends {} = {}> = { [K in keyof T]: () => T[K] } & {
  t: t.Schema
  validData: unknown
  invalidData: unknown
}

export function createLogger<Table extends { [x: string]: unknown }>(fileName: string, createTable: () => Table) {
  const _table = createTable()
  return {
    logFailure(logHeader?: string) {
      console.group(`\r\n\n\n[schema/test/${fileName}.test.ts]\nFAILURE (general case)${typeof logHeader === 'string' ? `: ${logHeader}` : ''}`)
      console.table(_table)
      console.groupEnd()
    },
    logFailureWithValidData(logHeader?: string) {
      const table = omitWhereKeys(_table, (k) => !String(k).includes('invalidData'))
      console.group(`\r\n\n\n[schema/test/${fileName}.test.ts]\nFAILURE (valid data case)${typeof logHeader === 'string' ? `: ${logHeader}` : ''}`)
      console.table(table)
      console.groupEnd()
    },
    logFailureWithInvalidData(logHeader?: string) {
      const table = omitWhereKeys(_table, (k) => !String(k).includes('validData'))
      console.group(`\r\n\n\n[schema/test/${fileName}.test.ts]\nFAILURE (invalid data case)${typeof logHeader === 'string' ? `: ${logHeader}` : ''}`)
      console.table(table)
      console.groupEnd()
    }
  }
}

export const toStringDefaults = {
  initialOffset: 0,
  format: true,
  maxWidth: 99,
} satisfies Required<toString.Options>

declare namespace toString {
  type Options = {
    initialOffset?: number
    format?: boolean
    maxWidth?: number
  }
}

// const makeFunctor
//   : (onExhaustiveFailure: (x: never) => never) => T.Functor.Ix<Json.Functor.Index, Json.Free, Json.Fixpoint>
//   = (onExhaustiveFailure) => ({
//     ...Json.Functor,
//     mapWithIndex<S, T>(f: (s: S, ix: Json.Functor.Index) => T): (x: Json.Unary<S>, ix: Json.Functor.Index) => Json.Unary<T> {
//       let root: Json.Unary<S>
//       return (x, { depth, path }) => {
//         switch (true) {
//           default: return onExhaustiveFailure(x)
//           case x === null:
//           case x === undefined:
//           case x === true:
//           case x === false:
//           case typeof x === 'number':
//           case typeof x === 'string': return x
//           case Json.isArray(x): return fn.map(x, (s, i) => f(s, { path: [...path, i], depth: depth + 1 }))
//           case Json.isObject(x): return fn.map(x, (s, k) => f(s, { path: [...path, k], depth: depth + 1 }))
//         }
//       }
//     }
//   })

const onExhaustiveFailure = (x: never): never => JSON.stringify(
  x,
  (_k, v) => typeof v === 'bigint' ? `${v}n` : typeof v === 'symbol' ? String(v) : v,
  2,
) as never

// const Functor = makeFunctor(onExhaustiveFailure)

// const fold = fn.cataIx(Functor)

export function toString<T>(json: Json<T>, options?: toString.Options): string
export function toString(json: unknown, options?: toString.Options): string
export function toString(
  json: unknown, {
    format: FORMAT = toStringDefaults.format,
    initialOffset: OFF = toStringDefaults.initialOffset,
    maxWidth: MAX_WIDTH = toStringDefaults.maxWidth,
  }: toString.Options = toStringDefaults
) {
  return Json.foldWithIndex<string>((x, { depth }) => {
    const OFFSET = OFF + depth * 2
    const JOIN = `,\n` + ' '.repeat(OFFSET + 2)
    switch (true) {
      default: return String(x satisfies never)
      case x == null:
      case x === true:
      case x === false:
      case typeof x === 'number': return String(x)
      case typeof x === 'string': return `"${escape(x)}"`
      case Json.isArray(x): {
        const SINGLE_LINE = `[${x.join(', ')}]`
        if (!FORMAT) return SINGLE_LINE
        else {
          const WIDTH = OFFSET + SINGLE_LINE.length
          const IS_MULTI_LINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
          return !IS_MULTI_LINE
            ? SINGLE_LINE
            : '['
            + '\n'
            + ' '.repeat(OFFSET + 2)
            + x.join(JOIN)
            + '\n'
            + ' '.repeat(OFFSET + 0)
            + ']'
        }
      }
      case Json.isObject(x): {
        const BODY = Object_entries(x).map(([k, v]) => `${parseKey(k)}: ${v}`)
        if (BODY.length === 0) return '{}'
        else {
          const SINGLE_LINE = `{ ${BODY.join(', ')} }`
          if (!FORMAT) return SINGLE_LINE
          else {
            const WIDTH = OFFSET + SINGLE_LINE.length
            const IS_MULTILINE = WIDTH > MAX_WIDTH || SINGLE_LINE.includes('\n')
            return !IS_MULTILINE
              ? SINGLE_LINE
              : '{'
              + '\n'
              + '  '.repeat(OFFSET + 2)
              + BODY.join(JOIN)
              + '\n'
              + '  '.repeat(OFFSET + 0)
              + '}'
          }
        }
      }
    }
  })(json as never, { depth: 0, path: [] })
}

const getIndexFromFileName = (fileName: string) => {
  const withoutExt = fileName.endsWith('.test.ts') ? fileName.slice(0, -'.test.ts'.length) : fileName
  const pattern = /(\d+)$/
  const index = Number.parseInt((withoutExt.match(pattern) ?? '0')[0])
  return Number.isNaN(index) ? 0 : index + 1
}

const testTitleToFileName
  : (testTitle: writeFailure.Options['title']) => string
  = (testTitle) => testTitle.replaceAll(/\./, '_')

const createFileName = ($: writeFailure.Options) => {
  const FILENAME = testTitleToFileName($.title)
  const SUFFIX = '.test.ts'
  const TODAY = new Date().toISOString().slice(0, 10)
  let PREFIX = `${FILENAME}__${TODAY}`
  const index = fs
    .readdirSync($.targetDir)
    .filter((fileName) => fileName.startsWith(PREFIX))
    .reduce((acc, fileName) => Math.max(acc, getIndexFromFileName(fileName)), 0)
  return `${PREFIX}--${index}${SUFFIX}`
}

export function writeFailure($: writeFailure.Options): void {
  const fileName = createFileName($)
  const imports = [
    `import * as vi from 'vitest'`,
    `import { type as arktype } from 'arktype'`
  ].filter((_) => _ !== null).join('\n')
  const body = [
    `vi.test('〖⛳️〗‹ ❲${$.title}❳${($.subtitle ?? '').length > 0 ? `: ${$.subtitle}` : ''}', () => {`,
    // $.testOptions ? ('  '.repeat(2) + JSON.stringify($.testOptions) + ',') : null,
    // ' '.repeat(2) + `() => {`,
    ' '.repeat(2) + $.body.join('\n' + ' '.repeat(2)),
    // `vi.assert.notInstanceOf(${Ark.stringFromTraversable($.schema)}(${JSON.stringify($.input)}), arktype.errors)`,
    `})`,
  ].filter((_) => _ !== null).join('\n')
  const content = imports + '\n\n' + body + '\n'
  const target = path.join($.targetDir, fileName)
  void (fs.writeFileSync(target, content))
}

export declare namespace writeFailure {
  export type Options = {
    schema: t.Schema
    title: string
    subtitle?: string
    body: string[]
    targetDir: string
  }
}
