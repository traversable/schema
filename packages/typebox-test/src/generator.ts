import * as T from '@sinclair/typebox'
import * as fc from 'fast-check'

import type { newtype, inline } from '@traversable/registry'
import {
  Array_isArray,
  fn,
  isKeyOf,
  isObject,
  getRandomElementOf,
  mutateRandomElementOf,
  mutateRandomValueOf,
  Number_isFinite,
  Number_isNatural,
  Number_isSafeInteger,
  Object_assign,
  Object_entries,
  Object_fromEntries,
  Object_keys,
  Object_values,
  omit,
  pair,
  PATTERN,
  pick,
  symbol,
  Object_create,
} from '@traversable/registry'

type Config<T> = import('./generator-options.js').Config<T>
import * as Config from './generator-options.js'
import * as Bounds from './generator-bounds.js'
import type { Tag } from './generator-seed.js'
import { byTag, bySeed, Seed, fold } from './generator-seed.js'
import type { TypeName } from './typename.js'

const identifier = fc.stringMatching(new RegExp(PATTERN.identifier, 'u'))

function getDefaultValue(x: T.TSchema) {
  return x._zod.def.type === 'undefined' || x._zod.def.type === 'void' ? undefined : {}
}

const literalValue = fc.oneof(
  fc.string({ minLength: Bounds.defaults.string[0], maxLength: Bounds.defaults.string[1] }),
  fc.double({ min: Bounds.defaults.number[0], max: Bounds.defaults.number[1], noNaN: true }),
  fc.boolean(),
)

const TerminalMap = {
  any: fn.const(fc.tuple(fc.constant(byTag.any))),
  boolean: fn.const(fc.tuple(fc.constant(byTag.boolean))),
  date: fn.const(fc.tuple(fc.constant(byTag.date))),
  never: fn.const(fc.tuple(fc.constant(byTag.never))),
  null: fn.const(fc.tuple(fc.constant(byTag.null))),
  undefined: fn.const(fc.tuple(fc.constant(byTag.undefined))),
  unknown: fn.const(fc.tuple(fc.constant(byTag.unknown))),
  void: fn.const(fc.tuple(fc.constant(byTag.void))),
  symbol: fn.const(fc.tuple(fc.constant(byTag.symbol))),
} satisfies { [K in keyof Seed.TerminalMap]: SeedBuilder<K> }

const bigIntBounds = Bounds.bigint(fc.bigInt())
const integerBounds = Bounds.int(fc.integer())
const numberBounds = Bounds.number(fc.double())
const stringBounds = Bounds.string(fc.integer({ min: 0 }))

const BoundableMap = {
  bigint: fn.const(fc.tuple(fc.constant(byTag.bigint), bigIntBounds)),
  integer: fn.const(fc.tuple(fc.constant(byTag.integer), integerBounds)),
  number: fn.const(fc.tuple(fc.constant(byTag.number), numberBounds)),
  string: fn.const(fc.tuple(fc.constant(byTag.string), stringBounds)),
} satisfies { [K in keyof Seed.BoundableMap]: SeedBuilder<K> }

const ValueMap = {
  literal: fn.const(fc.tuple(fc.constant(byTag.literal), literalValue)),
} satisfies { [K in keyof Seed.ValueMap]: SeedBuilder<K> }

const UnaryMap = {
  array: (tie) => fc.tuple(fc.constant(byTag.array), tie('*'), Bounds.array(fc.integer({ min: 0 }))),
  optional: (tie) => fc.tuple(fc.constant(byTag.optional), tie('*')),
  record: (tie) => fc.tuple(fc.constant(byTag.record), tie('*')),
  object: (tie, $) => fc.tuple(
    fc.constant(byTag.object),
    fc.uniqueArray(fc.tuple(identifier, tie('*')), $)
  ),
  tuple: (tie, $) => fc.tuple(fc.constant(byTag.tuple), fc.array(tie('*'), $)),
  union: (tie, $) => fc.tuple(fc.constant(byTag.union), fc.array(tie('*'), $)),
  intersect: (tie) => entries(tie('*'), { minLength: 2 }).map(fn.flow(
    (xs) => pair(
      xs.slice(0, Math.ceil(xs.length / 2)),
      xs.slice(Math.ceil(xs.length / 2)),
    ),
    ([l, r]) => pair(
      pair(byTag.object, l),
      pair(byTag.object, r),
    ),
    (both) => pair(byTag.intersect, both),
  )),
} satisfies { [K in keyof Seed.UnaryMap<never>]: SeedBuilder<K> }

