import * as fc from 'fast-check'
import * as F from '@traversable/zod-types'
import { fn, Object_create, Object_assign, PATTERN, has } from '@traversable/registry'
import { z } from 'zod'
import {
  numberBagToDoubleConstraints,
  integerBagToIntegerConstraints as integerConstraints,
  bigintBagToBigintConstraints as bigintConstraints,
  stringBagToStringConstraints as stringConstraints,
} from './generator-bounds.js'

export type CatchAllConstraints = fc.DictionaryConstraints
export type RestConstraints = fc.ArrayConstraints
export type AnyConstraints = fc.ObjectConstraints
export type ArrayConstraints = fc.ArrayConstraints
export type BigIntConstraints = fc.BigIntConstraints
export type CatchConstraints = fc.OneOfConstraints
export type DateConstraints = fc.DateConstraints
export type DefaultConstraints = fc.OneOfConstraints
export type EnumConstraints = fc.OneOfConstraints & fc.StringConstraints & fc.IntegerConstraints
export type FileConstraints = fc.WebUrlConstraints & fc.IntArrayConstraints & fc.ArrayConstraints
export type IntegerConstraints = fc.IntegerConstraints
export type LiteralConstraints = fc.StringConstraints
export type MapConstraints = { minItems?: number, maxItems?: number }
export type NumberConstraints = fc.DoubleConstraints
export type ObjectConstraints = CatchAllConstraints
export type PipeConstraints = fc.OneOfConstraints
export type PrefaultConstraints = fc.OneOfConstraints
export type RecordConstraints = fc.DictionaryConstraints
export type SetConstraints = { minItems?: number, maxItems?: number }
export type StringConstraints = fc.StringConstraints
export type SymbolConstraints = fc.StringConstraints & { uniqueSymbol?: boolean }
export type TemplateLiteralConstraints = fc.StringMatchingConstraints
export type TupleConstraints = RestConstraints
export type UnionConstraints = fc.OneOfConstraints & { minMembers?: number, maxMembers?: number }
export type UnknownConstraints = fc.ObjectConstraints

export type Options = {
  any?: AnyConstraints
  array?: ArrayConstraints
  bigint?: BigIntConstraints
  boolean?: never
  catch?: CatchConstraints
  custom?: never
  date?: DateConstraints
  default?: DefaultConstraints
  enum?: EnumConstraints
  file?: FileConstraints
  int?: IntegerConstraints
  intersection?: never
  lazy?: never
  literal?: LiteralConstraints
  map?: MapConstraints
  nan?: never
  never?: never
  nonoptional?: never
  null?: never
  nullable?: never
  number?: NumberConstraints
  object?: ObjectConstraints
  optional?: never
  pipe?: PipeConstraints
  prefault?: PrefaultConstraints
  promise?: never
  readonly?: never
  record?: RecordConstraints
  set?: SetConstraints
  string?: StringConstraints
  success?: never
  symbol?: SymbolConstraints
  template_literal?: TemplateLiteralConstraints
  transform?: never
  tuple?: TupleConstraints
  undefined?: never
  union?: UnionConstraints
  unknown?: UnknownConstraints
  void?: never
}

export type Override<K extends F.AnyTypeName> = (
  traversed: F.Z.Lookup<K, fc.Arbitrary<unknown>>,
  options?: Options[K]
) => fc.Arbitrary<z.infer<F.Z.ZodLookup<K>>>

export type Overrides = { [K in keyof F.Z.Catalog]+?: Override<K> }

const mapConstraints = ($: MapConstraints = {}): fc.ArrayConstraints => ({
  ...$,
  minLength: $.minItems,
  maxLength: $.maxItems,
})

const setConstraints: ($?: SetConstraints) => fc.ArrayConstraints = mapConstraints

const identifier = fc.stringMatching(new RegExp(PATTERN.identifier))

const file = ($?: FileConstraints) => fc.tuple(
  fc.array(fc.int8Array($), $),
  fc.tuple(
    fc.webUrl($).map((webUrl) => new URL(webUrl).pathname),
    fc.string({ minLength: 2, maxLength: 3 })
  ).map(([pathName, ext]) => `${pathName}.${ext}`),
).map((args) => new File(...args))

