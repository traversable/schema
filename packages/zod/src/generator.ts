import { z } from 'zod/v4'
import * as fc from 'fast-check'

import type { newtype, inline } from '@traversable/registry'
import {
  Array_isArray,
  fn,
  isKeyOf,
  isObject,
  isShowable,
  Number_isFinite,
  Number_isNatural,
  Number_isSafeInteger,
  Object_assign,
  Object_entries,
  Object_fromEntries,
  Object_keys,
  Object_values,
  omit,
  pick,
  symbol,
} from '@traversable/registry'

type Config<T> = import('./generator-options.js').Config<T>
import * as Config from './generator-options.js'
import * as Bounds from './generator-bounds.js'
import type { Tag } from './seed.js'
import { byTag, bySeed, Seed, fold } from './seed.js'
import type { AnyTypeName } from './typename.js'
import type { ZodType } from './utils.js'
import {
  getRandomElementOf,
  mutateRandomElementOf,
  mutateRandomValueOf,
  pair,
  PromiseSchemaIsUnsupported,
  removePrototypeMethods,
} from './utils.js'

const enumValues
  = fc.uniqueArray(
    fc.tuple(
      fc.string(),
      /**
       * Can't use numeric values when generating `z.enum` without a workaround for this issue:
       * https://github.com/colinhacks/zod/issues/4353
       */
      fc.string(), // fc.oneof(fc.string(), fc.integer()),
    ),
    {
      selector: ([k]) => k,
      minLength: 1,
    }
  ).map(Object_fromEntries) satisfies fc.Arbitrary<z.core.util.EnumLike>

const literalValue = fc.oneof(
  fc.string({ minLength: Bounds.defaults.string[0], maxLength: Bounds.defaults.string[1] }),
  fc.double({ min: Bounds.defaults.number[0], max: Bounds.defaults.number[1] }),
  fc.bigInt({ min: Bounds.defaults.bigint[0], max: Bounds.defaults.bigint[1] }),
  fc.boolean(),
  fc.constantFrom(null, undefined)
)

const TerminalMap = {
  any: fn.const(fc.tuple(fc.constant(byTag.any))),
  boolean: fn.const(fc.tuple(fc.constant(byTag.boolean))),
  date: fn.const(fc.tuple(fc.constant(byTag.date))),
  file: fn.const(fc.tuple(fc.constant(byTag.file))),
  nan: fn.const(fc.tuple(fc.constant(byTag.nan))),
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
  int: fn.const(fc.tuple(fc.constant(byTag.int), integerBounds)),
  number: fn.const(fc.tuple(fc.constant(byTag.number), numberBounds)),
  string: fn.const(fc.tuple(fc.constant(byTag.string), stringBounds)),
} satisfies { [K in keyof Seed.BoundableMap]: SeedBuilder<K> }

const ValueMap = {
  enum: fn.const(fc.tuple(fc.constant(byTag.enum), enumValues)),
  literal: fn.const(fc.tuple(fc.constant(byTag.literal), literalValue)),
  template_literal: (_tie, $) => templateLiteralSeed($),
} satisfies { [K in keyof Seed.ValueMap]: SeedBuilder<K> }