const TerminalSeeds = fn.map(Object_keys(TerminalMap), (tag) => byTag[tag])
const BoundableSeeds = fn.map(Object_keys(BoundableMap), (tag) => byTag[tag])

export interface SeedBuilder<K extends keyof Seed> {
  (tie: fc.LetrecTypedTie<SeedMap>, $: Config.byTypeName[K]): fc.Arbitrary<Seed[K]>
}

export interface SeedMap extends newtype<{ [K in keyof Seed]: SeedBuilder<K> }> {}
export const SeedMap = {
  ...TerminalMap,
  ...BoundableMap,
  ...ValueMap,
  ...UnaryMap,
} satisfies SeedMap

export function isTerminal(x: unknown): x is Seed.Terminal | Seed.Boundable
export function isTerminal(x: unknown) {
  if (!Array_isArray(x)) return false
  else {
    const tag = x[0] as never
    return TerminalSeeds.includes(tag) || BoundableSeeds.includes(tag)
  }
}

export const pickAndSortNodes
  : (nodes: readonly ([keyof SeedMap, unknown])[]) => <T>($: Config<T>) => (keyof SeedMap)[]
  = (nodes) => ({ include, exclude, sortBias } = Config.defaults as never) =>
    nodes
      .map(([k]) => k)
      .filter((x) =>
        (include ? include.includes(x as never) : true) &&
        (exclude ? !exclude.includes(x as never) : true)
      )
      .sort((l, r) => sortBias[l] < sortBias[r] ? -1 : sortBias[l] > sortBias[r] ? 1 : 0)

export const T_int
  : (bounds?: Bounds.int) => T.TInteger
  = (bounds = Bounds.defaults.int) => {
    const [min, max, multipleOf] = bounds
    let options: Parameters<typeof T.Integer>[0] = {}
    if (Number_isSafeInteger(min)) options.minimum = min
    if (Number_isSafeInteger(max)) options.maximum = max
    // if (Number_isSafeInteger(multipleOf)) options.multipleOf = multipleOf
    return T.Integer(options)
  }

export const T_bigint
  : (bounds?: Bounds.bigint) => T.TBigInt
  = (bounds = Bounds.defaults.bigint) => {
    const [min, max, multipleOf] = bounds
    let options: Parameters<typeof T.BigInt>[0] = {}
    if (typeof min === 'bigint') options.minimum = min
    if (typeof max === 'bigint') options.maximum = max
    // if (typeof multipleOf === 'bigint') params.multipleOf = multipleOf
    return T.BigInt(options)
  }

export const T_number
  : (bounds?: Bounds.number) => T.TNumber
  = (bounds = Bounds.defaults.number) => {
    const [min, max, multipleOf, minExcluded, maxExcluded] = bounds
    let options: Parameters<typeof T.Number>[0] = {}
    if (Number_isFinite(min)) {
      if (minExcluded) options.exclusiveMinimum = min
      else options.minimum = min
    }
    if (Number_isFinite(max)) {
      if (maxExcluded) options.exclusiveMaximum = max
      else options.maximum = max
    }
    return T.Number(options)
  }

export const T_string
  : (bounds?: Bounds.string) => T.TString
  = (bounds = Bounds.defaults.string) => {
    const [min, max, exactLength] = bounds
    let options: Parameters<typeof T.String>[0] = {}
    if (Number_isNatural(exactLength)) {
      options.minLength = exactLength
      options.maxLength = exactLength
      return T.String(options)
    } else {
      if (Number_isNatural(min)) options.minLength = min
      if (Number_isNatural(max)) options.maxLength = max
      return T.String(options)
    }
  }

