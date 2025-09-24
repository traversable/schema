import { type } from 'arktype'
import * as fc from 'fast-check'

import type { newtype, inline } from '@traversable/registry'
import {
  Array_isArray,
  fn,
  getRandomElementOf,
  isKeyOf,
  isObject,
  mutateRandomElementOf,
  mutateRandomValueOf,
  Number_isFinite,
  Number_isNatural,
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
} from '@traversable/registry'

type Config<T> = import('./generator-options.js').Config<T>
import * as Config from './generator-options.js'
import * as Bounds from './generator-bounds.js'
import type { Tag } from './generator-seed.js'
import { byTag, bySeed, Seed, fold } from './generator-seed.js'
import type { AnyTypeName } from './typename.js'

const identifier = fc.stringMatching(new RegExp(PATTERN.identifier, 'u'))

const enumValues = fc.uniqueArray(
  fc.tuple(identifier, identifier),
  { selector: ([k]) => k, minLength: 1, }
).map(Object_fromEntries)

const literalValue = fc.oneof(
  // fc.string({ minLength: Bounds.defaults.string[0], maxLength: Bounds.defaults.string[1] }),
  identifier,
  fc.double({ min: Bounds.defaults.number[0], max: Bounds.defaults.number[1], noNaN: true }).map(
    (x) => Math.abs(x) < Number.EPSILON
      ? Math.trunc(x)
      : scientificNotationToFixed(x)
  ),
  // fc.bigInt({ min: Bounds.defaults.bigint[0], max: Bounds.defaults.bigint[1] }),
  fc.boolean(),
)

function scientificNotationToFixed(x: number) {
  const [base, exp] = String(x).split('e')
  if (exp === undefined) return x
  else {
    const fixpoint = Math.abs(Number.parseInt(exp))
    const [, decimal] = base.split('.')

    if (decimal === undefined)
      return x.toFixed(fixpoint)
    else {
      return x.toFixed(fixpoint + decimal.length)
    }
  }
}

const TerminalMap = {
  boolean: fn.const(fc.tuple(fc.constant(byTag.boolean))),
  // date: fn.const(fc.tuple(fc.constant(byTag.date))),
  never: fn.const(fc.tuple(fc.constant(byTag.never))),
  null: fn.const(fc.tuple(fc.constant(byTag.null))),
  // undefined: fn.const(fc.tuple(fc.constant(byTag.undefined))),
  unknown: fn.const(fc.tuple(fc.constant(byTag.unknown))),
  // symbol: fn.const(fc.tuple(fc.constant(byTag.symbol))),
} satisfies { [K in keyof Seed.TerminalMap]: SeedBuilder<K> }

// const integerBounds = Bounds.int(fc.integer())
const bigIntBounds = Bounds.bigint(fc.bigInt())
const numberBounds = Bounds.number(fc.double())
const stringBounds = Bounds.string(fc.integer({ min: 0 }))

const BoundableMap = {
  // bigint: fn.const(fc.tuple(fc.constant(byTag.bigint), bigIntBounds)),
  number: fn.const(fc.tuple(fc.constant(byTag.number), numberBounds)),
  string: fn.const(fc.tuple(fc.constant(byTag.string), stringBounds)),
} satisfies { [K in keyof Seed.BoundableMap]: SeedBuilder<K> }

const ValueMap = {
  enum: fn.const(fc.tuple(fc.constant(byTag.enum), enumValues)),
  literal: fn.const(fc.tuple(fc.constant(byTag.literal), literalValue)),
} satisfies { [K in keyof Seed.ValueMap]: SeedBuilder<K> }