const UnaryMap = {
  array: (tie) => fc.tuple(fc.constant(byTag.array), tie('*'), Bounds.array(fc.integer({ min: 0 }))),
  catch: (tie) => fc.tuple(fc.constant(byTag.catch), tie('*')),
  custom: (tie) => fc.tuple(fc.constant(byTag.custom), tie('*')), 
  default: (tie) => fc.tuple(fc.constant(byTag.default), tie('*')),
  lazy: (tie) => fc.tuple(fc.constant(byTag.lazy), fc.func<[], unknown>(tie('*'))),
  nonoptional: (tie) => fc.tuple(fc.constant(byTag.nonoptional), tie('*')),
  nullable: (tie) => fc.tuple(fc.constant(byTag.nullable), tie('*')),
  optional: (tie) => fc.tuple(fc.constant(byTag.optional), tie('*')),
  readonly: (tie) => fc.tuple(fc.constant(byTag.readonly), tie('*')),
  record: (tie) => fc.tuple(fc.constant(byTag.record), tie('*')),
  set: (tie) => fc.tuple(fc.constant(byTag.set), tie('*')),
  success: (tie) => fc.tuple(fc.constant(byTag.success), tie('*')),
  object: (tie, $) => fc.tuple(
    fc.constant(byTag.object),
    fc.uniqueArray(fc.tuple(fc.string().filter(removePrototypeMethods), tie('*')), $)
  ),
  tuple: (tie, $) => fc.tuple(fc.constant(byTag.tuple), fc.array(tie('*'), $)),
  union: (tie, $) => fc.tuple(fc.constant(byTag.union), fc.array(tie('*'), $)),
  intersection: (tie, $) => entries(tie('*'), { minLength: 2 }).map(fn.flow(
    (xs) => pair(
      xs.slice(0, Math.ceil(xs.length / 2)),
      xs.slice(Math.ceil(xs.length / 2)),
    ),
    ([l, r]) => pair(
      pair(byTag.object, l),
      pair(byTag.object, r),
    ),
    (both) => pair(byTag.intersection, both),
  )),
  map: (tie) => fc.tuple(fc.constant(byTag.map), fc.tuple(tie('*'), tie('*'))),
  pipe: (tie) => fc.tuple(fc.constant(byTag.pipe), fc.tuple(tie('*'), tie('*'))),
  transform: (tie) => fc.tuple(fc.constant(byTag.transform), tie('*')),
  promise: () => PromiseSchemaIsUnsupported('SeedMap'),
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

export const z_int
  : (bounds?: Bounds.int) => z.ZodNumber
  = (bounds = Bounds.defaults.int) => {
    const [min, max, multipleOf] = bounds
    let schema = z.number().int()
    if (Number_isSafeInteger(min)) schema = schema.min(min)
    if (Number_isSafeInteger(max)) schema = schema.max(max)
    // if (Number_isSafeInteger(multipleOf) && !Number_isNaN(multipleOf)) schema = schema.multipleOf(multipleOf)
    return schema
  }

export const z_bigint
  : (bounds?: Bounds.bigint) => z.ZodBigInt
  = (bounds = Bounds.defaults.bigint) => {
    const [min, max, multipleOf] = bounds
    let schema = z.bigint()
    if (typeof min === 'bigint') schema = schema.min(min)
    if (typeof max === 'bigint') schema = schema.max(max)
    // if (typeof multipleOf === 'bigint') schema = schema.multipleOf(multipleOf)
    return schema
  }

export const z_number
  : (bounds?: Bounds.number) => z.ZodNumber
  = (bounds = Bounds.defaults.number) => {
    const [min, max, multipleOf, minExcluded, maxExcluded] = bounds
    let schema = z.number()
    if (Number_isFinite(min)) schema = minExcluded ? schema.gt(min) : schema.min(min)
    if (Number_isFinite(max)) schema = maxExcluded ? schema.lt(max) : schema.max(max)
    // if (typeof multipleOf === 'bigint') schema = schema.multipleOf(multipleOf)
    return schema
  }

export const z_string
  : (bounds?: Bounds.string) => z.ZodString
  = (bounds = Bounds.defaults.string) => {
    const [min, max, exactLength] = bounds
    let schema = z.string()
    if (Number_isNatural(exactLength)) return (
      schema = schema.min(exactLength),
      schema = schema.max(exactLength),
      schema
    )
    else {
      if (Number_isNatural(min)) schema = schema.min(min)
      if (Number_isNatural(max)) schema = schema.max(max)
      return schema
    }
  }

export const z_array
  : <T extends ZodType>(elementSchema: T, bounds?: Bounds.array) => z.ZodArray<T>
  = (elementSchema, bounds = Bounds.defaults.array) => {
    const [min, max, exactLength] = bounds
    let schema = z.array(elementSchema)
    if (Number_isNatural(exactLength)) return (
      schema = schema.min(exactLength),
      schema = schema.max(exactLength),
      schema
    )
    else {
      if (Number_isNatural(min)) schema = schema.min(min)
      if (Number_isNatural(max)) schema = schema.max(max)
      return schema
    }
  }

const branchNames = [
  'array',
  'object',
  'record',
  'tuple',
] as const satisfies AnyTypeName[]

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
          if (branchName === 'object') leaf = fc.tuple(fc.constant(byTag.object), entries(builder['*']))
          else if (branchName === 'tuple') leaf = fc.tuple(fc.constant(byTag.tuple), fc.array(builder['*']))
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


const typedArray = fc.oneof(
  fc.int8Array(),
  fc.uint8Array(),
  fc.uint8ClampedArray(),
  fc.int16Array(),
  fc.uint16Array(),
  fc.int32Array(),
  fc.uint32Array(),
  fc.float32Array(),
  fc.float64Array(),
  fc.bigInt64Array(),
  fc.bigUint64Array(),
)

const pathName = fc.webUrl().map((webUrl) => new URL(webUrl).pathname)
const ext = fc.string({ minLength: 2, maxLength: 3 })
const fileName = fc.tuple(pathName, ext).map(([pathName, ext]) => `${pathName}.${ext}` as const)
const fileBits = fc.array(typedArray)
const file = fc.tuple(fileBits, fileName).map(([fileBits, filename]) => new File(fileBits, filename))
const arbitrarySymbol = fc.oneof(fc.constant(Symbol()), fc.string().map((s) => Symbol.for(s)))

function entries<T>(model: fc.Arbitrary<T>, options?: fc.UniqueArrayConstraintsRecommended<[k: string, T], unknown>) {
  return fc.uniqueArray(
    fc.tuple(fc.string().filter(removePrototypeMethods), model),
    { selector: options?.selector || (([k]) => k), ...options },
  )
}

const is = {
  null: (x: unknown): x is [byTag['null']] => Array_isArray(x) && x[0] === byTag.null,
  undefined: (x: unknown): x is [byTag['undefined']] => Array_isArray(x) && x[0] === byTag.undefined,
  boolean: (x: unknown): x is [byTag['boolean']] => Array_isArray(x) && x[0] === byTag.boolean,
  int: (x: unknown): x is [byTag['int'], Bounds.int] => Array_isArray(x) && x[0] === byTag.int,
  number: (x: unknown): x is [byTag['number'], Bounds.number] => Array_isArray(x) && x[0] === byTag.number,
  string: (x: unknown): x is [byTag['number'], Bounds.string] => Array_isArray(x) && x[0] === byTag.string,
  literal: (x: unknown): x is [byTag['number'], z.core.util.Literal] => Array_isArray(x) && x[0] === byTag.literal,
  bigint: (x: unknown): x is [byTag['number'], Bounds.bigint] => Array_isArray(x) && x[0] === byTag.bigint,
}

function templateLiteralNodeToPart(x: Seed.TemplateLiteral.Node): z.core.$ZodTemplateLiteralPart {
  if (isShowable(x)) return x
  else if (is.null(x)) return z.null()
  else if (is.undefined(x)) return z.undefined()
  else if (is.boolean(x)) return z.boolean()
  else if (is.int(x)) return z_int(x[1])
  else if (is.number(x)) return z_number(x[1])
  else if (is.bigint(x)) return z_bigint(x[1])
  else if (is.string(x)) return z_string(x[1])
  else if (is.literal(x)) return z.literal(x[1])
  else { return fn.exhaustive(x as never) }
}
function templateParts(seed: Seed.TemplateLiteral) {
  return fn.map(seed[1], templateLiteralNodeToPart)
}

function generateStringFromRegExp(regex: RegExp, $: Config<never>) {
  return regex.source === '^()$' ? fc.constant('') : fc.stringMatching(regex, $.template_literal)
}

function templateLiteralSeed($: Config.byTypeName['template_literal']): fc.Arbitrary<Seed.TemplateLiteral> {
  return fc.tuple(
    fc.constant(byTag.template_literal),
    fc.array(templateLiteralPart($), $),
  )
}

function templateLiteralPart($: Config.byTypeName['template_literal']) {
  return fc.oneof(
    $,
    { arbitrary: fc.constant(null), weight: 1 },
    { arbitrary: fc.constant(undefined), weight: 2 },
    { arbitrary: fc.constant(''), weight: 3 },
    { arbitrary: fc.boolean(), weight: 4 },
    { arbitrary: fc.integer(), weight: 5 },
    { arbitrary: fc.bigInt(), weight: 6 },
    { arbitrary: fc.string(), weight: 7 },
    { arbitrary: TerminalMap.undefined(), weight: 8 },
    { arbitrary: TerminalMap.null(), weight: 9 },
    { arbitrary: TerminalMap.boolean(), weight: 10 },
    { arbitrary: BoundableMap.bigint(), weight: 11 },
    { arbitrary: BoundableMap.number(), weight: 12 },
    { arbitrary: BoundableMap.string(), weight: 13 },
    { arbitrary: ValueMap.literal(), weight: 14 },
  ) satisfies fc.Arbitrary<Seed.TemplateLiteral.Node>
}

function intersect(x: unknown, y: unknown) {
  return !isObject(x) ? y : !isObject(y) ? x : Object_assign(x, y)
}

const GeneratorByTag = {
  any: () => fc.anything(),
  boolean: () => fc.boolean(),
  date: () => fc.date(),
  file: () => file,
  nan: () => fc.constant(Number.NaN),
  never: () => fc.constant(void 0 as never),
  null: () => fc.constant(null),
  symbol: () => arbitrarySymbol,
  undefined: () => fc.constant(undefined),
  unknown: () => fc.anything(),
  void: () => fc.constant(void 0 as void),
  int: (x) => fc.integer(Bounds.intBoundsToIntegerConstraints(x[1])),
  bigint: (x) => fc.bigInt(Bounds.bigintBoundsToBigIntConstraints(x[1])),
  number: (x) => fc.double(Bounds.numberBoundsToDoubleConstraints(x[1])),
  string: (x) => fc.string(Bounds.stringBoundsToStringConstraints(x[1])),
  enum: (x) => fc.constantFrom(...Object_values(x[1])),
  literal: (x) => fc.constant(x[1]),
  template_literal: (x, $) => generateStringFromRegExp(z.templateLiteral(templateParts(x))._zod.pattern, $),
  array: (x) => fc.array(x[1], Bounds.arrayBoundsToArrayConstraints(x[2])),
  nonoptional: (x) => x[1].map((_) => _ === undefined ? {} : _),
  nullable: (x) => fc.option(x[1], { nil: null }),
  optional: (x) => fc.option(x[1], { nil: undefined }),
  readonly: (x) => x[1],
  set: (x) => x[1].map((v) => new globalThis.Set([v])),
  success: (x) => x[1],
  catch: (x) => x[1],
  map: (x) => fc.tuple(x[1][0], x[1][1]).map(([k, v]) => new Map([[k, v]])),
  record: (x) => fc.dictionary(fc.string().filter(removePrototypeMethods), x[1]),
  tuple: (x) => fc.tuple(...x[1]),
  union: (x) => fc.oneof(...(x[1] || [fc.constant(void 0 as never)])),
  lazy: (x) => x[1](),
  default: (x) => x[1],
  custom: (x) => x[1],
  pipe: (x) => x[1][1],
  object: (x) => fc.record(Object.fromEntries(x[1])),
  transform: (x) => x[1],
  intersection: (x) => fc.tuple(...x[1]).map(([x, y]) => intersect(x, y)),
  promise: () => PromiseSchemaIsUnsupported('GeneratorByTag'),
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
  return fold<fc.Arbitrary<unknown>>((x) => GeneratorByTag[bySeed[x[0]]](x as never, $))(seed)
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
  })(seed)
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
 * import { z } from 'zod/v4'
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
  'nonoptional',
  'pipe',
  'promise',
] satisfies SchemaGenerator.Options['exclude']

