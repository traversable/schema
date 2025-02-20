import { z } from 'zod'

import type * as T from '@traversable/registry'
import { fn, has, parseKey } from '@traversable/registry'
import { Json } from '@traversable/json'
import * as Print from './print.js'

export {
  toString,
}

type _ = unknown

const Array_isArray
  : <T>(u: unknown) => u is readonly T[]
  = globalThis.Array.isArray

const tag = z.ZodFirstPartyTypeKind
type Tag = typeof Tag
const Tag = {
  intersection: `${tag[tag.ZodIntersection]}` as const,
  union: `${tag[tag.ZodUnion]}` as const,
  discriminatedUnion: `${tag[tag.ZodDiscriminatedUnion]}` as const,
  any: `${tag.ZodAny}` as const,
  array: `${tag[tag.ZodArray]}` as const,
  bigint: `${tag[tag.ZodBigInt]}` as const,
  boolean: `${tag[tag.ZodBoolean]}` as const,
  branded: `${tag[tag.ZodBranded]}` as const,
  catch: `${tag[tag.ZodCatch]}` as const,
  date: `${tag[tag.ZodDate]}` as const,
  default: `${tag[tag.ZodDefault]}` as const,
  effects: `${tag[tag.ZodEffects]}` as const,
  enum: `${tag[tag.ZodEnum]}` as const,
  function: `${tag[tag.ZodFunction]}` as const,
  lazy: `${tag[tag.ZodLazy]}` as const,
  literal: `${tag[tag.ZodLiteral]}` as const,
  map: `${tag[tag.ZodMap]}` as const,
  NaN: `${tag[tag.ZodNaN]}` as const,
  nativeEnum: `${tag[tag.ZodNativeEnum]}` as const,
  never: `${tag[tag.ZodNever]}` as const,
  null: `${tag[tag.ZodNull]}` as const,
  nullable: `${tag[tag.ZodNullable]}` as const,
  number: `${tag[tag.ZodNumber]}` as const,
  object: `${tag[tag.ZodObject]}` as const,
  optional: `${tag[tag.ZodOptional]}` as const,
  pipeline: `${tag[tag.ZodPipeline]}` as const,
  promise: `${tag[tag.ZodPromise]}` as const,
  readonly: `${tag[tag.ZodReadonly]}` as const,
  record: `${tag[tag.ZodRecord]}` as const,
  set: `${tag[tag.ZodSet]}` as const,
  string: `${tag[tag.ZodString]}` as const,
  symbol: `${tag[tag.ZodSymbol]}` as const,
  tuple: `${tag[tag.ZodTuple]}` as const,
  undefined: `${tag[tag.ZodUndefined]}` as const,
  unknown: `${tag[tag.ZodUnknown]}` as const,
  void: `${tag[tag.ZodVoid]}` as const,
}

declare namespace Z {
  type lookup<K extends keyof Tag, S = _> = Z.byTag<S>[Tag[K]]
  type byTag<S> = {
    [Tag.intersection]: Z.AllOf<S>
    [Tag.union]: Z.AnyOf<S>
    [Tag.discriminatedUnion]: Z.OneOf<S>
    [Tag.any]: Z.Any
    [Tag.array]: Z.Array<S>
    [Tag.bigint]: Z.BigInt
    [Tag.boolean]: Z.Boolean
    [Tag.branded]: Z.Branded<S>
    [Tag.catch]: Z.Catch<S>
    [Tag.date]: Z.Date
    [Tag.default]: Z.Default<S>
    [Tag.effects]: Z.Effect<S>
    [Tag.enum]: Z.Enum
    [Tag.function]: Z.Function<S>
    [Tag.lazy]: Z.Lazy<S>
    [Tag.literal]: Z.Literal<S>
    [Tag.map]: Z.Map<S>
    [Tag.NaN]: Z.NaN
    [Tag.nativeEnum]: Z.NativeEnum<S>
    [Tag.never]: Z.Never
    [Tag.null]: Z.Null
    [Tag.nullable]: Z.Nullable<S>
    [Tag.number]: Z.Number
    [Tag.object]: Z.Object<S>
    [Tag.optional]: Z.Optional<S>
    [Tag.pipeline]: Z.Pipeline<S>
    [Tag.promise]: Z.Promise<S>
    [Tag.readonly]: Z.Readonly<S>
    [Tag.record]: Z.Record<S>
    [Tag.set]: Z.Set<S>
    [Tag.string]: Z.String
    [Tag.symbol]: Z.Symbol
    [Tag.tuple]: Z.Tuple<S>
    [Tag.undefined]: Z.Undefined
    [Tag.unknown]: Z.Unknown
    [Tag.void]: Z.Void
  }

