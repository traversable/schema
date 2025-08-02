import * as v from 'valibot'
import * as fc from 'fast-check'
import type { AnyTag, AnyValibotSchema, LowerBound } from '@traversable/valibot-types'

import type { newtype, inline } from '@traversable/registry'
import {
  Array_isArray,
  fn,
  getRandomElementOf,
  isKeyOf,
  isObject,
  isShowable,
  mutateRandomElementOf,
  mutateRandomValueOf,
  Number_isFinite,
  Number_isNatural,
  Number_isSafeInteger,
  Object_assign,
  Object_create,
  Object_entries,
  Object_fromEntries,
  Object_is,
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
import {
  PromiseSchemaIsUnsupported,
} from './utils.js'

const identifier = fc.stringMatching(new RegExp(PATTERN.identifier, 'u'))

function getDefaultValue(x: LowerBound) {
  return x.type === 'undefined' || x.type === 'void' ? undefined : {}
}

const enumValues = fc.uniqueArray(
  fc.tuple(
    identifier,
    identifier,
  ),
  {
    selector: ([k]) => k,
    minLength: 1,
  }
).map(Object_fromEntries)

const literalValue = fc.oneof(
  fc.string({ minLength: Bounds.defaults.string[0], maxLength: Bounds.defaults.string[1] }),
  fc.double({ min: Bounds.defaults.number[0], max: Bounds.defaults.number[1], noNaN: true }),
  fc.boolean(),
)

const TerminalMap = {
  any: fn.const(fc.tuple(fc.constant(byTag.any))),
  boolean: fn.const(fc.tuple(fc.constant(byTag.boolean))),
  date: fn.const(fc.tuple(fc.constant(byTag.date))),
  file: fn.const(fc.tuple(fc.constant(byTag.file))),
  blob: fn.const(fc.tuple(fc.constant(byTag.blob))),
  nan: fn.const(fc.tuple(fc.constant(byTag.nan))),
  never: fn.const(fc.tuple(fc.constant(byTag.never))),
  null: fn.const(fc.tuple(fc.constant(byTag.null))),
  undefined: fn.const(fc.tuple(fc.constant(byTag.undefined))),
  unknown: fn.const(fc.tuple(fc.constant(byTag.unknown))),
  void: fn.const(fc.tuple(fc.constant(byTag.void))),
  symbol: fn.const(fc.tuple(fc.constant(byTag.symbol))),
} satisfies { [K in keyof Seed.TerminalMap]: SeedBuilder<K> }

const bigIntBounds = Bounds.bigint(fc.bigInt())
const numberBounds = Bounds.number(fc.double())
const stringBounds = Bounds.string(fc.integer({ min: 0 }))

const BoundableMap = {
  bigint: fn.const(fc.tuple(fc.constant(byTag.bigint), bigIntBounds)),
  number: fn.const(fc.tuple(fc.constant(byTag.number), numberBounds)),
  string: fn.const(fc.tuple(fc.constant(byTag.string), stringBounds)),
} satisfies { [K in keyof Seed.BoundableMap]: SeedBuilder<K> }

const ValueMap = {
  enum: fn.const(fc.tuple(fc.constant(byTag.enum), enumValues)),
  literal: fn.const(fc.tuple(fc.constant(byTag.literal), literalValue)),
} satisfies { [K in keyof Seed.ValueMap]: SeedBuilder<K> }

const UnaryMap = {
  array: (tie) => fc.tuple(fc.constant(byTag.array), tie('*'), Bounds.array(fc.integer({ min: 0 }))),
  custom: (tie) => fc.tuple(fc.constant(byTag.custom), tie('*')),
  lazy: (tie) => fc.tuple(fc.constant(byTag.lazy), fc.func<[], unknown>(tie('*'))),
  optional: (tie) => fc.tuple(fc.constant(byTag.optional), tie('*')),
  non_optional: (tie) => fc.tuple(fc.constant(byTag.non_optional), tie('*')),
  undefinedable: (tie) => fc.tuple(fc.constant(byTag.undefinedable), tie('*')),
  nullable: (tie) => fc.tuple(fc.constant(byTag.nullable), tie('*')),
  non_nullable: (tie) => fc.tuple(fc.constant(byTag.non_nullable), tie('*')),
  nullish: (tie) => fc.tuple(fc.constant(byTag.nullish), tie('*')),
  non_nullish: (tie) => fc.tuple(fc.constant(byTag.non_nullish), tie('*')),
  record: (tie) => fc.tuple(fc.constant(byTag.record), tie('*')),
  set: (tie) => fc.tuple(fc.constant(byTag.set), tie('*')),
  object: (tie, $) => fc.tuple(
    fc.constant(byTag.object),
    fc.uniqueArray(fc.tuple(identifier, tie('*')), $)
  ),
  loose_object: (tie, $) => fc.tuple(
    fc.constant(byTag.loose_object),
    fc.uniqueArray(fc.tuple(identifier, tie('*')), $)
  ),
  strict_object: (tie, $) => fc.tuple(
    fc.constant(byTag.strict_object),
    fc.uniqueArray(fc.tuple(identifier, tie('*')), $)
  ),
  object_with_rest: (tie, $) => fc.tuple(
    fc.constant(byTag.object_with_rest),
    fc.uniqueArray(fc.tuple(identifier, tie('*')), $),
    tie('*'),
  ),
  tuple: (tie, $) => fc.tuple(fc.constant(byTag.tuple), fc.array(tie('*'), $)),
  loose_tuple: (tie, $) => fc.tuple(
    fc.constant(byTag.loose_tuple),
    fc.uniqueArray(fc.tuple(identifier, tie('*')), $)
  ),
  strict_tuple: (tie, $) => fc.tuple(
    fc.constant(byTag.strict_tuple),
    fc.uniqueArray(fc.tuple(identifier, tie('*')), $)
  ),
  tuple_with_rest: (tie, $) => fc.tuple(
    fc.constant(byTag.tuple_with_rest),
    fc.uniqueArray(fc.tuple(identifier, tie('*')), $),
    tie('*'),
  ),
  union: (tie, $) => fc.tuple(fc.constant(byTag.union), fc.array(tie('*'), $)),
  variant: (tie, $) => fc.tuple(
    fc.constant(byTag.variant),
    fc.uniqueArray(
      fc.tuple(
        identifier,
        fc.uniqueArray(
          fc.tuple(
            identifier,
            tie('*'),
          ),
          { selector: ([key]) => key }
        )
      ),
      { ...$, selector: ([uniqueTag]) => uniqueTag }
    ),
    identifier,
  ),
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
  map: (tie) => fc.tuple(fc.constant(byTag.map), fc.tuple(tie('*'), tie('*'))),
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
      // TODO: remove nullish coalesce operators
      .sort((l, r) => sortBias[l]! < sortBias[r]! ? -1 : sortBias[l]! > sortBias[r]! ? 1 : 0)

export function v_bigint(bounds?: Bounds.bigint): v.BigintSchema<undefined>
export function v_bigint(bounds: Bounds.bigint = Bounds.defaults.bigint) {
  const [min, max, multipleOf] = bounds
  let schema: LowerBound = v.bigint()
  if (typeof min === 'bigint') schema = v.pipe(schema as v.BigintSchema<undefined>, v.minValue(min))
  if (typeof max === 'bigint') schema = v.pipe(schema as v.BigintSchema<undefined>, v.maxValue(max))
  // if (typeof multipleOf === 'bigint') schema = schema.multipleOf(multipleOf)
  return schema
}

export function v_number(bounds?: Bounds.number): v.NumberSchema<undefined>
export function v_number(bounds: Bounds.number = Bounds.defaults.number) {
  const [min, max, multipleOf, minExcluded, maxExcluded] = bounds
  let schema: LowerBound = v.number()
  if (Number_isFinite(min))
    schema = minExcluded
      ? v.pipe(schema as v.NumberSchema<undefined>, v.gtValue(min))
      : v.pipe(schema as v.NumberSchema<undefined>, v.minValue(min))
  if (Number_isFinite(max))
    schema = maxExcluded
      ? v.pipe(schema as v.NumberSchema<undefined>, v.ltValue(max))
      : v.pipe(schema as v.NumberSchema<undefined>, v.maxValue(max))
  // if (typeof multipleOf === 'bigint') schema = schema.multipleOf(multipleOf)
  return schema
}

export function v_string(bounds?: Bounds.string): v.StringSchema<undefined>
export function v_string(bounds: Bounds.string = Bounds.defaults.string) {
  const [min, max, exactLength] = bounds
  let schema: LowerBound = v.string()
  if (Number_isNatural(exactLength)) {
    return v.pipe(
      schema as v.StringSchema<undefined>,
      v.minLength(exactLength),
      v.maxLength(exactLength),
    )
  } else {
    if (Number_isNatural(min)) schema = v.pipe(schema as v.StringSchema<undefined>, v.minLength(min))
    if (Number_isNatural(max)) schema = v.pipe(schema as v.StringSchema<undefined>, v.maxLength(max))
    return schema
  }
}

export function v_array<T extends LowerBound>(elementSchema: T, bounds?: Bounds.array): v.ArraySchema<T, undefined>
export function v_array<T extends LowerBound>(elementSchema: T, bounds: Bounds.array = Bounds.defaults.array) {
  const [min, max, exactLength] = bounds
  let schema: v.BaseSchema<any, any, any> = v.array(elementSchema)
  if (Number_isNatural(exactLength)) {
    return v.pipe(
      schema,
      v.minLength(exactLength),
      v.maxLength(exactLength)
    )
  } else {
    if (Number_isNatural(min)) schema = v.pipe(schema, v.minLength(min))
    if (Number_isNatural(max)) schema = v.pipe(schema, v.maxLength(max))
    return schema
  }
}

const branchNames = [
  'array',
  'object',
  'object_with_rest',
  'strict_object',
  'loose_object',
  'record',
  'tuple',
  'tuple_with_rest',
  'strict_tuple',
  'loose_object',
] as const satisfies AnyTag[]

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
const blob = fc.tuple(fileBits, fileName).map(([fileBits, filename]) => new Blob(fileBits))
const arbitrarySymbol = fc.oneof(fc.constant(Symbol()), fc.string().map((s) => Symbol.for(s)))

function entries<T>(model: fc.Arbitrary<T>, options?: fc.UniqueArrayConstraintsRecommended<[k: string, T], unknown>) {
  return fc.uniqueArray(
    fc.tuple(identifier, model),
    { selector: options?.selector || (([k]) => k), ...options },
  )
}

// const is = {
//   null: (x: unknown): x is [byTag['null']] => Array_isArray(x) && x[0] === byTag.null,
//   undefined: (x: unknown): x is [byTag['undefined']] => Array_isArray(x) && x[0] === byTag.undefined,
//   boolean: (x: unknown): x is [byTag['boolean']] => Array_isArray(x) && x[0] === byTag.boolean,
//   int: (x: unknown): x is [byTag['int'], Bounds.int] => Array_isArray(x) && x[0] === byTag.int,
//   number: (x: unknown): x is [byTag['number'], Bounds.number] => Array_isArray(x) && x[0] === byTag.number,
//   string: (x: unknown): x is [byTag['number'], Bounds.string] => Array_isArray(x) && x[0] === byTag.string,
//   literal: (x: unknown): x is [byTag['literal'], z.core.util.Literal] => Array_isArray(x) && x[0] === byTag.literal,
//   bigint: (x: unknown): x is [byTag['number'], Bounds.bigint] => Array_isArray(x) && x[0] === byTag.bigint,
// }

function intersect(x: unknown, y: unknown) {
  return !isObject(x) ? y : !isObject(y) ? x : Object_assign(x, y)
}

const GeneratorByTag = {
  any: () => fc.anything(),
  custom: () => fc.anything(),
  boolean: () => fc.boolean(),
  date: () => fc.date({ noInvalidDate: true }),
  file: () => file,
  blob: () => blob,
  nan: () => fc.constant(Number.NaN),
  never: () => fc.constant(void 0 as never),
  null: () => fc.constant(null),
  symbol: () => arbitrarySymbol,
  undefined: () => fc.constant(undefined),
  unknown: () => fc.anything(),
  void: () => fc.constant(void 0 as void),
  bigint: (x) => fc.bigInt(Bounds.bigintBoundsToBigIntConstraints(x[1])),
  number: (x) => fc.double(Bounds.numberBoundsToDoubleConstraints(x[1])),
  string: (x) => fc.string(Bounds.stringBoundsToStringConstraints(x[1])),
  enum: (x) => fc.constantFrom(...Object_values(x[1])),
  literal: (x) => fc.constant(x[1]),
  array: (x) => fc.array(x[1], Bounds.arrayBoundsToArrayConstraints(x[2])),
  optional: (x, _$, isProperty) => isProperty ? x[1] : fc.option(x[1], { nil: undefined }),
  non_optional: (x) => x[1].map((_) => _ === undefined ? {} : _),
  undefinedable: (x) => fc.option(x[1], { nil: undefined }),
  nullable: (x) => fc.option(x[1], { nil: null }),
  non_nullable: (x) => x[1].map((_) => _ === null ? {} : _),
  nullish: (x) => fc.oneof(x[1], fc.constant(undefined), fc.constant(null)),
  non_nullish: (x) => x[1].map((_) => _ == null ? {} : _),
  set: (x) => x[1].map((v) => new globalThis.Set([v])),
  map: (x) => fc.tuple(x[1][0], x[1][1]).map(([k, v]) => new Map([[k, v]])),
  record: (x) => fc.dictionary(identifier, x[1]),
  tuple: (x) => fc.tuple(...x[1]),
  loose_tuple: (x) => fc.tuple(...x[1]),
  strict_tuple: (x) => fc.tuple(...x[1]),
  tuple_with_rest: (x) => fc.tuple(fc.tuple(...x[1]), fc.array(x[2])).map(([xs, rest]) => [...xs, ...rest]),
  union: (x) => fc.oneof(...(x[1] || [fc.constant(void 0 as never)])),
  lazy: (x) => x[1](),
  object: (x) => fc.record(Object.fromEntries(x[1])),
  strict_object: (x) => fc.record(Object.fromEntries(x[1])),
  loose_object: (x) => fc.record(Object.fromEntries(x[1])),
  object_with_rest: (x) => fc.tuple(fc.record(Object.fromEntries(x[1])), fc.dictionary(identifier, x[2])).map(([xs, rest]) => ({ ...rest, ...xs })),
  intersect: (x) => fc.tuple(...x[1]).map(([x, y]) => intersect(x, y)),
  variant: (x) => fc.oneof(
    ...x[1].map(
      ([tag, entries]) => fc.record(
        Object_assign(
          Object_create(null),
          Object_fromEntries(entries),
          { [x[2]]: fc.constant(tag) }
        )
      )
    )
  ),
  /**
   * variant: (tie, $) => fc.tuple(
   *   fc.constant(byTag.variant),
   *   identifier,
   *   fc.uniqueArray(
   *     fc.tuple(
   *       identifier,
   *       fc.dictionary(identifier, tie('*'), $),
   *     ), 
   *     { selector: ([uniqueTag]) => uniqueTag }
   *   )
   * ).map(
   *   ([seedTag, discriminator, xs]) => [
   *     seedTag,
   *     xs.map(([uniqueTag, x]) => ({ ...x, [discriminator]: uniqueTag })),
   *   ] satisfies [any, any]
   * ),
   */
  // fc.oneof(...(x[1] || [fc.constant(void 0 as never)]))
  promise: () => PromiseSchemaIsUnsupported('GeneratorByTag'),
} satisfies {
  [K in keyof Seed]: (x: Seed<fc.Arbitrary<unknown>>[K], $: Config<never>, isProperty: boolean) => fc.Arbitrary<unknown>
}

/**
 * ## {@link seedToValidDataGenerator `seedToValidDataGenerator`}
 * 
 * Convert a seed into an valid data generator.
 * 
 * Valid in this context means that it will always satisfy the valibot schema that the seed produces.
 * 
 * To convert a seed to a valibot schema, use {@link seedToSchema `seedToSchema`}.
 * 
 * To convert a seed to an _invalid_ data generator, use {@link seedToInvalidDataGenerator `seedToInvalidDataGenerator`}.
 */
export function seedToValidDataGenerator<T>(seed: Seed.F<T>, options?: Config.Options): fc.Arbitrary<unknown>
export function seedToValidDataGenerator<T>(seed: Seed.F<T>, options?: Config.Options): fc.Arbitrary<unknown> {
  const $ = Config.parseOptions(options)
  return fold<fc.Arbitrary<unknown>>((x, isProperty) => GeneratorByTag[bySeed[x[0]]](x as never, $, isProperty || x[0] === 7500))(seed as never)
}

/**
 * ## {@link seedToInvalidDataGenerator `seedToInvalidDataGenerator`}
 * 
 * Convert a seed into an invalid data generator.
 * 
 * Invalid in this context means that it will never satisfy the valibot schema that the seed produces.
 * 
 * To convert a seed to a valibot schema, use {@link seedToSchema `seedToSchema`}.
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
      default: return GeneratorByTag[bySeed[x[0]]](x as never, $, false)
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
 * **Note:** support for `options.minDepth` is experimental. If you use it, be advised that
 * even with a minimum depth of 1, the schemas produced will be quite large. Using this option
 * in your CI/CD pipeline is not recommended.
 * 
 * See also:
 * - {@link SeedGenerator `SeedGenerator`}
 * 
 * @example
 * import * as fc from 'fast-check'
 * import * as v from 'valibot'
 * import { vxTest } from '@traversable/valibot-test'
 * 
 * const Json = vxTest.SeedGenerator({ include: ['null', 'boolean', 'number', 'string', 'array', 'object'] })
 * const [jsonNumber, jsonObject, anyJson] = [
 *   fc.sample(Json.number, 1)[0],
 *   fc.sample(Json.object, 1)[0],
 *   fc.sample(Json['*'], 1)[0],
 * ] as const
 *
 * console.log(JSON.stringify(jsonNumber))
 * // => [200,[2.96e-322,1,null,false,true]]
 * 
 * console.log(vxTest.toString(vxTest.seedToSchema(jsonNumber)))
 * // => v.pipe(v.number(), v.maxValue(2.96e-322), v.ltValue(1)
 * 
 * console.log(JSON.stringify(jsonObject))
 * // => [7500,[["n;}289K~",[250,[null,null]]]]]
 * 
 * console.log(vxTest.toString(vxTest.seedToSchema(jsonObject)))
 * // => v.object({ "n;}289K~": v.string() })
 * 
 * console.log(anyJson)
 * // => [250,[23,64]]
 * 
 * console.log(vxTest.toString(vxTest.seedToSchema(anyJson)))
 * // => v.pipe(v.string(), v.minValue(23), v.maxValue(64))
 */
export const SeedGenerator = Gen(SeedMap)

const seedsThatPreventGeneratingValidData = [
  'custom',
  'never',
  'non_optional',
  'non_nullable',
  'non_nullish',
  'promise',
] satisfies SchemaGenerator.Options['exclude']

const seedsThatPreventGeneratingInvalidData = [
  ...seedsThatPreventGeneratingValidData,
  'any',
  'promise',
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
 * Note that certain schemas make generating valid data impossible 
 * (like {@link v.never `v.never`}). For this reason, those schemas are not seeded.
 * 
 * To see the list of excluded schemas, see 
 * {@link seedsThatPreventGeneratingValidData `seedsThatPreventGeneratingValidData`}.
 * 
 * See also:
 * - {@link SeedInvalidDataGenerator `SeedInvalidDataGenerator`}
 * 
 * @example
 * import * as fc from 'fast-check'
 * import * as v from 'valibot'
 * import { vxTest } from '@traversable/valibot-test'
 * 
 * const [seed] = fc.sample(vxTest.SeedValidDataGenerator, 1)
 * const ValibotSchema = vxTest.seedToSchema(seed)
 * const dataset = fc.sample(vxTest.seedToValidData(seed), 5)
 * 
 * const results = dataset.map((pt) => ValibotSchema.safeParse(pt).success)
 * 
 * console.log(results) // => [true, true, true, true, true]
 */

export const SeedValidDataGenerator = SeedGenerator({ exclude: seedsThatPreventGeneratingValidData })['*']

/** 
 * ## {@link SeedInvalidDataGenerator `vxTest.SeedInvalidDataGenerator`}
 * 
 * A seed generator that can be interpreted to produce reliably invalid data.
 * 
 * This was originally developed to test for parity between various schema libraries.
 * 
 * Note that certain schemas make generating invalid data impossible 
 * (like {@link v.any `v.any`}). For this reason, those schemas are not seeded.
 * 
 * To see the list of excluded schemas, see 
 * {@link seedsThatPreventGeneratingInvalidData `vxTest.seedsThatPreventGeneratingInvalidData`}.
 * 
 * See also:
 * - {@link SeedValidDataGenerator `vxTest.SeedValidDataGenerator`}
 * 
 * @example
 * import * as fc from 'fast-check'
 * import * as v from 'valibot'
 * import { vxTest } from '@traversable/valibot-test'
 * 
 * const [seed] = fc.sample(vxTest.SeedInvalidDataGenerator, 1)
 * const ValibotSchema = vxTest.seedToSchema(seed)
 * const dataset = fc.sample(vxTest.seedToInvalidData(seed), 5)
 * 
 * const results = dataset.map((pt) => ValibotSchema.safeParse(pt).success)
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
 * ## {@link SchemaGenerator `vxTest.SchemaGenerator`}
 * 
 * A valibot schema generator that can be interpreted to produce an arbitrary valibot schema.
 * 
 * The generator supports a wide range of configuration options that are discoverable via the
 * optional `options` argument.
 * 
 * Many of those options are forwarded to the corresponding `fast-check` arbitrary.
 * 
 * **Note:** support for `options.minDepth` is experimental. If you use it, be advised that
 * _even with a minimum depth of 1_, the schemas produced will be **quite** large. Using this option
 * in your CI/CD pipeline is _not_ recommended.
 * 
 * See also:
 * - {@link SeedGenerator `vxTest.SeedGenerator`}
 * 
 * @example
 * import * as fc from 'fast-check'
 * import * as v from 'valibot'
 * import { vxTest } from '@traversable/valibot-test'
 * 
 * const tenSchemas = fc.sample(vxTest.SchemaGenerator({
 *   include: ['null', 'boolean', 'number', 'string', 'array', 'object'] 
 * }), 10)
 * 
 * tenSchemas.forEach((s) => console.log(vxTest.toString(s)))
 * // => v.number()
 * // => v.pipe(v.string(), v.minValue(9.1e-53))
 * // => v.null()
 * // => v.array(v.boolean())
 * // => v.boolean()
 * // => v.object({ "": v.object({ "/d2P} {/": v.boolean() }), "svH2]L'x": v.pipe(v.number(), v.ltValue(-65536)) })
 * // => v.null()
 * // => v.string()
 * // => v.array(v.array(v.null()))
 * // => v.object({ "y(Qza": v.boolean(), "G1S\\U 4Y6i": v.object({ "YtO3]ia0cM": v.boolean() }) })
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
 * ## {@link seedToSchema `vxTest.seedToSchema`}
 * 
 * Interpreter that converts a seed value into its corresponding valibot schema.
 * 
 * To get a seed, use {@link SeedGenerator `vxTest.SeedGenerator`}.
 */
export function seedToSchema<T extends Seed.Composite>(seed: T): Seed.schemaFromComposite[T[0]]
export function seedToSchema<T>(seed: Seed.F<T>): AnyValibotSchema
export function seedToSchema<T>(seed: Seed.F<T>) {
  return fold<LowerBound>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x[0] === byTag.any: return v.any()
      case x[0] === byTag.custom: return v.custom(() => true)
      case x[0] === byTag.boolean: return v.boolean()
      case x[0] === byTag.date: return v.date()
      case x[0] === byTag.file: return v.file()
      case x[0] === byTag.blob: return v.blob()
      case x[0] === byTag.nan: return v.nan()
      case x[0] === byTag.never: return v.never()
      case x[0] === byTag.null: return v.null()
      case x[0] === byTag.symbol: return v.symbol()
      case x[0] === byTag.undefined: return v.undefined()
      case x[0] === byTag.unknown: return v.unknown()
      case x[0] === byTag.void: return v.void()
      case x[0] === byTag.bigint: return v_bigint(x[1])
      case x[0] === byTag.number: return v_number(x[1])
      case x[0] === byTag.string: return v_string(x[1])
      case x[0] === byTag.enum: return v.enum(x[1])
      case x[0] === byTag.literal: return v.literal(x[1])
      case x[0] === byTag.array: return v.array(x[1])
      case x[0] === byTag.optional: return v.optional(x[1])
      case x[0] === byTag.non_optional: return v.nonOptional(x[1])
      case x[0] === byTag.undefinedable: return v.undefinedable(x[1])
      case x[0] === byTag.nullable: return v.nullable(x[1])
      case x[0] === byTag.non_nullable: return v.nonNullable(x[1])
      case x[0] === byTag.nullish: return v.nullish(x[1])
      case x[0] === byTag.non_nullish: return v.nonNullish(x[1])
      case x[0] === byTag.set: return v.set(x[1])
      case x[0] === byTag.intersect: return v.intersect(x[1])
      case x[0] === byTag.lazy: return v.lazy(x[1])
      case x[0] === byTag.map: return v.map(x[1][0], x[1][1])
      case x[0] === byTag.record: return v.record(v.string(), x[1])
      case x[0] === byTag.object: return v.object(Object.fromEntries(x[1]))
      case x[0] === byTag.loose_object: return v.looseObject(Object.fromEntries(x[1]))
      case x[0] === byTag.strict_object: return v.strictObject(Object.fromEntries(x[1]))
      case x[0] === byTag.object_with_rest: return v.objectWithRest(Object.fromEntries(x[1]), x[2])
      case x[0] === byTag.tuple: return v.tuple(x[1])
      case x[0] === byTag.loose_tuple: return v.looseTuple(x[1])
      case x[0] === byTag.strict_tuple: return v.strictTuple(x[1])
      case x[0] === byTag.tuple_with_rest: return v.tupleWithRest(x[1], x[2])
      case x[0] === byTag.strict_object: return v.strictObject(Object.fromEntries(x[1]))
      case x[0] === byTag.object_with_rest: return v.objectWithRest(Object.fromEntries(x[1]), x[2])
      case x[0] === byTag.union: return v.union(x[1])
      case x[0] === byTag.variant: return v.variant(x[2], x[1].map(
        ([tag, entries]) => v.object({ ...Object_fromEntries(entries), [x[2]]: v.literal(tag) }))
      )
      case x[0] === byTag.promise: return PromiseSchemaIsUnsupported('seedToSchema')
    }
  })(seed as never)
}

/** 
 * ## {@link seedToValidData `seedToValidData`}
 * 
 * Given a seed, generates an single example of valid data.
 * 
 * Valid in this context means that it will always satisfy the valibot schema that the seed produces.
 * 
 * To use it, you'll need to have [fast-check](https://github.com/dubzzz/fast-check) installed.
 * 
 * To convert a seed to a valibot schema, use {@link seedToSchema `seedToSchema`}.
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
 * Invalid in this context means that it will never satisfy the valibot schema that the seed produces.
 * 
 * To use it, you'll need to have [fast-check](https://github.com/dubzzz/fast-check) installed.
 * 
 * To convert a seed to a valibot schema, use {@link seedToSchema `seedToSchema`}.
 * 
 * To convert a seed to a single example of _valid_ data, use {@link seedToValidData `seedToValidData`}.
 */
export const seedToInvalidData = fn.flow(
  seedToInvalidDataGenerator,
  (model) => fc.sample(model, 1)[0],
)