const seedsThatPreventGeneratingInvalidData = [
  'any',
  'catch',
  'custom',
  'default',
  'never',
  'nonoptional',
  'pipe',
  'promise',
  'symbol',
  'transform',
  'unknown',
] satisfies SchemaGenerator.Options['exclude']

/** 
 * ## {@link SeedReproduciblyValidGenerator `SeedReproduciblyValidGenerator`}
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
 * - {@link SeedReproduciblyInvalidGenerator `SeedReproduciblyInvalidGenerator`}
 * 
 * @example
 * import * as fc from 'fast-check'
 * import { z } from 'zod'
 * import { zx } from '@traversable/zod'
 * 
 * const [seed] = fc.sample(zx.SeedReproduciblyValidGenerator, 1)
 * const ZodSchema = zx.seedToSchema(seed)
 * const dataset = fc.sample(zx.seedToValidData(seed), 5)
 * 
 * const results = dataset.map((pt) => ZodSchema.safeParse(pt).success)
 * 
 * console.log(results) // => [true, true, true, true, true]
 */

export const SeedReproduciblyValidGenerator = SeedGenerator({ exclude: seedsThatPreventGeneratingValidData })['*']

/** 
 * ## {@link SeedReproduciblyInvalidGenerator `zx.SeedReproduciblyInvalidGenerator`}
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
 * - {@link SeedReproduciblyValidGenerator `zx.SeedReproduciblyValidGenerator`}
 * 
 * @example
 * import * as fc from 'fast-check'
 * import { z } from 'zod/v4'
 * import { zx } from '@traversable/zod'
 * 
 * const [seed] = fc.sample(zx.SeedReproduciblyInvalidGenerator, 1)
 * const ZodSchema = zx.seedToSchema(seed)
 * const dataset = fc.sample(zx.seedToInvalidData(seed), 5)
 * 
 * const results = dataset.map((pt) => ZodSchema.safeParse(pt).success)
 * 
 * console.log(results) // => [false, false, false, false, false]
 */