const intersect = ([l, r]: [l: unknown, r: unknown]): unknown => Object_assign(Object_create(null), l, r)

function requiredKeys(x: { [k: string]: z.core.$ZodType }): fc.RecordConstraints<string> {
  const requiredKeys = Object.entries(x).filter(([, v]) => !F.isOptional(v)).map(([k]) => k)
  return requiredKeys.length === 0 ? {} : { requiredKeys }
}

const defaults = {
  number: { noNaN: true, noDefaultInfinity: true },
  date: { noInvalidDate: true },
  template_literal: {},
} satisfies Options

const numberConstraints = fn.flow(
  numberBagToDoubleConstraints,
  (constraints) => ({ ...defaults.number, ...constraints }),
)

const isVersion = (x: unknown) => x === 4 || x === 6 || x === 7

function applyStringFormat(x: z.ZodString, $: Options['string']): fc.Arbitrary<string> {
  const { format } = x
  const patterns = Array.from(x._zod.bag.patterns ?? [])
  const uuidVersion = has('_zod', 'def', 'version', isVersion)(x) ? x._zod.def.version : undefined
  if (format === 'regex' && patterns.length > 0) {
    return fc.oneof(
      ...patterns.map((pattern) => fc.stringMatching(pattern)),
    )
  } else {
    switch (format) {
      case 'url': return fc.webUrl()
      case 'ipv4': return fc.ipV4()
      case 'ipv6': return fc.ipV6()
      case 'uuid': return fc.uuid({ version: uuidVersion })
      case 'base64': return fc.base64String($)
      case 'email': return fc.emailAddress()
      case 'ulid': return fc.ulid()
      case 'nanoid': return fc.stringMatching(z.regexes.nanoid)
      case 'ksuid': return fc.stringMatching(z.regexes.ksuid)
      case 'xid': return fc.stringMatching(z.regexes.xid)
      case 'e164': return fc.stringMatching(z.regexes.e164)
      case 'emoji': return fc.stringMatching(z.regexes.emoji())
      case 'cuid': return fc.stringMatching(z.regexes.cuid)
      case 'cuid2': return fc.stringMatching(z.regexes.cuid2)
      default: return fc.string($)
    }
  }
}

const dateConstraints = ($?: Options['date']): fc.DateConstraints => ({ ...defaults.date, ...$ })

const unfuzzable = [
  'custom',
  'default',
  'prefault',
  'promise',
  'pipe',
  'nonoptional',
  'never',
] as const

export declare namespace fuzz {
  export {
    Options,
    Override,
    Overrides,
    /* constraints */
    CatchAllConstraints,
    RestConstraints,
    AnyConstraints,
    ArrayConstraints,
    BigIntConstraints,
    CatchConstraints,
    DateConstraints,
    DefaultConstraints,
    EnumConstraints,
    FileConstraints,
    IntegerConstraints,
    LiteralConstraints,
    MapConstraints,
    NumberConstraints,
    ObjectConstraints,
    PipeConstraints,
    PrefaultConstraints,
    RecordConstraints,
    SetConstraints,
    StringConstraints,
    SymbolConstraints,
    TemplateLiteralConstraints,
    TupleConstraints,
    UnionConstraints,
    UnknownConstraints,
  }
}

fuzz.unfuzzable = unfuzzable