export const T_array
  : <T extends T.TSchema>(items: T, bounds?: Bounds.array) => T.TArray<T>
  = (items, bounds = Bounds.defaults.array) => {
    const [min, max, exactLength] = bounds
    let schema = T.Array(items)
    if (Number_isNatural(exactLength)) {
      schema.maxItems = exactLength
      schema.minItems = exactLength
      return schema
    } else {
      if (Number_isNatural(min)) schema.minItems = min
      if (Number_isNatural(max)) schema.maxItems = max
      return schema
    }
  }

const branchNames = [
  'Array',
  'Object',
  'Record',
  'Tuple',
] as const satisfies TypeName[]

export interface Builder extends inline<{ [K in Tag]+?: fc.Arbitrary<unknown> }> {
  root?: fc.Arbitrary<unknown>
  invalid?: fc.Arbitrary<typeof symbol.invalid_value>
  ['*']: fc.Arbitrary<unknown>
}

export function Builder<T>(base: Gen.Base<T, Config.byTypeName>):
  <Options extends Config.Options<T>>(
    options?: Options,
    overrides?: Partial<Gen.Base<T, Config.byTypeName>>
  ) => (tie: fc.LetrecLooselyTypedTie) => Builder

export function Builder<T>(base: Gen.Base<T, Config.byTypeName>) {
  return <Options extends Config.Options<T>>(options?: Options, overrides?: Partial<Gen.Base<T, Config.byTypeName>>) => {
    const $ = Config.parseOptions(options)
    return (tie: fc.LetrecLooselyTypedTie) => {
      const builder: { [x: string]: fc.Arbitrary<unknown> } = fn.pipe(
        { ...base, ...overrides },
        (x) => pick(x, $.include),
        (x) => omit(x, $.exclude),
        (x) => fn.map(x, (f, k) => f(tie, $[k as never])),
      )
      const nodes = pickAndSortNodes(Object_entries(builder) as [k: keyof SeedMap, unknown][])($)
      builder['*'] = fc.oneof($['*'], ...nodes.map((k) => builder[k]))
      const root = isKeyOf(builder, $.root) && builder[$.root]
      let leaf = builder['*']

      if ($.minDepth > 0) {
        let branchName = getRandomElementOf(branchNames)
        do {
          if (branchName === 'Object') leaf = fc.tuple(fc.constant(byTag.object), entries(builder['*']))
          else if (branchName === 'Tuple') leaf = fc.tuple(fc.constant(byTag.tuple), fc.array(builder['*']))
        } while (--$.minDepth > 0)
      }

      return Object_assign(
        builder, {
        ...root && { root },
        ['*']: leaf
      })
    }
  }
}

export declare namespace Gen {
  type Base<T, $> = { [K in keyof T]: (tie: fc.LetrecLooselyTypedTie, constraints: $[K & keyof $]) => fc.Arbitrary<T[K]> }
  type Values<T, OmitKeys extends keyof any = never> = never | T[Exclude<keyof T, OmitKeys>]
  type InferArb<S> = S extends fc.Arbitrary<infer T> ? T : never
  interface Builder<T extends {}> extends newtype<T> { ['*']: fc.Arbitrary<InferArb<Values<this, '*' | 'root'>>> }
  type BuildBuilder<T, Options extends Config.Options<T>, Out extends {} = BuilderBase<T, Options>> = never | Builder<Out>
  type BuilderBase<T, Options extends Config.Options<T>, $ extends ParseOptions<T, Options> = ParseOptions<T, Options>> = never |
    & ([$['root']] extends [never] ? unknown : { root: fc.Arbitrary<$['root']> })
    & { [K in Exclude<$['include'], $['exclude']>]: fc.Arbitrary<T[K]> }
  type ParseOptions<T, Options extends Config.Options<T>> = never | {
    include: Options['include'] extends readonly unknown[] ? Options['include'][number] : keyof T
    exclude: Options['exclude'] extends readonly unknown[] ? Options['exclude'][number] : never
    root: Options['root'] extends keyof T ? T[Options['root']] : never
  }
}

/**
 * ## {@link Gen `Gen`}
 */