  interface Never { _def: { typeName: Tag['never'] } }
  interface Any { _def: { typeName: Tag['any'] } }
  interface Unknown { _def: { typeName: Tag['unknown'] } }
  interface Undefined { _def: { typeName: Tag['undefined'] } }
  interface Null { _def: { typeName: Tag['null'] } }
  interface Void { _def: { typeName: Tag['void'] } }
  interface NaN { _def: { typeName: Tag['NaN'] } }
  interface Symbol { _def: { typeName: Tag['symbol'] } }
  interface Boolean { _def: { typeName: Tag['boolean'] } }
  interface BigInt { _def: { typeName: Tag['bigint'] } }
  interface Number { _def: { typeName: Tag['number'], checks?: Number.Check[] } }
  interface String { _def: { typeName: Tag['string'] } }
  interface Date { _def: { typeName: Tag['date'] } }
  interface Branded<S = _> { _def: { typeName: Tag['branded'], type: S } }
  interface Optional<S = _> { _def: { typeName: Tag['optional'], innerType: S } }
  interface Nullable<S = _> { _def: { typeName: Tag['nullable'], innerType: S } }
  interface Array<S = _> { _def: { typeName: Tag['array'] } & Array.Check, element: S }
  interface Set<S = _> { _def: { typeName: Tag['set'], valueType: S } }
  interface Map<S = _> { _def: { typeName: Tag['map'], keyType: S, valueType: S } }
  interface Readonly<S = _> { _def: { typeName: Tag['readonly'], innerType: S } }
  interface Promise<S = _> { _def: { typeName: Tag['promise'], type: S } }
  interface Object<S = _> { _def: { typeName: Tag['object'], catchall?: S }, shape: { [x: string]: S } }
  interface Branded<S = _> { _def: { typeName: Tag['branded'], type: S } }
  interface Record<S = _> { _def: { typeName: Tag['record'] }, element: S }
  interface Tuple<S = _> { _def: { typeName: Tag['tuple'], items: [S, ...S[]], rest?: S } }
  interface Function<S = _> { _def: { typeName: Tag['function'], args: [] | [S, ...S[]], returns: S } }
  interface Lazy<S = _> { _def: { typeName: Tag['lazy'], getter(): S } }
  interface AllOf<S = _> { _def: { typeName: Tag['intersection'], left: S, right: S } }
  interface AnyOf<S = _> { _def: { typeName: Tag['union'], options: readonly [S, S, ...S[]] } }
  interface Catch<S = _> { _def: { typeName: Tag['catch'], innerType: S, catchValue(ctx: Ctx): unknown } }
  interface Default<S = _> { _def: { typeName: Tag['default'], innerType: S, defaultValue: (ctx: Ctx) => unknown } }
  interface Effect<S = _> { _def: { typeName: Tag['effects'], schema: S, effect: S } }
  interface Pipeline<S = _> { _def: { typeName: Tag['pipeline'], in: S, out: S } }
  interface OneOf<S = _, K extends keyof any = keyof any> {
    _def: {
      discriminator: K
      typeName: Tag['discriminatedUnion'], options: readonly (Z.Object<S>)[]
    }
  }
  interface Enum<N = _> { _def: { typeName: Tag['enum'], values: [N, ...N[]] } }
  interface Literal<N = _> { _def: { typeName: Tag['literal'], value: N } }
  interface NativeEnum<N = _> { _def: { typeName: Tag['nativeEnum'], values: { [x: number]: N } } }