/**
 * ## {@link fuzz `zxTest.fuzz`}
 * 
 * Convert a Zod schema into a [fast-check](https://github.com/dubzzz/fast-check) arbitrary.
 * 
 * Configure how fuzzed values will be generated via type {@link options `options`} argument.
 * 
 * Override individual arbitraries via the {@link overrides `overrides`} argument.
 * 
 * **Note:** {@link fuzz `zxTest.fuzz`} is the __only__ schema-to-generator function that has itself
 * been fuzz tested to ensure that no matter what schema you give it, the data-generator that `fuzz`
 * returns will always produce valid data.
 * 
 * The only known exceptions are schemas that make it impossible to generate valid data. For example:
 * 
 * - `z.never` 
 * - `z.nonoptional(z.undefined())`
 * - `z.enum([])`
 * - `z.union([])`
 * - `z.intersection(z.number(), z.string())`
 * 
 * See also:
 * - {@link Options `fuzz.Options`}
 * - {@link Overrides `fuzz.Overrides`}
 * - the [fast-check docs](https://fast-check.dev)
 * 
 * @example
 * import * as vi from 'vitest'
 * import * as fc from 'fast-check' * import { fuzz } from '@traversable/zod-test'
 * 
 * const Schema = z.record(
 *   z.string(), 
 *   z.union(
 *     z.number(),
 *     z.string(),
 *   )
 * )
 * 
 * const generator = fuzz(
 *   Schema, 
 *   { record: { minKeys: 1 }, number: { noDefaultInfinity: true } },
 *   { string: () => fc.stringMatching(/[\S\s]+[\S]+/) },
 * )
 * 
 * vi.test('fuzz test example', () => {
 *   fc.assert(
 *     fc.property(generator, (data) => {
 *       vi.assert.doesNotThrow(() => Schema.parse(data))
 *     }),
 *     { numRuns: 1_000 }
 *   )
 * })
 */