export function Gen<T>(base: Gen.Base<T, Config.byTypeName>):
  <Options extends Config.Options<T>>(
    options?: Options,
    overrides?: Partial<Gen.Base<T, Config.byTypeName>>
  ) => Gen.BuildBuilder<T, Options>

export function Gen<T>(base: Gen.Base<T, Config.byTypeName>) {
  return <Options extends Config.Options<T>>(
    options?: Options,
    overrides?: Partial<Gen.Base<T, Config.byTypeName>>
  ): Builder => {
    return fc.letrec(Builder(base)(options, overrides))
  }
}

const arbitrarySymbol = fc.oneof(fc.constant(Symbol()), fc.string().map((s) => Symbol.for(s)))

function entries<T>(model: fc.Arbitrary<T>, options?: fc.UniqueArrayConstraintsRecommended<[k: string, T], unknown>) {
  return fc.uniqueArray(
    fc.tuple(identifier, model),
    { selector: options?.selector || (([k]) => k), ...options },
  )
}

function intersect(x: unknown, y: unknown) {
  return !isObject(x) ? y : !isObject(y) ? x : Object_assign(x, y)
}

const GeneratorByTag = {
  any: () => fc.anything(),
  boolean: () => fc.boolean(),
  date: () => fc.date({ noInvalidDate: true }),
  never: () => fc.constant(void 0 as never),
  null: () => fc.constant(null),
  symbol: () => arbitrarySymbol,
  undefined: () => fc.constant(undefined),
  unknown: () => fc.anything(),
  void: () => fc.constant(void 0 as void),
  integer: (x) => fc.integer(Bounds.intBoundsToIntegerConstraints(x[1])),
  bigint: (x) => fc.bigInt(Bounds.bigintBoundsToBigIntConstraints(x[1])),
  number: (x) => fc.double(Bounds.numberBoundsToDoubleConstraints(x[1])),
  string: (x) => fc.string(Bounds.stringBoundsToStringConstraints(x[1])),
  literal: (x) => fc.constant(x[1]),
  array: (x) => fc.array(x[1], Bounds.arrayBoundsToArrayConstraints(x[2])),
  optional: (x, _$) => x[1],
  record: (x) => fc.dictionary(fc.string(), x[1]),
  tuple: (x) => fc.tuple(...x[1]),
  union: (x) => fc.oneof(...(x[1] || [fc.constant(void 0 as never)])),
  object: (x) => fc.record(Object.fromEntries(x[1])),
  intersect: (x) => fc.tuple(...x[1]).map((xs) => xs.reduce((x, y) => intersect(x, y), Object_create(null))),
} satisfies {
  [K in keyof Seed]: (x: Seed<fc.Arbitrary<unknown>>[K], $: Config<never>) => fc.Arbitrary<unknown>
}

/**
 * ## {@link seedToValidDataGenerator `seedToValidDataGenerator`}
 * 
 * Convert a seed into an valid data generator.
 * 
 * Valid in this context means that it will always satisfy the zod schema that the seed produces.
 * 
 * To use it, you'll need to have [fast-check](https://github.com/dubzzz/fast-check) installed.
 * 
 * To convert a seed to a zod schema, use {@link seedToSchema `seedToSchema`}.
 * 
 * To convert a seed to an _invalid_ data generator, use {@link seedToInvalidDataGenerator `seedToInvalidDataGenerator`}.
 */
export function seedToValidDataGenerator<T>(seed: Seed.F<T>, options?: Config.Options): fc.Arbitrary<unknown>
export function seedToValidDataGenerator<T>(seed: Seed.F<T>, options?: Config.Options): fc.Arbitrary<unknown> {
  const $ = Config.parseOptions(options)
  return fold<fc.Arbitrary<unknown>>(
    (x) => GeneratorByTag[bySeed[x[0]]](x as never, $)
  )(seed as never)
}

