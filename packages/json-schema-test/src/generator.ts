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
  omit,
  pair,
  pick,
  symbol,
  Object_create,
  PATTERN,
  escapeRegExp,
} from '@traversable/registry'
import type { TypeName } from '@traversable/json-schema-types'
import { JsonSchema } from '@traversable/json-schema-types'

type Config<T> = import('./generator-options.js').Config<T>
import * as Config from './generator-options.js'
import * as Bounds from './generator-bounds.js'
import type { Tag } from './generator-seed.js'
import { byTag, bySeed, Seed, fold } from './generator-seed.js'

const identifier = fc.stringMatching(new RegExp(PATTERN.identifier, 'u'))
const pattern = identifier.map((ident) => ident.replaceAll('$', ''))

const literalValue = fc.oneof(
  fc.string({ minLength: Bounds.defaults.string[0], maxLength: Bounds.defaults.string[1] }),
  // identifier,
  fc.double({ min: Bounds.defaults.number[0], max: Bounds.defaults.number[1], noNaN: true }),
  fc.boolean(),
)

/** 
 * TODO: break this out into a proper json builder
 */
const jsonValue = fc.oneof(
  literalValue,
  fc.array(literalValue),
  fc.dictionary(identifier, literalValue)
)

const TerminalMap = {
  boolean: fn.const(fc.tuple(fc.constant(byTag.boolean))),
  never: fn.const(fc.tuple(fc.constant(byTag.never))),
  null: fn.const(fc.tuple(fc.constant(byTag.null))),
  unknown: fn.const(fc.tuple(fc.constant(byTag.unknown))),
} satisfies { [K in keyof Seed.TerminalMap]: SeedBuilder<K> }

const integerBounds = Bounds.int(fc.integer())
const numberBounds = Bounds.number(fc.double())
const stringBounds = Bounds.string(fc.nat())

const BoundableMap = {
  integer: fn.const(fc.tuple(fc.constant(byTag.integer), integerBounds)),
  number: fn.const(fc.tuple(fc.constant(byTag.number), numberBounds)),
  string: fn.const(fc.tuple(fc.constant(byTag.string), stringBounds)),
} satisfies { [K in keyof Seed.BoundableMap]: SeedBuilder<K> }

const ValueMap = {
  const: fn.const(fc.tuple(fc.constant(byTag.const), jsonValue)),
  enum: fn.const(fc.tuple(fc.constant(byTag.enum), fc.array(literalValue, { minLength: 1 }))),
} satisfies { [K in keyof Seed.ValueMap]: SeedBuilder<K> }