  /** 
   * ## {@link Nullary `Z.Hole`}
   * 
   * These are our base cases, a.k.a. terminal or "leaf" nodes
   */
  type Nullary =
    | Z.Never
    | Z.Any
    | Z.Unknown
    | Z.Undefined
    | Z.Null
    | Z.Void
    | Z.NaN
    | Z.Symbol
    | Z.Boolean
    | Z.BigInt
    | Z.Number
    | Z.String
    | Z.Date
    | Z.Enum
    | Z.Literal
    | Z.NativeEnum

  /** 
   * ## {@link Hole `Z.Hole`}
   * 
   * The members of {@link Hole `Z.Hole`} map 1-1 to the corresponding
   * zod schema, with the important difference that __recursion is "factored out"__.
   * 
   * If you take a closer look at the type, you'll see what I mean: everywhere
   * where I would have made a recursive call has been replaced with {@link _ `_`}.
   * 
   * Why do this?
   * 
   * Well, for starters, it gives us a way to invert control.
   * 
   * This part's important, because it mirrors what we're going to do at the value-
   * level: factor out the recursion). We don't know, or care, what {@link _ `_`}
   * will be -- all we care about is preserving the surrounding structure. 
   * 
   * That lets us get out of the way. Responsibilities are clear: the caller is
   * responsible for writing the interpreter, and we're responsible for handling
   * the recursion.
   *
   * Taking this approach is more ergonomic, but it's also mathematically rigorous,
   * since it allows our Functor to be homomorphic (see the video below
   * called "Constraints Liberate, Liberties Constrain" below).
   *
   * See also:
   * - {@link Fixpoint `Z.Fixpoint`}
   * - {@link Any `z.Any`}
   * - A talk by Runar Bjarnason's called 
   * ["Constraints Liberate, Liberties Constrain"](https://www.youtube.com/watch?v=GqmsQeSzMdw)
   */
  type Hole<_> =
    | Nullary
    | Z.Catch<_>
    | Z.Optional<_>
    | Z.Nullable<_>
    | Z.Array<_>
    | Z.Set<_>
    | Z.Map<_>
    | Z.Readonly<_>
    | Z.Promise<_>
    | Z.Object<_>
    | Z.Branded<_>
    | Z.Record<_>
    | Z.Tuple<_>
    | Z.Function<_>
    | Z.Lazy<_>
    | Z.AllOf<_>
    | Z.AnyOf<_>
    | Z.OneOf<_>
    | Z.Default<_>
    | Z.Effect<_>
    | Z.Pipeline<_>
    ;

  /**
   * ## {@link Fixpoint `Z.Fixpoint`}
   *
   * This (I believe) is our Functor's greatest fixed point.
   * Similar to {@link Hole `Z.Hole`}, except rather than taking
   * a type parameter, it "fixes" its value to itself.
   * 
   * Interestingly, in TypeScript (and I would imagine most languages),
   * the isn't an easy way to implement {@link Fixpoint `Z.Fixpoint`}
   * in terms of {@link Hole `Z.Hole`}. If you're not sure what I
   * mean, it might be a useful exercize to try, since it will give you
   * some intuition for why adding constraints prematurely might cause
   * us probems down the line.
   */
  type Fixpoint =
    | Nullary
    | Z.Catch<Fixpoint>
    | Z.Optional<Fixpoint>
    | Z.Nullable<Fixpoint>
    | Z.Array<Fixpoint>
    | Z.Set<Fixpoint>
    | Z.Map<Fixpoint>
    | Z.Readonly<Fixpoint>
    | Z.Promise<Fixpoint>
    | Z.Object<Fixpoint>
    | Z.Branded<Fixpoint>
    | Z.Record<Fixpoint>
    | Z.Tuple<Fixpoint>
    | Z.Function<Fixpoint>
    | Z.Lazy<Fixpoint>
    | Z.AllOf<Fixpoint>
    | Z.AnyOf<Fixpoint>
    | Z.OneOf<Fixpoint>
    | Z.Default<Fixpoint>
    | Z.Effect<Fixpoint>
    | Z.Pipeline<Fixpoint>
    ;

  /**
   * ## {@link Free `Z.Free`}
   * 
   * Makes {@link Hole Z.Hole} higher-kinded 
   */
  interface Free extends T.HKT { [-1]: Z.Hole<this[0]> }

