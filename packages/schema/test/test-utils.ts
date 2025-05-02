import { fc } from '@fast-check/vitest'

import { t } from '@traversable/schema'
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

export function SchemaGenerator(options?: SchemaGenerator.Options): fc.Arbitrary<t.Schema>
export function SchemaGenerator({
  exclude = defaults.exclude,
  jsonArbitrary = defaults.jsonArbitrary,
  minDepth = defaults.minDepth,
}: SchemaGenerator.Options = defaults) {
  return Seed.schemaWithMinDepth(
    { exclude, eq: { jsonArbitrary } },
    minDepth,
  ) satisfies fc.Arbitrary<t.Schema>
}

export declare namespace SchemaGenerator {
  type Options = {
    exclude?: t.TypeName[]
    jsonArbitrary?: fc.Arbitrary<JsonValue>
    minDepth?: number
  }
}

const exclude = [
  'never',
  'symbol',
  'any',
  'unknown',
  'intersect',
  'bigint',
] as const satisfies string[]

export const defaults = {
  exclude,
  jsonArbitrary: jsonValue.tree,
  minDepth: 3,
} satisfies Required<SchemaGenerator.Options>