export function fuzz<T>(type: z.ZodType<T>, options?: fuzz.Options, overrides?: fuzz.Overrides): fc.Arbitrary<T>
export function fuzz<T>(
  type: z.ZodType<T>,
  $: fuzz.Options = defaults,
  overrides: fuzz.Overrides = {},
) {
  return F.fold<fc.Arbitrary<unknown>>((x, _, original) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case F.tagged('custom')(x):
        throw Error(`Unsupported schema type: ${(x._zod.def as any).type}`)
      case F.tagged('any')(x):
        return overrides.any?.(x, $.any)
          || fc.anything()
      case F.tagged('unknown')(x):
        return overrides.unknown?.(x, $.unknown)
          || fc.anything()
      case F.tagged('never')(x):
        return overrides.never?.(x, $.never)
          || fc.constant(void 0)
      case F.tagged('void')(x):
        return overrides.void?.(x, $.void)
          || fc.constant(void 0)
      case F.tagged('undefined')(x):
        return overrides.undefined?.(x, $.undefined)
          || fc.constant(undefined)
      case F.tagged('null')(x):
        return overrides.null?.(x, $.null)
          || fc.constant(null)
      case F.tagged('symbol')(x):
        return overrides.symbol?.(x, $.symbol)
          || fc.string().map(Symbol.for)
      case F.tagged('boolean')(x):
        return overrides.boolean?.(x, $.boolean)
          || fc.boolean()
      case F.tagged('nan')(x):
        return overrides.nan?.(x, $.nan)
          || fc.constant(Number.NaN)
      case F.tagged('int')(x):
        return overrides.int?.(x, integerConstraints(x._zod.bag, $.int))
          || fc.integer(integerConstraints(x._zod.bag, $.int))
      case F.tagged('bigint')(x):
        return overrides.bigint?.(x, bigintConstraints(x._zod.bag, $.bigint))
          || fc.bigInt(bigintConstraints(x._zod.bag, $.bigint))
      case F.tagged('number')(x):
        return overrides.number?.(x, numberConstraints(x._zod.bag, $.number))
          || fc.double(numberConstraints(x._zod.bag, $.number))
      case F.tagged('string')(x):
        return overrides.string?.(x, stringConstraints(x, $.string))
          || applyStringFormat(x as z.ZodString, stringConstraints(x, $.string))
      // fc.string(stringConstraints(x, $.string))
      case F.tagged('date')(x):
        return overrides.date?.(x, dateConstraints($.date))
          || fc.date(dateConstraints($.date))
      case F.tagged('file')(x):
        return overrides.file?.(x, $.file)
          || file($.file)
      case F.tagged('literal')(x):
        return overrides.literal?.(x, $.literal)
          || fc.constantFrom(...x._zod.def.values)
      case F.tagged('template_literal')(x):
        return overrides.template_literal?.(x, $.template_literal)
          || (
            x._zod.pattern.source === '^$' ? fc.constant('')
              : fc.stringMatching(x._zod.pattern)
          )
      case F.tagged('enum')(x):
        return overrides.enum?.(x, $.enum)
          || fc.constantFrom(...x._zod.values)
      case F.tagged('lazy')(x):
        return overrides.lazy?.(x, $.lazy)
          || x._zod.def.getter()
      case F.tagged('success')(x):
        return overrides.success?.(x, $.success)
          || x._zod.def.innerType
      case F.tagged('readonly')(x):
        return overrides.readonly?.(x, $.readonly)
          || x._zod.def.innerType
      case F.tagged('optional')(x):
        return overrides.optional?.(x, $.optional)
          || fc.oneof($.optional ?? {}, x._zod.def.innerType, fc.constant(undefined))
      case F.tagged('nonoptional')(x):
        return overrides.nonoptional?.(x, $.nonoptional)
          || x._zod.def.innerType
      case F.tagged('nullable')(x):
        return overrides.nullable?.(x, $.nullable)
          || fc.oneof($.nullable ?? {}, x._zod.def.innerType, fc.constant(null))
      case F.tagged('array')(x):
        return overrides.array?.(x, $.array)
          || fc.array(x._zod.def.element, $.array)
      case F.tagged('set')(x): return overrides.set?.(x, $.set)
        || fc.array(x._zod.def.valueType, setConstraints($.set)).map((xs) => new Set(xs))
      case F.tagged('map')(x):
        return overrides.map?.(x, $.map)
          || fc.array(fc.tuple(x._zod.def.keyType, x._zod.def.valueType), mapConstraints($.map)).map((xs) => new Map(xs))
      case F.tagged('record')(x):
        return overrides.record?.(x, $.record)
          || fc.dictionary(x._zod.def.keyType as fc.Arbitrary<string>, x._zod.def.valueType)
      case F.tagged('union')(x):
        return overrides.union?.(x, $.union)
          || fc.oneof($.union ?? {}, ...x._zod.def.options)
      case F.tagged('promise')(x):
        return overrides.promise?.(x, $.promise)
          || x._zod.def.innerType.map((v) => Promise.resolve(v))
      case F.tagged('pipe')(x):
        return overrides.pipe?.(x, $.pipe)
          || fc.oneof($.pipe ?? {}, x._zod.def.out, x._zod.def.in)
      case F.tagged('transform')(x):
        return overrides.transform?.(x, $.transform)
          || x._zod.def.transform(void 0)
      case F.tagged('catch')(x):
        return overrides.catch?.(x, $.catch)
          || fc.oneof($.catch ?? {}, x._zod.def.innerType, fc.constant(x._zod.def.catchValue))
      case F.tagged('default')(x):
        return overrides.default?.(x, $.default)
          || fc.oneof($.default ?? {}, x._zod.def.innerType, fc.constant(x._zod.def.defaultValue))
      case F.tagged('prefault')(x):
        return overrides.prefault?.(x, $.prefault)
          || fc.oneof($.prefault ?? {}, x._zod.def.innerType, fc.constant(x._zod.def.defaultValue))
      case F.tagged('intersection')(x):
        return overrides.intersection?.(x, $.intersection)
          || fc.tuple(x._zod.def.left, x._zod.def.right).map(intersect)
      case F.tagged('tuple')(x):
        return overrides.tuple?.(x, $.tuple)
          || (
            !x._zod.def.rest
              ? fc.tuple(...x._zod.def.items)
              : fc.tuple(fc.tuple(...x._zod.def.items), fc.array(x._zod.def.rest)).map(([xs, rest]) => [...xs, ...rest])
          )
      case F.tagged('object')(x): {
        if (!F.tagged('object', original)) throw Error('Illegal state')
        return overrides.object?.(x, $.object)
          || (
            !x._zod.def.catchall
              ? fc.record(x._zod.def.shape, requiredKeys(original._zod.def.shape))
              : fc.tuple(
                fc.record(x._zod.def.shape, requiredKeys(original._zod.def.shape)),
                fc.dictionary(identifier, x._zod.def.catchall)
              ).map(([shape, catchall]) => ({ ...catchall, ...shape }))
          )
      }
    }
  })(type)
}