const UnaryMap = {
  array: (tie) => fc.tuple(fc.constant(byTag.array), tie('*'), Bounds.array(fc.integer({ min: 0 }))),
  // optional: (tie) => fc.tuple(fc.constant(byTag.optional), tie('*')),
  record: (tie) => fc.tuple(fc.constant(byTag.record), tie('*')),
  object: (tie, $) => fc.tuple(
    fc.constant(byTag.object),
    fc.uniqueArray(fc.tuple(identifier, tie('*')), $)
  ),
  tuple: (tie, $) => fc.tuple(fc.constant(byTag.tuple), fc.array(tie('*'), $)),
  anyOf: (tie, $) => fc.tuple(fc.constant(byTag.anyOf), fc.array(tie('*'), $)),
  oneOf: (tie, $) => fc.tuple(fc.constant(byTag.oneOf), fc.array(tie('*'), $)),
  allOf: (tie) => entries(tie('*'), { minLength: 2 }).map(fn.flow(
    (xs) => pair(
      xs.slice(0, Math.ceil(xs.length / 2)),
      xs.slice(Math.ceil(xs.length / 2)),
    ),
    ([l, r]) => pair(
      pair(byTag.object, l),
      pair(byTag.object, r),
    ),
    (both) => pair(byTag.allOf, both),
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
      // TODO: remove nullish coalesce operators
      .sort((l, r) => sortBias[l]! < sortBias[r]! ? -1 : sortBias[l]! > sortBias[r]! ? 1 : 0)

// export const ark_integer
//   : (bounds?: Bounds.integer) => type<number>
//   = (bounds = Bounds.defaults.integer) => {
//     const [min, max, multipleOf] = bounds
//     let schema = type.keywords.number.integer
//     if (Number_isSafeInteger(min)) schema = schema.atLeast(min)
//     if (Number_isSafeInteger(max)) schema = schema.atMost(max)
//     // if (Number_isSafeInteger(multipleOf) && !Number_isNaN(multipleOf)) schema = schema.divisibleBy(multipleOf)
//     return schema
//   }

// export const ark_bigint
//   : (bounds?: Bounds.bigint) => type<bigint>
//   = (bounds = Bounds.defaults.bigint) => {
//     const [min, max, multipleOf] = bounds
//     let schema = type.bigint
//     if (typeof min === 'bigint') schema = type.bigint.atLeast(min)
//     if (typeof max === 'bigint') schema = type.bigint.atMost(max)
//     // if (typeof multipleOf === 'bigint') schema = schema.divisibleBy(multipleOf)
//     return schema
//   }

export const ark_number
  : (bounds?: Bounds.number) => type<number>
  = (bounds = Bounds.defaults.number) => {
    const [min, max, multipleOf, minExcluded, maxExcluded] = bounds
    let schema = type.number
    if (Number_isFinite(min)) schema = minExcluded ? schema.moreThan(min) : schema.atLeast(min)
    if (Number_isFinite(max)) schema = maxExcluded ? schema.lessThan(max) : schema.atMost(max)
    // if (typeof multipleOf === 'number') schema = schema.divisibleBy(multipleOf)
    return schema
  }

export const ark_string
  : (bounds?: Bounds.string) => type<string>
  = (bounds = Bounds.defaults.string) => {
    const [min, max, exactLength] = bounds
    let schema = type.string
    if (Number_isNatural(exactLength))
      return schema.exactlyLength(exactLength)
    else {
      if (Number_isNatural(min)) schema = schema.atLeastLength(min)
      if (Number_isNatural(max)) schema = schema.atMostLength(max)
      return schema
    }
  }

export const ark_array
  : <T extends type.Any>(elementSchema: T, bounds?: Bounds.array) => type<T[]>
  = (elementSchema, bounds = Bounds.defaults.array) => {
    const [min, max, exactLength] = bounds
    let schema = elementSchema.array()
    if (Number_isNatural(exactLength))
      return schema.exactlyLength(exactLength)
    else {
      if (Number_isNatural(min)) schema = schema.atLeastLength(min)
      if (Number_isNatural(max)) schema = schema.atMostLength(max)
      return schema
    }
  }

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
 * ## {@link Gen `arkTest.Gen`}
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

// const arbitrarySymbol = fc.oneof(fc.constant(Symbol()), fc.string().map((s) => Symbol.for(s)))

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
  boolean: () => fc.boolean(),
  // date: () => fc.date({ noInvalidDate: true }),
  never: () => fc.constant(void 0 as never),
  null: () => fc.constant(null),
  // symbol: () => arbitrarySymbol,
  // undefined: () => fc.constant(undefined),
  unknown: () => fc.anything(),
  // bigint: (x) => fc.bigInt(Bounds.bigintBoundsToBigIntConstraints(x[1])),
  number: (x) => fc.double(Bounds.numberBoundsToDoubleConstraints(x[1])),
  string: (x) => fc.string(Bounds.stringBoundsToStringConstraints(x[1])),
  enum: (x) => fc.constantFrom(...Object_values(x[1])),
  literal: (x) => fc.constant(x[1]),
  array: (x) => fc.array(x[1], Bounds.arrayBoundsToArrayConstraints(x[2])),
  // optional: (x, _$, isProperty) => isProperty ? x[1] : fc.option(x[1], { nil: undefined }),
  record: (x) => fc.dictionary(fc.string(), x[1]),
  tuple: (x) => fc.tuple(...x[1]),
  anyOf: (x) => fc.oneof(...(x[1] || [fc.constant(void 0 as never)])),
  oneOf: (x) => fc.oneof(...(x[1] || [fc.constant(void 0 as never)])),
  object: (x) => fc.record(Object_fromEntries(x[1]), { requiredKeys: x[1].filter(([k]) => !k.endsWith('?')).map(([k]) => k) }),
  allOf: (x) => fc.tuple(...x[1]).map(([x, y]) => intersect(x, y)),
} satisfies {
  [K in keyof Seed]: (x: Seed<fc.Arbitrary<unknown>>[K], $: Config<never>, isProperty: boolean) => fc.Arbitrary<unknown>
}

/**
 * ## {@link seedToValidDataGenerator `arkTest.seedToValidDataGenerator`}
 * 
 * Convert a seed into an valid data generator.
 * 
 * Valid in this context means that it will always satisfy the ArkType schema that the seed produces.
 * 
 * To convert a seed to a ArkType schema, use {@link seedToSchema `arkTest.seedToSchema`}.
 * 
 * To convert a seed to an _invalid_ data generator, use {@link seedToInvalidDataGenerator `arkTest.seedToInvalidDataGenerator`}.
 */
export function seedToValidDataGenerator<T>(seed: Seed.F<T>, options?: Config.Options): fc.Arbitrary<unknown>
export function seedToValidDataGenerator<T>(seed: Seed.F<T>, options?: Config.Options): fc.Arbitrary<unknown> {
  const $ = Config.parseOptions(options)
  return fold<fc.Arbitrary<unknown>>((x) => GeneratorByTag[bySeed[x[0]]](x as never))(seed as never)
}

/**
 * ## {@link seedToInvalidDataGenerator `arkTest.seedToInvalidDataGenerator`}
 * 
 * Convert a seed into an invalid data generator.
 * 
 * Invalid in this context means that it will never satisfy the ArkType schema that the seed produces.
 * 
 * To convert a seed to an ArkType schema, use {@link seedToSchema `arkTest.seedToSchema`}.
 * 
 * To convert a seed to an _valid_ data generator, use 
 * {@link seedToValidDataGenerator `arkTest.seedToValidDataGenerator`}.
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
      default: return GeneratorByTag[bySeed[x[0]]](x as never)
    }
  })(seed as never)
}

/**
 * ## {@link SeedGenerator `arkTest.SeedGenerator`}
 * 
 * Pseudo-random seed generator.
 * 
 * The generator supports a wide range of discoverable configuration options via the
 * optional `options` argument.
 * 
 * Many of those options are forwarded to the corresponding `fast-check` arbitrary.
 * 
 * See also:
 * - {@link SeedGenerator `arkTest.SeedGenerator`}
 * 
 * @example
 * import * as fc from 'fast-check'
 * import { type } from 'arktype'
 * import { arkTest } from '@traversable/arktype-test'
 * 
 * const Json = arkTest.SeedGenerator({
 *   include: ['null', 'boolean', 'number', 'string', 'array', 'object']
 * })
 * 
 * const [jsonNumber, jsonObject, anyJson] = [
 *   fc.sample(Json.number, 1)[0],
 *   fc.sample(Json.object, 1)[0],
 *   fc.sample(Json['*'], 1)[0],
 * ] as const
 *
 * console.log(jsonNumber)
 * // => [200,[2.96e-322,1,null,false,true]]
 * 
 * console.log(jsonObject)
 * // => [7500,[["n;}289K~",[250,[null,null]]]]]
 * 
 * console.log(anyJson)
 * // => [250,[23,64]]
 */
export const SeedGenerator = Gen(SeedMap)

const seedsThatPreventGeneratingValidData = [
  'never',
] satisfies SchemaGenerator.Options['exclude']

const seedsThatPreventGeneratingInvalidData = [
  'never',
  'unknown',
  // 'symbol',
] satisfies SchemaGenerator.Options['exclude']

/** 
 * ## {@link SeedValidDataGenerator `arkTest.SeedValidDataGenerator`}
 * 
 * A seed generator that can be interpreted to produce reliably valid data.
 * 
 * This was originally developed to test for parity between various schema libraries.
 * 
 * Note that certain schemas make generating valid data impossible 
 * (like {@link type.never `type.never`}). For this reason, those schemas are not seeded.
 * 
 * To see the list of excluded schemas, see 
 * {@link seedsThatPreventGeneratingValidData `arkTest.seedsThatPreventGeneratingValidData`}.
 * 
 * See also:
 * - {@link SeedInvalidDataGenerator `arkTest.SeedInvalidDataGenerator`}
 * 
 * @example
 * import * as fc from 'fast-check'
 * import { type } from 'arktype'
 * import { arkTest } from '@traversable/arktype-test'
 * 
 * const [seed] = fc.sample(arkTest.SeedValidDataGenerator, 1)
 * const ArkTypeSchema = arkTest.seedToSchema(seed)
 * const dataset = fc.sample(arkTest.seedToValidData(seed), 5)
 * 
 * const results = dataset.map((pt) => ArkTypeSchema(pt))
 * 
 * console.log(results) // => [true, true, true, true, true]
 */

export const SeedValidDataGenerator = SeedGenerator({ exclude: seedsThatPreventGeneratingValidData })['*']

/** 
 * ## {@link SeedInvalidDataGenerator `arkTest.SeedInvalidDataGenerator`}
 * 
 * A seed generator that can be interpreted to produce reliably invalid data.
 * 
 * This was originally developed to test for parity between various schema libraries.
 * 
 * Note that certain schemas make generating invalid data impossible 
 * (like {@link type.unknown `type.unknown`}). For this reason, those schemas are not seeded.
 * 
 * To see the list of excluded schemas, see 
 * {@link seedsThatPreventGeneratingInvalidData `arkTest.seedsThatPreventGeneratingInvalidData`}.
 * 
 * See also:
 * - {@link SeedValidDataGenerator `arkTest.SeedValidDataGenerator`}
 * 
 * @example
 * import * as fc from 'fast-check'
 * import { type } from 'arktype'
 * import { arkTest } from '@traversable/arktype-test'
 * 
 * const [seed] = fc.sample(arkTest.SeedInvalidDataGenerator, 1)
 * const ArkTypeSchema = arkTest.seedToSchema(seed)
 * const dataset = fc.sample(arkTest.seedToInvalidData(seed), 5)
 * 
 * const results = dataset.map((pt) => ArkTypeSchema(pt))
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
 * ## {@link SchemaGenerator `arkTest.SchemaGenerator`}
 * 
 * A random seed generator that can be interpreted to produce an arbitrary ArkType schema.
 * 
 * The generator supports a wide range of configuration options that are discoverable via the
 * optional `options` argument.
 * 
 * Many of those options are forwarded to the corresponding `fast-check` arbitrary.
 * 
 * See also:
 * - {@link SeedGenerator `arkTest.SeedGenerator`}
 * 
 * @example
 * import * as fc from 'fast-check'
 * import { type } from 'arktype'
 * import { arkTest } from '@traversable/arktype-test'
 * 
 * const tenSchemas = fc.sample(arkTest.SchemaGenerator({
 *   include: ['null', 'boolean', 'number', 'string', 'array', 'object'] 
 * }), 10)
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
 * ## {@link seedToSchema `arkTest.seedToSchema`}
 * 
 * Interpreter that converts a seed value into the corresponding ArkType schema.
 * 
 * To get a seed, use {@link SeedGenerator `arkTest.SeedGenerator`}.
 */
export function seedToSchema<T extends Seed.Composite>(seed: T): Seed.schemaFromComposite[T[0]]
export function seedToSchema<T>(seed: Seed.F<T>): type.Any
export function seedToSchema<T>(seed: Seed.F<T>) {
  return fold<type.Any>((x, isProperty) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x[0] === byTag.boolean: return type.boolean
      // case x[0] === byTag.date: return type.Date
      case x[0] === byTag.never: return type.never
      case x[0] === byTag.null: return type.null
      // case x[0] === byTag.symbol: return type.symbol
      // case x[0] === byTag.undefined: return type.undefined
      case x[0] === byTag.unknown: return type.unknown
      // case x[0] === byTag.bigint: return type.bigint
      case x[0] === byTag.number: return type.number
      case x[0] === byTag.string: return type.string
      case x[0] === byTag.enum: return type.enumerated(...Object_values(x[1]))
      case x[0] === byTag.array: return x[1].array()
      // case x[0] === byTag.optional: return x[1]
      case x[0] === byTag.allOf: return x[1].reduce((l, r) => l.and(r))
      case x[0] === byTag.record: return type.Record(type.string, x[1])
      case x[0] === byTag.tuple: return type(x[1] as [])
      case x[0] === byTag.anyOf: return x[1].reduce((l, r) => l.or(r))
      case x[0] === byTag.oneOf: return x[1].reduce((l, r) => l.or(r))
      case x[0] === byTag.object: return type(Object_fromEntries(x[1]))
      case x[0] === byTag.literal: return type(
        // typeof x[1] === 'string' ? `"${escape(x[1])}"` : (typeof x[1] === 'bigint' ? `${x[1]}n` : `${x[1]}`) as '""'
        typeof x[1] === 'string' ? `"${x[1]}"` : (typeof x[1] === 'bigint' ? `${x[1]}n` : `${x[1]}`) as '""'
      )
    }
  })(seed as never)
}

/** 
 * ## {@link seedToValidData `arkTest.seedToValidData`}
 * 
 * Given a seed, generates an single example of valid data.
 * 
 * Valid in this context means that it will always satisfy the ArkType schema that the seed produces.
 * 
 * To convert a seed to a ArkType schema, use {@link seedToSchema `arkTest.seedToSchema`}.
 * 
 * To convert a seed to a single example of _invalid_ data, use {@link seedToInvalidData `arkTest.seedToInvalidData`}.
 */
export const seedToValidData = fn.flow(
  seedToValidDataGenerator,
  (model) => fc.sample(model, 1)[0],
)

/** 
 * ## {@link seedToInvalidData `arkTest.seedToInvalidData`}
 * 
 * Given a seed, generates an single example of invalid data.
 * 
 * Invalid in this context means that it will never satisfy the ArkType schema that the seed produces.
 * 
 * To convert a seed to a ArkType schema, use {@link seedToSchema `arkTest.seedToSchema`}.
 * 
 * To convert a seed to a single example of _valid_ data, use {@link seedToValidData `arkTest.seedToValidData`}.
 */
export const seedToInvalidData = fn.flow(
  seedToInvalidDataGenerator,
  (model) => fc.sample(model, 1)[0],
)