  // TODO: make this more granular
  namespace Number {
    interface Check {
      kind: 'int' | 'min' | 'max' | 'finite' | 'multipleOf',
      value?: number,
      inclusive?: boolean
    }
  }
  namespace Array {
    interface Check {
      minLength: null | { value: number }
      maxLength: null | { value: number }
      exactLength: null | { value: number }
    }
  }
}


const tagged
  : <K extends keyof Tag>(tag: K) => <S>(u: unknown) => u is Z.lookup<K, S>
  = (tag) => has('_def', 'typeName', (u): u is never => u === Tag[tag]) as never

const mapObject
  : <S, T>(f: (s: S) => T) => (x: Z.Object<S>) => Z.Object<T>
  = (f) => ({ shape, _def: { catchall, ...def }, ...x }) => ({
    ...x,
    shape: fn.map(shape, f),
    _def: {
      ...def,
      ...catchall && !tagged('never')(catchall) &&
      ({ catchall: f(catchall) })
    },
  })

const mapTuple
  : <S, T>(f: (s: S) => T) => (x: Z.Tuple<S>) => Z.Tuple<T>
  = (f) => ({ _def: { items, rest, ...def }, ...x }) =>
    ({ ...x, _def: { ...def, items: fn.map(items, f), ...rest && ({ rest: f(rest) }) } })

interface Ctx { input: unknown, error: z.ZodError }
const ctx = { input: null, error: new z.ZodError([]) } satisfies Ctx

const Functor: T.Functor<Z.Free, Any> = {
  map(g) {
    return (x) => {
      switch (true) {
        default: return x // fn.exhaustive(x)
        ///  leaves, a.k.a "nullary" types
        case tagged('never')(x): return x
        case tagged('any')(x): return x
        case tagged('unknown')(x): return x
        case tagged('void')(x): return x
        case tagged('undefined')(x): return x
        case tagged('null')(x): return x
        case tagged('symbol')(x): return x
        case tagged('NaN')(x): return x
        case tagged('boolean')(x): return x
        case tagged('bigint')(x): return x
        case tagged('date')(x): return x
        case tagged('number')(x): return x
        case tagged('string')(x): return x
        case tagged('enum')(x): return x
        case tagged('nativeEnum')(x): return x
        case tagged('literal')(x): return x
        ///  branches, a.k.a. "unary" types
        case tagged('tuple')(x): return mapTuple(g)(x) satisfies Z.Tuple
        case tagged('object')(x): return mapObject(g)(x) satisfies Z.Object
        case tagged('array')(x): return { ...x, _def: { ...x._def }, element: g(x.element) } satisfies Z.Array
        case tagged('record')(x): return { ...x, _def: { ...x._def, }, element: g(x.element) } satisfies Z.Record
        case tagged('optional')(x): return { ...x, _def: { ...x._def, innerType: g(x._def.innerType) } } satisfies Z.Optional
        case tagged('union')(x): return { ...x, _def: { ...x._def, options: fn.map(x._def.options, g) } } satisfies Z.AnyOf
        case tagged('intersection')(x): return { ...x, _def: { ...x._def, left: g(x._def.left), right: g(x._def.right) } } satisfies Z.AllOf
        case tagged('discriminatedUnion')(x): return { ...x, _def: { ...x._def, options: fn.map(x._def.options, mapObject(g)) } } satisfies Z.OneOf
        case tagged('branded')(x): return { ...x, _def: { ...x._def, type: g(x._def.type) } } satisfies Z.Branded
        case tagged('promise')(x): return { ...x, _def: { ...x._def, type: g(x._def.type) } } satisfies Z.Promise
        case tagged('catch')(x): return { ...x, _def: { ...x._def, innerType: g(x._def.innerType) } } satisfies Z.Catch
        case tagged('default')(x): return { ...x, _def: { ...x._def, innerType: g(x._def.innerType) } } satisfies Z.Default
        case tagged('readonly')(x): return { ...x, _def: { ...x._def, innerType: g(x._def.innerType) } } satisfies Z.Readonly
        case tagged('nullable')(x): return { ...x, _def: { ...x._def, innerType: g(x._def.innerType) } } satisfies Z.Nullable
        case tagged('lazy')(x): return { ...x, _def: { ...x._def, getter: () => g(x._def.getter()) } } satisfies Z.Lazy
        case tagged('set')(x): return { ...x, _def: { ...x._def, valueType: g(x._def.valueType) } } satisfies Z.Set
        case tagged('pipeline')(x): return { ...x, _def: { ...x._def, in: g(x._def.in), out: g(x._def.out) } } satisfies Z.Pipeline
        case tagged('map')(x): return { ...x, _def: { ...x._def, keyType: g(x._def.keyType), valueType: g(x._def.valueType) } } satisfies Z.Map
        case tagged('effects')(x): return { ...x, _def: { ...x._def, effect: g(x._def.effect), schema: g(x._def.schema) } } satisfies Z.Effect
        case tagged('function')(x): return { ...x, _def: { ...x._def, args: fn.map(x._def.args, g), returns: g(x._def.returns) } } satisfies Z.Function
      }
    }
  }
}