export const SeedReproduciblyInvalidGenerator = fn.pipe(
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
 * import { z } from 'zod/v4'
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
export function seedToSchema<T>(seed: Seed.F<T>): ZodType
export function seedToSchema<T>(seed: Seed.F<T>) {
  return fold<ZodType>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x[0] === byTag.any: return z.any()
      case x[0] === byTag.boolean: return z.boolean()
      case x[0] === byTag.date: return z.date()
      case x[0] === byTag.file: return z.file()
      case x[0] === byTag.nan: return z.nan()
      case x[0] === byTag.never: return z.never()
      case x[0] === byTag.null: return z.null()
      case x[0] === byTag.symbol: return z.symbol()
      case x[0] === byTag.undefined: return z.undefined()
      case x[0] === byTag.unknown: return z.unknown()
      case x[0] === byTag.void: return z.void()
      case x[0] === byTag.int: return z_int(x[1])
      case x[0] === byTag.bigint: return z_bigint(x[1])
      case x[0] === byTag.number: return z_number(x[1])
      case x[0] === byTag.string: return z_string(x[1])
      case x[0] === byTag.enum: return z.enum(x[1])
      case x[0] === byTag.literal: return z.literal(x[1])
      case x[0] === byTag.template_literal: return z.templateLiteral(templateParts(x))
      case x[0] === byTag.array: return z.array(x[1])
      case x[0] === byTag.nonoptional: return z.nonoptional(x[1])
      case x[0] === byTag.nullable: return z.nullable(x[1])
      case x[0] === byTag.optional: return z.optional(x[1])
      case x[0] === byTag.readonly: return z.readonly(x[1])
      case x[0] === byTag.set: return z.set(x[1])
      case x[0] === byTag.success: return z.success(x[1])
      case x[0] === byTag.catch: return z.catch(x[1], {})
      case x[0] === byTag.default: return z._default(x[1], {})
      case x[0] === byTag.intersection: return z.intersection(...x[1])
      case x[0] === byTag.map: return z.map(x[1][0], x[1][1])
      case x[0] === byTag.record: return z.record(z.string(), x[1])
      case x[0] === byTag.object: return z.object(Object.fromEntries(x[1]))
      case x[0] === byTag.tuple: return z.tuple(x[1] as [])
      case x[0] === byTag.union: return z.union(x[1])
      case x[0] === byTag.pipe: return z.pipe(...x[1])
      case x[0] === byTag.custom: return z.custom()
      case x[0] === byTag.transform: return z.transform(() => x[1])
      case x[0] === byTag.lazy: return z.lazy(x[1])
      case x[0] === byTag.promise: return PromiseSchemaIsUnsupported('seedToSchema')
    }
  })(seed)
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