/**
 * ## {@link seedToInvalidDataGenerator `seedToInvalidDataGenerator`}
 * 
 * Convert a seed into an invalid data generator.
 * 
 * Invalid in this context means that it will never satisfy the zod schema that the seed produces.
 * 
 * To use it, you'll need to have [fast-check](https://github.com/dubzzz/fast-check) installed.
 * 
 * To convert a seed to a zod schema, use {@link seedToSchema `seedToSchema`}.
 * 
 * To convert a seed to an _valid_ data generator, use 
 * {@link seedToValidDataGenerator `seedToValidDataGenerator`}.
 */
export function seedToInvalidDataGenerator<T extends Seed.Composite>(seed: T, options?: Config.Options): fc.Arbitrary<Seed.fromComposite[keyof Seed.fromComposite]>
export function seedToInvalidDataGenerator<T>(seed: Seed.F<T>, options?: Config.Options): fc.Arbitrary<unknown>
export function seedToInvalidDataGenerator<T>(seed: Seed.F<T>, options?: Config.Options): fc.Arbitrary<unknown> {
  const $ = Config.parseOptions(options)
  return fold<fc.Arbitrary<unknown>>((x) => {
    switch (x[0]) {
      case byTag.record: return GeneratorByTag.record(x).map(mutateRandomValueOf)
      case byTag.array: return GeneratorByTag.array(x).map(mutateRandomElementOf)
      case byTag.tuple: return GeneratorByTag.tuple(x).map(mutateRandomElementOf)
      case byTag.object: return GeneratorByTag.object(x).map(mutateRandomValueOf)
      default: return GeneratorByTag[bySeed[x[0]]](x as never, $)
    }
  })(seed as never)
}

/**
 * ## {@link SeedGenerator `SeedGenerator`}
 * 
 * Pseudo-random seed generator.
 * 
 * The generator supports a wide range of discoverable configuration options via the
 * optional `options` argument.
 * 
 * Many of those options are forwarded to the corresponding `fast-check` arbitrary.
 *
 * To use it, you'll need to have [fast-check](https://github.com/dubzzz/fast-check) installed.
 * 
 * **Note:** support for `options.minDepth` is experimental. If you use it, be advised that
 * even with a minimum depth of 1, the schemas produced will be quite large. Using this option
 * in your CI/CD pipeline is not recommended.
 * 
 * See also:
 * - {@link SeedGenerator `SeedGenerator`}
 * 
 * @example
 * import * as fc from 'fast-check'
 * import { z } from 'zod'
 * import { zx } from '@traversable/zod'
 * 
 * const Json = zx.SeedGenerator({ include: ['null', 'boolean', 'number', 'string', 'array', 'object'] })
 * const [jsonNumber, jsonObject, anyJson] = [
 *   fc.sample(Json.number, 1)[0],
 *   fc.sample(Json.object, 1)[0],
 *   fc.sample(Json['*'], 1)[0],
 * ] as const
 *
 * console.log(JSON.stringify(jsonNumber))
 * // => [200,[2.96e-322,1,null,false,true]]
 * 
 * console.log(zx.toString(zx.seedToSchema(jsonNumber)))
 * // => z.number().min(2.96e-322).lt(1)
 * 
 * console.log(JSON.stringify(jsonObject))
 * // => [7500,[["n;}289K~",[250,[null,null]]]]]
 * 
 * console.log(zx.toString(zx.seedToSchema(jsonObject)))
 * // => z.object({ "n;}289K~": z.string() })
 * 
 * console.log(anyJson)
 * // => [250,[23,64]]
 * 
 * console.log(zx.toString(zx.seedToSchema(anyJson)))
 * // => z.string().min(23).max(64)
 */
export const SeedGenerator = Gen(SeedMap)

const seedsThatPreventGeneratingValidData = [
  'never',
] satisfies SchemaGenerator.Options['exclude']

const seedsThatPreventGeneratingInvalidData = [
  'any',
  'never',
  'symbol',
  'unknown',
] satisfies SchemaGenerator.Options['exclude']