function compileObjectNode<S>(x: Z.Object<S>) {
  const xs = Object.entries(x.shape)
  return xs.length === 0 ? `z.object({})`
    : `z.object({ ${xs.map(([k, v]) => parseKey(k) + ': ' + v).join(', ')} })${typeof x._def.catchall === 'string' ? `.catchall(${x._def.catchall})` : ''}`
}

const applyNumberConstraints = (x: Z.Number) => ''
  + (!x._def.checks?.length ? '' : '.')
  + (x._def.checks?.map((check) =>
    !Number.isFinite(check.value) ? `${check.kind}()`
      : check.kind === 'min' ? `${check.inclusive ? 'min' : 'gt'}(${check.value})`
        : check.kind === 'max' ? `${check.inclusive ? 'max' : 'lt'}(${check.value})`
          : `${check.kind}(${check.value})`
  ).join('.')
  )

const applyArrayConstraints = (x: Z.Array) => ([
  Number.isFinite(x._def.minLength?.value) && `.min(${x._def.minLength?.value})`,
  Number.isFinite(x._def.maxLength?.value) && `.max(${x._def.maxLength?.value})`,
  Number.isFinite(x._def.exactLength?.value) && `.length(${x._def.exactLength?.value})`
]).filter((_) => typeof _ === 'string').join('')

const DepthFunctor: T.IndexedFunctor<number, Json.Free> = {
  map: Json.Functor.map,
  mapWithIndex(f) {
    return (x, depth) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case x === null:
        case x === undefined:
        case x === true:
        case x === false:
        case typeof x === 'number':
        case typeof x === 'string': return x
        case Array_isArray(x): return fn.map(x, (s) => f(s, depth + 2))
        case !!x && typeof x === 'object': return fn.map(x, (s) => f(s, depth + 2))
      }
    }
  }
}