const UnaryMap = {
  array: (tie) => fc.tuple(fc.constant(byTag.array), tie('*'), Bounds.array(fc.nat())),
  tuple: (tie, $) => fc.tuple(fc.constant(byTag.tuple), fc.array(tie('*'), $)),
  anyOf: (tie, $) => fc.tuple(fc.constant(byTag.anyOf), fc.array(tie('*'), $)),
  oneOf: (tie, $) => fc.tuple(fc.constant(byTag.oneOf), fc.array(tie('*'), $)),
  record: (tie, $) => fc.tuple(
    fc.constant(byTag.record),
    tie('*'),
    fc.tuple(pattern, tie('*')),
    fc.constantFrom(1, 2, 3),
  ).map(([type, additionalProperties, patternProperties, switcher]) =>
    $.additionalPropertiesOnly ? [type, additionalProperties, undefined]
      : $.patternPropertiesOnly ? [type, undefined, patternProperties]
        : switcher === 1 ? [type, additionalProperties, patternProperties]
          : switcher === 2 ? [type, undefined, patternProperties]
            : switcher === 3 ? [type, additionalProperties, undefined]
              : switcher satisfies never
  ),
  object: (tie, $) => fc.tuple(
    fc.constant(byTag.object),
    fc.uniqueArray(fc.tuple(identifier, tie('*')), $),
    fc.nat(),
  ).map(([type, xs, ix]) => {
    const required = xs.slice(0, ix % xs.length).map(([k]) => k)
    return [
      type,
      xs,
      required,
    ] satisfies [any, any, any]
  }),
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
      .sort((l, r) => sortBias[l] < sortBias[r] ? -1 : sortBias[l] > sortBias[r] ? 1 : 0)

export function JsonSchema_Integer(bounds: Bounds.int = Bounds.defaults.integer): JsonSchema.Integer {
  const [min, max /*, multipleOf */] = bounds
  let schema: JsonSchema.Integer = { type: 'integer' as const }
  if (Number_isSafeInteger(min)) schema.minimum = min
  if (Number_isSafeInteger(max)) schema.maximum = max
  // if (Number_isSafeInteger(multipleOf)) schema.multipleOf = multipleOf
  return schema
}

export function JsonSchema_Number(bounds: Bounds.number = Bounds.defaults.number): JsonSchema.Number {
  const [min, max, /* multipleOf */, minExcluded, maxExcluded] = bounds
  let schema: JsonSchema.Number = { type: 'number' }
  if (Number_isFinite(min)) {
    if (minExcluded) schema.exclusiveMinimum = min
    else schema.minimum = min
  }
  if (Number_isFinite(max)) {
    if (maxExcluded) schema.exclusiveMaximum = max
    else schema.maximum = max
  }
  return schema
}

export function JsonSchema_String(bounds: Bounds.string = Bounds.defaults.string): JsonSchema.String {
  const [min, max, exactLength] = bounds
  let schema: JsonSchema.String = { type: 'string' }
  if (Number_isNatural(exactLength)) {
    schema.minLength = exactLength
    schema.maxLength = exactLength
    return schema
  } else {
    if (Number_isNatural(min)) schema.minLength = min
    if (Number_isNatural(max)) schema.maxLength = max
    return schema
  }
}

export function JsonSchema_Array<T extends JsonSchema>(
  items: T, bounds: Bounds.array = Bounds.defaults.array
): JsonSchema.Array<T> {
  const [min, max] = bounds
  let schema: JsonSchema.Array<T> = { type: 'array', items }
  if (Number_isNatural(min)) schema.minItems = min
  if (Number_isNatural(max)) schema.maxItems = max
  return schema
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

function entries<T>(model: fc.Arbitrary<T>, options?: fc.UniqueArrayConstraintsRecommended<[k: string, T], unknown>) {
  return fc.uniqueArray(
    fc.tuple(identifier, model),
    { selector: options?.selector || (([k]) => k), ...options },
  )
}

function intersect(x: unknown, y: unknown) {
  return !isObject(x) ? y : !isObject(y) ? x : Object_assign(x, y)
}

const keyFromPattern = (key: string) => {
  if (key.startsWith('^')) key = key.slice(1)
  if (key.endsWith('$')) key = key.slice(0, -1)
  return fc.sample(fc.stringMatching(new RegExp(`^${escapeRegExp(key)}$`)), 1)[0]
}

const GeneratorByTag = {
  boolean: () => fc.boolean(),
  never: () => fc.constant(void 0 as never),
  null: () => fc.constant(null),
  unknown: () => fc.anything(),
  integer: (x) => fc.integer(Bounds.integerBoundsToIntegerConstraints(x[1])),
  number: (x) => fc.double(Bounds.numberBoundsToDoubleConstraints(x[1])),
  string: (x) => fc.string(Bounds.stringBoundsToStringConstraints(x[1])),
  const: (x) => fc.constant(x[1]),
  enum: (x) => fc.constant(x[1][0]),
  array: (x) => fc.array(x[1], Bounds.arrayBoundsToArrayConstraints(x[2])),
  record: (x) =>
    x[1] && x[2] ? fc.tuple(
      fc.dictionary(fc.string(), x[1]),
      fc.record({ [keyFromPattern(x[2][0])]: x[2][1] })
    ).map(([l, r]) => ({ ...l, ...r }))
      : x[1] ? fc.dictionary(fc.string(), x[1])
        : x[2] ? fc.record({ [keyFromPattern(x[2][0])]: x[2][1] })
          : fc.constant({})
  ,
  tuple: (x) => fc.tuple(...x[1]),
  anyOf: (x) => fc.oneof(...(x[1] || [fc.constant(void 0 as never)])),
  oneOf: (x) => fc.oneof(...(x[1] || [fc.constant(void 0 as never)])),
  object: (x) => fc.record(Object_fromEntries(x[1]), { requiredKeys: x[2] }),
  allOf: (x) => fc.tuple(...x[1]).map((xs) => xs.reduce((x, y) => intersect(x, y), Object_create(null))),
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
export function seedToValidDataGenerator<T>(seed: Seed.F<T>): fc.Arbitrary<unknown>
export function seedToValidDataGenerator<T>(seed: Seed.F<T>): fc.Arbitrary<unknown> {
  return fold<fc.Arbitrary<unknown>>(
    (x) => GeneratorByTag[bySeed[x[0]]](x as never)
  )(seed as never)
}

/**
 * ## {@link seedToInvalidDataGenerator `seedToInvalidDataGenerator`}
 * 
 * Convert a seed into an invalid data generator.
 * 
 * Invalid in this context means that it will never satisfy the zod schema that the seed produces.
 * 
 * To convert a seed to a zod schema, use {@link seedToSchema `seedToSchema`}.
 * 
 * To convert a seed to an _valid_ data generator, use 
 * {@link seedToValidDataGenerator `seedToValidDataGenerator`}.
 */
export function seedToInvalidDataGenerator<T extends Seed.Composite>(seed: T): fc.Arbitrary<Seed.fromComposite[keyof Seed.fromComposite]>
export function seedToInvalidDataGenerator<T>(seed: Seed.F<T>): fc.Arbitrary<unknown>
export function seedToInvalidDataGenerator<T>(seed: Seed.F<T>): fc.Arbitrary<unknown> {
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
 * ## {@link SeedGenerator `SeedGenerator`}
 * 
 * Pseudo-random seed generator.
 * 
 * The generator supports a wide range of discoverable configuration options via the
 * optional `options` argument.
 * 
 * Many of those options are forwarded to the corresponding `fast-check` arbitrary.
 * 
 * See also:
 * - {@link SeedGenerator `SeedGenerator`}
 * 
 * @example
 * // TODO
 */
export const SeedGenerator = Gen(SeedMap)

export const seedsThatPreventGeneratingValidData = [
  'never',
] satisfies SchemaGenerator.Options['exclude']

export const seedsThatPreventGeneratingInvalidData = [
  'never',
  'unknown',
] satisfies SchemaGenerator.Options['exclude']

/** 
 * ## {@link SeedValidDataGenerator `SeedValidDataGenerator`}
 * 
 * A seed generator that can be interpreted to produce reliably valid data.
 * 
 * This was originally developed to test for parity between various schema libraries.
 * 
 * Note that certain schemas make generating valid data impossible 
 * (like {@link JsonSchema.Never `JsonSchema.Never`}). For this reason, those schemas
 * will not be seeded.
 * 
 * To see the list of excluded schemas, see 
 * {@link seedsThatPreventGeneratingValidData `seedsThatPreventGeneratingValidData`}.
 * 
 * See also:
 * - {@link SeedInvalidDataGenerator `SeedInvalidDataGenerator`}
 * 
 * @example
 * // TODO
 */

export const SeedValidDataGenerator = SeedGenerator({ exclude: seedsThatPreventGeneratingValidData })['*']

/** 
 * ## {@link SeedInvalidDataGenerator `zx.SeedInvalidDataGenerator`}
 * 
 * A seed generator that can be interpreted to produce reliably invalid data.
 * 
 * This was originally developed to test for parity between various schema libraries.
 * 
 * Note that certain schemas make generating invalid data impossible 
 * (like {@link JsonSchema.Unknown `JsonSchema.Unknown`}). For this reason, those schemas
 * will not be seeded.
 * 
 * To see the list of excluded schemas, see 
 * {@link seedsThatPreventGeneratingInvalidData `zx.seedsThatPreventGeneratingInvalidData`}.
 * 
 * See also:
 * - {@link SeedValidDataGenerator `zx.SeedValidDataGenerator`}
 * 
 * @example
 * // TODO
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
 * See also:
 * - {@link SeedGenerator `zx.SeedGenerator`}
 * 
 * @example
 * // TODO
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
// export function seedToSchema<T extends Seed.Composite>(seed: T): Seed.schemaFromComposite[T[0]]
export function seedToSchema<T>(seed: Seed.F<T>): JsonSchema
export function seedToSchema<T>(seed: Seed.F<T>) {
  return fold<JsonSchema>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x[0] === byTag.boolean: return { type: 'boolean' }
      case x[0] === byTag.never: return { enum: [] as [] }
      case x[0] === byTag.null: return { type: 'null' }
      case x[0] === byTag.unknown: return {}
      case x[0] === byTag.integer: return JsonSchema_Integer(x[1])
      case x[0] === byTag.number: return JsonSchema_Number(x[1])
      case x[0] === byTag.string: return JsonSchema_String(x[1])
      case x[0] === byTag.const: return { const: x[1] }
      case x[0] === byTag.enum: return { enum: x[1] }
      case x[0] === byTag.array: return JsonSchema_Array(x[1], x[2])
      case x[0] === byTag.allOf: return { allOf: x[1] }
      case x[0] === byTag.record: return {
        type: 'object',
        ...x[1] && { additionalProperties: x[1] },
        ...x[2] && { patternProperties: { [x[2][0]]: x[2][1] } },
      }
      case x[0] === byTag.object: return { type: 'object', properties: Object_fromEntries(x[1]), required: x[2] ?? [] }
      case x[0] === byTag.tuple: return { type: 'array', prefixItems: x[1] }
      case x[0] === byTag.anyOf: return { anyOf: x[1] }
      case x[0] === byTag.oneOf: return { oneOf: x[1] }
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
 * To convert a seed to a zod schema, use {@link seedToSchema `seedToSchema`}.
 * 
 * To convert a seed to a single example of _valid_ data, use {@link seedToValidData `seedToValidData`}.
 */
export const seedToInvalidData = fn.flow(
  seedToInvalidDataGenerator,
  (model) => fc.sample(model, 1)[0],
)