/** 
 * ## {@link SeedValidDataGenerator `SeedValidDataGenerator`}
 * 
 * A seed generator that can be interpreted to produce reliably valid data.
 * 
 * This was originally developed to test for parity between various schema libraries.
 * 
 * To use it, you'll need to have [fast-check](https://github.com/dubzzz/fast-check) installed.
 * 
 * Note that certain schemas make generating valid data impossible 
 * (like {@link z.never `z.never`}) or or prohibitively difficult 
 * (like {@link z.pipe `z.pipe`}). For this reason, those schemas are not seeded.
 * 
 * To see the list of excluded schemas, see 
 * {@link seedsThatPreventGeneratingValidData `seedsThatPreventGeneratingValidData`}.
 * 
 * See also:
 * - {@link SeedInvalidDataGenerator `SeedInvalidDataGenerator`}
 * 
 * @example
 * import * as fc from 'fast-check'
 * import { z } from 'zod'
 * import { zx } from '@traversable/zod'
 * 
 * const [seed] = fc.sample(zx.SeedValidDataGenerator, 1)
 * const ZodSchema = zx.seedToSchema(seed)
 * const dataset = fc.sample(zx.seedToValidData(seed), 5)
 * 
 * const results = dataset.map((pt) => ZodSchema.safeParse(pt).success)
 * 
 * console.log(results) // => [true, true, true, true, true]
 */

export const SeedValidDataGenerator = SeedGenerator({ exclude: seedsThatPreventGeneratingValidData })['*']

/** 
 * ## {@link SeedInvalidDataGenerator `zx.SeedInvalidDataGenerator`}
 * 
 * A seed generator that can be interpreted to produce reliably invalid data.
 * 
 * This was originally developed to test for parity between various schema libraries.
 * 
 * To use it, you'll need to have [fast-check](https://github.com/dubzzz/fast-check) installed.
 * 
 * Note that certain schemas make generating invalid data impossible 
 * (like {@link z.any `z.any`}) or prohibitively difficult 
 * (like {@link z.catch `z.catch`}). For this reason, those schemas are not seeded.
 * 
 * To see the list of excluded schemas, see 
 * {@link seedsThatPreventGeneratingInvalidData `zx.seedsThatPreventGeneratingInvalidData`}.
 * 
 * See also:
 * - {@link SeedValidDataGenerator `zx.SeedValidDataGenerator`}
 * 
 * @example
 * import * as fc from 'fast-check'
 * import { z } from 'zod'
 * import { zx } from '@traversable/zod'
 * 
 * const [seed] = fc.sample(zx.SeedInvalidDataGenerator, 1)
 * const ZodSchema = zx.seedToSchema(seed)
 * const dataset = fc.sample(zx.seedToInvalidData(seed), 5)
 * 
 * const results = dataset.map((pt) => ZodSchema.safeParse(pt).success)
 * 
 * console.log(results) // => [false, false, false, false, false]
 */
export const SeedInvalidDataGenerator = fn.pipe(
  SeedGenerator({ exclude: seedsThatPreventGeneratingInvalidData }),
  ($) => fc.oneof(
    $.object,
    $.tuple,
    $.array,
    $.record,
  )
)

/**
 * ## {@link SchemaGenerator `zx.SchemaGenerator`}
 * 
 * A zod schema generator that can be interpreted to produce an arbitrary `zod` schema (v4, classic).
 * 
 * The generator supports a wide range of configuration options that are discoverable via the
 * optional `options` argument.
 * 
 * Many of those options are forwarded to the corresponding `fast-check` arbitrary.
 *
 * To use it, you'll need to have [`fast-check`](https://github.com/dubzzz/fast-check) installed.
 * 
 * **Note:** support for `options.minDepth` is experimental. If you use it, be advised that
 * _even with a minimum depth of 1_, the schemas produced will be **quite** large. Using this option
 * in your CI/CD pipeline is _not_ recommended.
 * 
 * See also:
 * - {@link SeedGenerator `zx.SeedGenerator`}
 * 
 * @example
 * import * as fc from 'fast-check'
 * import { z } from 'zod'
 * import { zx } from '@traversable/zod'
 * 
 * const tenSchemas = fc.sample(zx.SchemaGenerator({
 *   include: ['null', 'boolean', 'number', 'string', 'array', 'object'] 
 * }), 10)
 * 
 * tenSchemas.forEach((s) => console.log(zx.toString(s)))
 * // => z.number()
 * // => z.string().max(64)
 * // => z.null()
 * // => z.array(z.boolean())
 * // => z.boolean()
 * // => z.object({ "": z.object({ "/d2P} {/": z.boolean() }), "svH2]L'x": z.number().lt(-65536) })
 * // => z.null()
 * // => z.string()
 * // => z.array(z.array(z.null()))
 * // => z.object({ "y(Qza": z.boolean(), "G1S\\U 4Y6i": z.object({ "YtO3]ia0cM": z.boolean() }) })
 */