namespace Algebra {
  export const toString: T.Functor.Algebra<Z.Free, string> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      ///  leaves, a.k.a. "nullary" types
      case tagged('never')(x): return 'z.never()'
      case tagged('any')(x): return 'z.any()'
      case tagged('unknown')(x): return 'z.unknown()'
      case tagged('void')(x): return 'z.void()'
      case tagged('undefined')(x): return 'z.undefined()'
      case tagged('null')(x): return 'z.null()'
      case tagged('symbol')(x): return 'z.symbol()'
      case tagged('NaN')(x): return 'z.NaN()'
      case tagged('boolean')(x): return 'z.boolean()'
      case tagged('bigint')(x): return 'z.bigint()'
      case tagged('date')(x): return 'z.date()'
      case tagged('number')(x): return `z.number()${applyNumberConstraints(x)}`
      case tagged('string')(x): return 'z.string()'
      case tagged('catch')(x):
        return `${x._def.innerType}.catch(${serializeShort(x._def.catchValue(ctx)!)})`
      ///  branches, a.k.a. "unary" types
      case tagged('branded')(x): return `${x._def.type}.brand()`
      case tagged('set')(x): return `z.set(${x._def.valueType})`
      case tagged('promise')(x): return `z.promise(${x._def.type})`
      case tagged('map')(x): return `z.map(${x._def.keyType}, ${x._def.valueType})`
      case tagged('readonly')(x): return `${x._def.innerType}.readonly()`
      case tagged('nullable')(x): return `${x._def.innerType}.nullable()`
      case tagged('optional')(x): return `${x._def.innerType}.optional()`
      case tagged('literal')(x): return `z.literal(${JSON.stringify(x._def.value)})`
      case tagged('array')(x): return `z.array(${x.element})${applyArrayConstraints(x)}`
      case tagged('record')(x): return `z.record(${x.element})`
      case tagged('intersection')(x): return `z.intersection(${x._def.left}, ${x._def.right})`
      case tagged('union')(x): return `z.union([${x._def.options.join(', ')}])`
      case tagged('lazy')(x): return `z.lazy(() => ${x._def.getter()})`
      case tagged('pipeline')(x): return `${x._def.in}.pipe(${x._def.out})`
      case tagged('default')(x): return `${x._def.innerType}.default(${serializeShort(x._def.defaultValue(ctx)!)})`
      case tagged('effects')(x): return `z.effects(${x._def.schema}, ${x._def.effect})`
      case tagged('function')(x): return `z.function(t.tuple([${x._def.args.join(', ')}]), ${x._def.returns})`
      case tagged('enum')(x): return `z.enum([${x._def.values.map((_) => JSON.stringify(_)).join(', ')}])`
      case tagged('nativeEnum')(x): return `z.nativeEnum({ ${Object.entries(x._def.values).map(([k, v]) => parseKey(k) + ': ' + JSON.stringify(v)).join(', ')
        } })`
      case tagged('tuple')(x): return `z.tuple([${x._def.items.join(', ')}])${typeof x._def.rest === 'string' ? `.rest(${x._def.rest})` : ''}`
      case tagged('discriminatedUnion')(x):
        return `z.discriminatedUnion("${String(x._def.discriminator)}", [${x._def.options.map(compileObjectNode).join(', ')
          }])`
      case tagged('object')(x): return compileObjectNode(x)
    }
  }

  export const fromValueObject: T.Functor.Algebra<Json.Free, z.ZodTypeAny> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x === null: return z.null()
      case x === undefined: return z.undefined()
      case typeof x === 'boolean': return z.boolean()
      case typeof x === 'symbol': return z.symbol()
      case typeof x === 'number': return z.number()
      case typeof x === 'string': return z.string()
      case Array_isArray(x):
        return x.length === 0 ? z.tuple([]) : z.tuple([x[0], ...x.slice(1)])
      case !!x && typeof x === 'object': return z.object(x)
    }
  }

  export const fromConstant: T.Functor.Algebra<Json.Free, z.ZodTypeAny> = (x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x === null:
      case x === undefined:
      case typeof x === 'symbol':
      case typeof x === 'boolean':
      case typeof x === 'number':
      case typeof x === 'string': return z.literal(x)
      case Array_isArray(x):
        return x.length === 0 ? z.tuple([]) : z.tuple([x[0], ...x.slice(1)])
      case !!x && typeof x === 'object': return z.object(x).strict()
    }
  }

  export const schemaStringFromJson
    : T.Functor.IndexedAlgebra<number, Json.Free, string>
    = (x, indent) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case x === null:
        case x === undefined:
        case typeof x === 'boolean':
        case typeof x === 'number': return `z.literal(${String(x)})`
        case typeof x === 'string': return `z.literal("${x}")`
        case Array_isArray(x): {
          return x.length === 0 ? `z.tuple([])`
            : Print.lines({ indent })(`z.tuple([`, x.join(', '), `])`)
        }
        case !!x && typeof x === 'object': {
          const xs = Object.entries(x)
          return xs.length === 0 ? `z.object({})`
            : Print.lines({ indent })(
              `z.object({`,
              ...xs.map(([k, v]) => parseKey(k) + ': ' + v),
              `})`,
            )
        }
      }
    }

  export const _serializeShort
    : T.Functor.Algebra<Json.Free, string>
    = (x) => {
      switch (true) {
        default: return fn.exhaustive(x)
        case x === null:
        case x === undefined:
        case typeof x === 'boolean':
        case typeof x === 'number':
        case typeof x === 'string': return globalThis.JSON.stringify(x)
        case Array_isArray(x): return x.length === 0 ? '[]' : '[' + x.join(', ') + ']'
        case !!x && typeof x === 'object': {
          const xs = Object.entries(x)
          return xs.length === 0 ? '{}' : '{' + xs.map(([k, v]) => parseKey(k) + ': ' + v).join(',') + '}]'
        }
      }
    }
}

/** 
 * ## {@link toString `zod.toString`}
 * 
 * Converts an arbitrary zod schema back into string form. Used internally 
 * for testing/debugging.
 * 
 * Very useful when you're applying transformations to a zod schema. 
 * Can be used (for example) to reify a schema, or perform codegen, 
 * and has more general applications in dev environments.
 * 
 * @example
 * import { zod } from "@traversable/algebra"
 * import * as vi from "vitest"
 * 
 * vi.expect(zod.toString( z.union([z.object({ tag: z.literal("Left") }), z.object({ tag: z.literal("Right") })])))
 * .toMatchInlineSnapshot(`z.union([z.object({ tag: z.literal("Left") }), z.object({ tag: z.literal("Right") })]))`)
 * 
 * vi.expect(zod.toString( z.tuple([z.number().min(0).lt(2), z.number().multipleOf(2), z.number().max(2).nullable()])))
 * .toMatchInlineSnapshot(`z.tuple([z.number().min(0).lt(2), z.number().multipleOf(2), z.number().max(2).nullable()])`)
 */
const toString = fn.cata(Functor)(Algebra.toString)

/** 
 * ## {@link fromConstant `zod.fromConstant`}
 * 
 * Derive a zod schema from an arbitrary
 * [value object](https://en.wikipedia.org/wiki/Value_object). 
 * 
 * Used to make zod scemas compatible with the JSON Schema spec -- specifically, to support the
 * [`const` keyword](https://json-schema.org/draft/2020-12/draft-bhutton-json-schema-validation-00#rfc.section.6.1.3),
 * added in [2020-12](https://json-schema.org/draft/2020-12/schema).
 */
export const fromConstant = fn.cata(Json.Functor)(Algebra.fromConstant)

const serializeShort
  : (value: {} | null) => string
  = fn.cata(Json.Functor)(Algebra._serializeShort)

export const fromUnknown
  : (value: unknown) => z.ZodTypeAny | undefined
  = (value) => !Json.is(value) ? void 0 : fromConstant(value)

export const fromConstantToSchemaString = fn.cataIx(DepthFunctor)(Algebra.schemaStringFromJson)

type Any<T extends z.ZodTypeAny = z.ZodTypeAny> =
  | z.ZodAny
  | z.ZodUnion<readonly [T, ...T[]]>
  | z.ZodDiscriminatedUnion<string, z.ZodObject<{ [x: string]: T }>[]>
  | z.ZodArray<T>
  | z.ZodBigInt
  | z.ZodBoolean
  | z.ZodBranded<T, keyof never>
  | z.ZodCatch<T>
  | z.ZodDate
  | z.ZodDefault<T>
  | z.ZodEffects<T>
  | z.ZodEnum<[string, ...string[]]>
  | z.ZodFunction<z.ZodTuple<[] | [T, ...T[]]>, T>
  | z.ZodIntersection<T, T>
  | z.ZodLazy<T>
  | z.ZodLiteral<z.Primitive>
  | z.ZodMap<T, T>
  | z.ZodNaN
  | z.ZodNativeEnum<z.EnumLike>
  | z.ZodNever
  | z.ZodNull
  | z.ZodNullable<T>
  | z.ZodNumber
  | z.ZodObject<{ [x: string]: T }>
  | z.ZodArray<T>
  | z.ZodPipeline<T, T>
  | z.ZodPromise<T>
  | z.ZodReadonly<T>
  | z.ZodRecord<z.ZodString, T>
  | z.ZodSet<T>
  | z.ZodString
  | z.ZodSymbol
  | z.ZodTuple<[T, ...T[]], T | null>
  | z.ZodUndefined
  | z.ZodUnknown
  | z.ZodVoid
  ;