export const SchemaGenerator = fn.flow(
  SeedGenerator,
  builder => builder['*'],
  (arb) => arb.map(seedToSchema),
)

export declare namespace SchemaGenerator {
  type Options = Config.Options<typeof SeedMap>
}

/**
 * ## {@link seedToSchema `zx.seedToSchema`}
 * 
 * Interpreter that converts a seed value into the corresponding zod schema.
 * 
 * To get a seed, use {@link SeedGenerator `zx.SeedGenerator`}.
 */
export function seedToSchema<T extends Seed.Composite>(seed: T): Seed.schemaFromComposite[T[0]]
export function seedToSchema<T>(seed: Seed.F<T>): T.TSchema
export function seedToSchema<T>(seed: Seed.F<T>) {
  return fold<T.TSchema>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x[0] === byTag.any: return T.Any()
      case x[0] === byTag.boolean: return T.Boolean()
      case x[0] === byTag.date: return T.Date()
      case x[0] === byTag.never: return T.Never()
      case x[0] === byTag.null: return T.Null()
      case x[0] === byTag.symbol: return T.Symbol()
      case x[0] === byTag.undefined: return T.Undefined()
      case x[0] === byTag.unknown: return T.Unknown()
      case x[0] === byTag.void: return T.Void()
      case x[0] === byTag.integer: return T_int(x[1])
      case x[0] === byTag.bigint: return T_bigint(x[1])
      case x[0] === byTag.number: return T_number(x[1])
      case x[0] === byTag.string: return T_string(x[1])
      case x[0] === byTag.literal: return T.Literal(x[1])
      case x[0] === byTag.array: return T.Array(x[1])
      case x[0] === byTag.optional: return T.Optional(x[1])
      case x[0] === byTag.intersect: return T.Intersect(x[1])
      case x[0] === byTag.record: return T.Record(T.String(), x[1])
      case x[0] === byTag.object: return T.Object(Object.fromEntries(x[1]))
      case x[0] === byTag.tuple: return T.Tuple(x[1] as [])
      case x[0] === byTag.union: return T.Union(x[1])
    }
  })(seed as never)
}

/** 
 * ## {@link seedToValidData `seedToValidData`}
 * 
 * Given a seed, generates an single example of valid data.
 * 
 * Valid in this context means that it will always satisfy the zod schema that the seed produces.
 * 
 * To use it, you'll need to have [fast-check](https://github.com/dubzzz/fast-check) installed.
 * 
 * To convert a seed to a zod schema, use {@link seedToSchema `seedToSchema`}.
 * 
 * To convert a seed to a single example of _invalid_ data, use {@link seedToInvalidData `seedToInvalidData`}.
 */
export const seedToValidData = fn.flow(
  seedToValidDataGenerator,
  (model) => fc.sample(model, 1)[0],
)

/** 
 * ## {@link seedToInvalidData `seedToInvalidData`}
 * 
 * Given a seed, generates an single example of invalid data.
 * 
 * Invalid in this context means that it will never satisfy the zod schema that the seed produces.
 * 
 * To use it, you'll need to have [fast-check](https://github.com/dubzzz/fast-check) installed.
 * 
 * To convert a seed to a zod schema, use {@link seedToSchema `seedToSchema`}.
 * 
 * To convert a seed to a single example of _valid_ data, use {@link seedToValidData `seedToValidData`}.
 */
export const seedToInvalidData = fn.flow(
  seedToInvalidDataGenerator,
  (model) => fc.sample(model, 1)[0],
)

