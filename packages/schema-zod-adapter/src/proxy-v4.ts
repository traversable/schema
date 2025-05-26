import { z } from 'zod/v4'
import type { Box, Boxed, Force, Kind, HKT, newtype, TypeConstructor as Type, inline, Key, Showable } from '@traversable/registry'
import { Array_isArray, Either, fn, get, has, mut, Object_assign, Object_create, Object_entries, Object_fromEntries, Object_values, Option, pick, set, symbol } from '@traversable/registry'

import * as F from './functor-v4.js'
import * as P from './paths-v4.js'
import { tagged, TypeName } from './typename-v4.js'
import type { Ctx } from './utils-v4.js'
import { Applicative, Semigroup, Traversable } from './instances-v4.js'
import { withDefault } from './with-default-v4.js'
import { toString } from './toString-v4.js'
import * as Pro from './profunctor-optics-v4.js'

import * as _ from './optics-v4.js'

/** @internal */
const isKeyOf = <T>(x: T, k: keyof any): k is keyof T => !!x && (typeof x === 'object' || typeof x === 'function') && k in x

type InferSource<SA>
  = SA extends
  | _.Iso<infer S1, any>
  | _.Lens<infer S2, any>
  | _.Prism<infer S3, any>
  | _.Optional<infer S4, any>
  | _.Traversal<infer S5, any>
  ? AbsorbNever<AbsorbUnknown<S1 | S2 | S3 | S4 | S5>>
  : never

type InferTarget<SA>
  = SA extends
  | _.Iso<any, infer T1>
  | _.Lens<any, infer T2>
  | _.Prism<any, infer T3>
  | _.Optional<any, infer T4>
  | _.Traversal<any, infer T5>
  ? AbsorbNever<AbsorbUnknown<T1 | T2 | T3 | T4 | T5>>
  : never

type AbsorbUnknown<T> = T extends T ? unknown extends T ? never : T : never
type AbsorbNever<T> = [T] extends [never] ? unknown : T

export function Optic() {}

Optic.Type = {
  // Traversal: _.Traversal.identity[symbol.tag],
  Lens: _.Lens.identity[symbol.tag],
  Prism: _.Prism.identity[symbol.tag],
  Iso: _.Iso.identity[symbol.tag],
  Optional: _.Optional.identity[symbol.tag],
  TraversalWithPredicate: _.Traversal.identityWithPredicate[symbol.tag]
}

export declare namespace Optic {
  type Type = typeof Optic.Type[keyof typeof Optic.Type]
  type Iso = typeof Optic.Type.Iso
  type Prism = typeof Optic.Type.Prism
  type Lens = typeof Optic.Type.Lens
  type Optional = typeof Optic.Type.Optional
  // type Traversal = typeof Optic.Type.Traversal
  type TraversalWithPredicate = typeof Optic.Type.TraversalWithPredicate

  type Any<S = any, A = any> =
    | _.Iso<S, A>
    | _.Prism<S, A>
    | _.Lens<S, A>
    | _.Optional<S, A>
    | _.TraversalWithPredicate<S, A>

  type AnyBox =
    | _.Iso.Box
    | _.Prism.Box
    | _.Lens.Box
    | _.Optional.Box
    | _.Traversal.BoxWithFallback

  type BoxByTag = {
    [Optic.Type.Iso]: _.Iso.Box
    [Optic.Type.Prism]: _.Prism.Box
    [Optic.Type.Lens]: _.Lens.Box
    [Optic.Type.Optional]: _.Optional.Box
    [Optic.Type.TraversalWithPredicate]: _.Traversal.BoxWithFallback
    // [Optic.Type.Traversal]: _.Traversal.Box
  }

  type LowerBound<T> = [Optic.Any[symbol.tag]] extends [T[symbol.tag & keyof T]] ? Optic.Any : never

  namespace Descriptor {
    type Predicate = { type: Optic.Type, tag: 'fromPredicate', predicate: (x: unknown) => boolean }
    type Applicative = { type: Optic.Type, tag: 'applicative', applicative: 'array' | 'record' | 'set' | 'map' }
    type Index = { type: Optic.Type, tag: 'index', index: number }
    type Prop = { type: Optic.Type, tag: 'prop', prop: string }
    type FromNullable = { type: Optic.Type, tag: 'fromNullable', nullable: unknown }
    type Declaration = { type: Optic.Type, tag: 'declaration' }
  }

  type Descriptor =
    | Descriptor.Declaration
    | Descriptor.FromNullable
    | Descriptor.Prop
    | Descriptor.Index
    | Descriptor.Applicative
    | Descriptor.Predicate

  type Path<T = Optic.Descriptor[]> = [
    path: (keyof any)[],
    leaf: T,
    predicate: F.Z.Hole<unknown>,
  ]

  type SchemaPath<T = Optic.Descriptor[]> = [
    path: (keyof any)[],
    leaf: T,
    predicate: z.ZodType,
  ]
}

export type Lattice = typeof Lattice
export const Lattice = {
  [Optic.Type.Iso]: {
    [Optic.Type.Iso]: Optic.Type.Iso,
    [Optic.Type.Prism]: Optic.Type.Prism,
    [Optic.Type.Lens]: Optic.Type.Lens,
    [Optic.Type.Optional]: Optic.Type.Optional,
    [Optic.Type.TraversalWithPredicate]: Optic.Type.TraversalWithPredicate,
    // [Optic.Type.Traversal]: Optic.Type.Traversal,
  },
  [Optic.Type.Prism]: {
    [Optic.Type.Iso]: Optic.Type.Prism,
    [Optic.Type.Prism]: Optic.Type.Prism,
    [Optic.Type.Lens]: Optic.Type.Optional,
    [Optic.Type.Optional]: Optic.Type.Optional,
    [Optic.Type.TraversalWithPredicate]: Optic.Type.TraversalWithPredicate,
    // [Optic.Type.Traversal]: Optic.Type.Traversal,
  },
  [Optic.Type.Lens]: {
    [Optic.Type.Iso]: Optic.Type.Lens,
    [Optic.Type.Prism]: Optic.Type.Optional,
    [Optic.Type.Lens]: Optic.Type.Lens,
    [Optic.Type.Optional]: Optic.Type.Optional,
    [Optic.Type.TraversalWithPredicate]: Optic.Type.TraversalWithPredicate,
    // [Optic.Type.Traversal]: Optic.Type.Traversal,
  },
  [Optic.Type.Optional]: {
    [Optic.Type.Iso]: Optic.Type.Optional,
    [Optic.Type.Prism]: Optic.Type.Optional,
    [Optic.Type.Lens]: Optic.Type.Optional,
    [Optic.Type.Optional]: Optic.Type.Optional,
    [Optic.Type.TraversalWithPredicate]: Optic.Type.TraversalWithPredicate,
    // [Optic.Type.Traversal]: Optic.Type.Traversal,
  },
  [Optic.Type.TraversalWithPredicate]: {
    [Optic.Type.Iso]: Optic.Type.TraversalWithPredicate,
    [Optic.Type.Prism]: Optic.Type.TraversalWithPredicate,
    [Optic.Type.Lens]: Optic.Type.TraversalWithPredicate,
    [Optic.Type.Optional]: Optic.Type.TraversalWithPredicate,
    [Optic.Type.TraversalWithPredicate]: Optic.Type.TraversalWithPredicate,
    // [Optic.Type.Traversal]: Optic.Type.Traversal,
  }
}

const ConversionLattice = {
  [Optic.Type.Iso]: {
    [Optic.Type.Iso]: _.Iso.fromIso,
    [Optic.Type.Prism]: _.Prism.fromIso,
    [Optic.Type.Lens]: _.Lens.fromIso,
    [Optic.Type.Optional]: _.Optional.fromIso,
    // [Optic.Type.Traversal]: _.Traversal.fromIso,
    [Optic.Type.TraversalWithPredicate]: _.Traversal.fromIsoWithFallback,
  },
  [Optic.Type.Prism]: {
    [Optic.Type.Prism]: _.Prism.fromPrism,
    [Optic.Type.Iso]: _.Prism.fromPrism,
    [Optic.Type.Lens]: _.Optional.fromPrism,
    [Optic.Type.Optional]: _.Optional.fromPrism,
    // [Optic.Type.Traversal]: _.Traversal.fromPrism,
    [Optic.Type.TraversalWithPredicate]: _.Traversal.fromPrismWithFallback,
  },
  [Optic.Type.Lens]: {
    [Optic.Type.Lens]: _.Lens.fromLens,
    [Optic.Type.Iso]: _.Lens.fromLens,
    [Optic.Type.Prism]: _.Optional.fromLens,
    [Optic.Type.Optional]: _.Optional.composeLens(_.Optional.declare()) as <A, B>(lens: _.Lens<A, B>) => _.Optional<A, B>,
    // [Optic.Type.Traversal]: _.Traversal.fromLens,
    [Optic.Type.TraversalWithPredicate]: _.Traversal.fromLensWithFallback,
  },
  [Optic.Type.Optional]: {
    [Optic.Type.Optional]: _.Optional.fromOptional,
    [Optic.Type.Iso]: _.Optional.fromOptional,
    [Optic.Type.Prism]: _.Optional.fromOptional,
    [Optic.Type.Lens]: _.Optional.fromOptional,
    // [Optic.Type.Traversal]: _.Traversal.fromOptional,
    [Optic.Type.TraversalWithPredicate]: _.Traversal.fromOptionalWithFallback,
  },
  // [Optic.Type.Traversal]: {
  //   [Optic.Type.Traversal]: _.Traversal.fromTraversal,
  //   [Optic.Type.Iso]: _.Traversal.fromTraversal,
  //   [Optic.Type.Prism]: _.Traversal.fromTraversal,
  //   [Optic.Type.Lens]: _.Traversal.fromTraversal,
  //   [Optic.Type.Optional]: _.Traversal.fromTraversal,
  //   [Optic.Type.TraversalWithPredicate]: _.Traversal.toTraversalWithFallback,
  // },
  [Optic.Type.TraversalWithPredicate]: {
    [Optic.Type.TraversalWithPredicate]: _.Traversal.fromTraversalWithFallback,
    [Optic.Type.Iso]: _.Traversal.fromTraversalWithFallback,
    [Optic.Type.Prism]: _.Traversal.fromTraversalWithFallback,
    [Optic.Type.Lens]: _.Traversal.fromTraversalWithFallback,
    [Optic.Type.Optional]: _.Traversal.fromTraversalWithFallback,
    // [Optic.Type.Traversal]: _.Traversal.fromTraversalWithFallback,
  }
}

const declare = {
  Iso: _.Iso.declare,
  Prism: _.Prism.declare,
  Lens: _.Lens.declare,
  Optional: _.Optional.declare,
  // Traversal: _.Traversal.declare,
  TraversalWithPredicate: _.Traversal.declareWithFallback
} satisfies { [K in Optic.Type]: unknown }

export function declaration({ type }: Optic.Descriptor.Declaration & { fallback: unknown }):
  | _.Iso<unknown, unknown>
  | _.Lens<unknown, unknown>
  | _.Prism<unknown, unknown>
  | _.Optional<unknown, unknown>
  // | _.Traversal<unknown, unknown>
  | _.TraversalWithPredicate<unknown, unknown> {
  return declare[type]()
}

export function prop({ type, prop, fallback }: Optic.Descriptor.Prop & { fallback: unknown }):
  | _.Lens<{ [x: string]: unknown }, unknown>
  | _.Optional<{ [x: string]: unknown }, unknown>
  // | _.Traversal<{ [x: string]: unknown }, unknown>
  | _.TraversalWithPredicate<{ [x: string]: unknown }, unknown> {
  return ConversionLattice.Lens[type](_.Lens.prop(prop)(), fallback)
}

export function index({ type, index, fallback }: Optic.Descriptor.Index & { fallback: unknown }):
  | _.Lens<{ [x: number]: unknown }, unknown>
  | _.Optional<{ [x: number]: unknown }, unknown>
  // | _.Traversal<{ [x: number]: unknown }, unknown>
  | _.TraversalWithPredicate<{ [x: number]: unknown }, unknown> {
  return ConversionLattice.Lens[type](_.Lens.prop(index)(), fallback)
}

export function fromNullable({ type, nullable, fallback }: Optic.Descriptor.FromNullable & { fallback: unknown }):
  | _.Prism<unknown, unknown>
  | _.Optional<unknown, unknown>
  // | _.Traversal<unknown, unknown>
  | _.TraversalWithPredicate<unknown, unknown> {
  return ConversionLattice.Prism[type](_.Prism.fromPredicate((x) => x !== nullable), fallback)
}

export function fromPredicate({ type, predicate, fallback }: Optic.Descriptor.Predicate & { fallback: unknown }):
  | _.Prism<unknown, unknown>
  | _.Optional<unknown, unknown>
  // | _.Traversal<unknown, unknown>
  | _.TraversalWithPredicate<unknown, unknown> {
  return ConversionLattice.Prism[type](_.Prism.fromPredicate(predicate), fallback)
}

export function applicative({ type, applicative, fallback }: Optic.Descriptor.Applicative & { fallback: unknown }): _.TraversalWithPredicate<unknown, unknown> {
  if (!isKeyOf(Semigroup.Traversable, applicative)) throw Error('Unsupported applicative type: ' + applicative)
  else {
    const T: Semigroup.Traversable<any> = Semigroup.Traversable[applicative]
    const instance = _.Traversal.fromTraversableWithFallback(T)(fallback)
    return ConversionLattice.TraversalWithPredicate[type](instance)
  }
}

export type CompositionLattice = typeof CompositionLattice
export const CompositionLattice = {
  [Optic.Type.Iso]: {
    [Optic.Type.Iso]: _.Iso.compose,
    [Optic.Type.Prism]: <S, A, B>(ISO: _.Iso<S, A>, PRISM: _.Prism<A, B>) => _.Prism.compose(_.Prism.fromIso(ISO), PRISM),
    [Optic.Type.Lens]: <S, A, B>(ISO: _.Iso<S, A>, LENS: _.Lens<A, B>) => _.Lens.compose(_.Lens.fromIso(ISO), LENS),
    [Optic.Type.Optional]: <S, A, B>(ISO: _.Iso<S, A>, OPTIONAL: _.Optional<A, B>) => _.Optional.compose(_.Optional.fromIso(ISO), OPTIONAL),
    // [Optic.Type.Traversal]: <S, A, B>(ISO: _.Iso<S, A>, TRAVERSAL: _.Traversal<A, B>) => _.Traversal.compose(_.Traversal.fromIso(ISO), TRAVERSAL),
    [Optic.Type.TraversalWithPredicate]: <S, A, B>(
      ISO: _.Iso<S, A>,
      TRAVERSAL_FB: _.TraversalWithPredicate<A, B>,
      fallback: A
    ) => _.Traversal.composeWithFallback(_.Traversal.fromIsoWithFallback(ISO), TRAVERSAL_FB, fallback),
  },
  [Optic.Type.Prism]: {
    [Optic.Type.Prism]: _.Prism.compose,
    [Optic.Type.Iso]: <S, A, B>(PRISM: _.Prism<S, A>, ISO: _.Iso<A, B>) => _.Prism.compose(PRISM, _.Prism.fromIso(ISO)),
    [Optic.Type.Lens]: <S, A, B>(PRISM: _.Prism<S, A>, LENS: _.Lens<A, B>) => _.Optional.join(PRISM, LENS),
    [Optic.Type.Optional]: <S, A, B>(PRISM: _.Prism<S, A>, OPTIONAL: _.Optional<A, B>) => _.Optional.compose(_.Optional.fromPrism(PRISM), OPTIONAL),
    // [Optic.Type.Traversal]: <S, A, B>(PRISM: _.Prism<S, A>, TRAVERSAL: _.Traversal<A, B>) => _.Traversal.compose(_.Traversal.fromPrism(PRISM), TRAVERSAL),
    [Optic.Type.TraversalWithPredicate]: <S, A, B>(
      PRISM: _.Prism<S, A>,
      TRAVERSAL_FB: _.TraversalWithPredicate<A, B>,
      fallback: S
    ) => _.Traversal.composeWithFallback(_.Traversal.fromPrismWithFallback(PRISM, fallback), TRAVERSAL_FB, fallback),
  },
  [Optic.Type.Lens]: {
    [Optic.Type.Lens]: _.Lens.compose,
    [Optic.Type.Iso]: <S, A, B>(LENS: _.Lens<S, A>, ISO: _.Iso<A, B>) => _.Lens.compose(LENS, _.Lens.fromIso(ISO)),
    [Optic.Type.Prism]: <S, A, B>(LENS: _.Lens<S, A>, PRISM: _.Prism<A, B>) => _.Optional.join(LENS, PRISM),
    [Optic.Type.Optional]: <S, A, B>(LENS: _.Lens<S, A>, OPTIONAL: _.Optional<A, B>) => _.Optional.compose(_.Optional.fromLens(LENS), OPTIONAL),
    // [Optic.Type.Traversal]: <S, A, B>(LENS: _.Lens<S, A>, TRAVERSAL: _.Traversal<A, B>) => _.Traversal.compose(_.Traversal.fromLens(LENS), TRAVERSAL),
    [Optic.Type.TraversalWithPredicate]: <S, A, B>(
      LENS: _.Lens<S, A>,
      TRAVERSAL_FB: _.TraversalWithPredicate<A, B>,
      fallback: A
    ) => _.Traversal.composeWithFallback(_.Traversal.fromLensWithFallback(LENS, fallback), TRAVERSAL_FB, fallback),
  },
  [Optic.Type.Optional]: {
    [Optic.Type.Optional]: _.Optional.compose,
    [Optic.Type.Iso]: <S, A, B>(OPTIONAL: _.Optional<S, A>, ISO: _.Iso<A, B>) => _.Optional.compose(OPTIONAL, _.Optional.fromIso(ISO)),
    [Optic.Type.Prism]: <S, A, B>(OPTIONAL: _.Optional<S, A>, PRISM: _.Prism<A, B>) => _.Optional.compose(OPTIONAL, _.Optional.fromPrism(PRISM)),
    [Optic.Type.Lens]: <S, A, B>(OPTIONAL: _.Optional<S, A>, LENS: _.Lens<A, B>) => _.Optional.compose(OPTIONAL, _.Optional.fromLens(LENS)),
    // [Optic.Type.Traversal]: <S, A, B>(OPTIONAL: _.Optional<S, A>, TRAVERSAL: _.Traversal<A, B>) => _.Traversal.compose(_.Traversal.fromOptional(OPTIONAL), TRAVERSAL),
    [Optic.Type.TraversalWithPredicate]: <S, A, B>(
      OPTIONAL: _.Optional<S, A>,
      TRAVERSAL_FB: _.TraversalWithPredicate<A, B>,
      fallback: S
    ) => _.Traversal.composeWithFallback(_.Traversal.fromOptionalWithFallback(OPTIONAL, fallback), TRAVERSAL_FB, fallback),
  },
  // [Optic.Type.Traversal]: {
  //   // [Optic.Type.Traversal]: _.Traversal.compose,
  //   [Optic.Type.Iso]: <S, A, B>(TRAVERSAL: _.Traversal<S, A>, ISO: _.Iso<A, B>) => _.Traversal.compose(TRAVERSAL, _.Traversal.fromIso(ISO)),
  //   [Optic.Type.Prism]: <S, A, B>(TRAVERSAL: _.Traversal<S, A>, PRISM: _.Prism<A, B>) => _.Traversal.compose(TRAVERSAL, _.Traversal.fromPrism(PRISM)),
  //   [Optic.Type.Lens]: <S, A, B>(TRAVERSAL: _.Traversal<S, A>, LENS: _.Lens<A, B>) => _.Traversal.compose(TRAVERSAL, _.Traversal.fromLens(LENS)),
  //   [Optic.Type.Optional]: <S, A, B>(TRAVERSAL: _.Traversal<S, A>, OPTIONAL: _.Optional<A, B>) => _.Traversal.compose(TRAVERSAL, _.Traversal.fromOptional(OPTIONAL)),
  //   [Optic.Type.TraversalWithPredicate]: <S, A, B>(
  //     TRAVERSAL: _.Traversal<S, A>,
  //     TRAVERSAL_FB: _.TraversalWithPredicate<A, B>,
  //     fallback: A
  //   ) => _.Traversal.composeWithFallback(_.Traversal.toTraversalWithFallback(TRAVERSAL, fallback), TRAVERSAL_FB, fallback),
  // },
  [Optic.Type.TraversalWithPredicate]: {
    [Optic.Type.Iso]: <S, A, B>(
      TRAVERSAL_FB: _.TraversalWithPredicate<S, A>,
      ISO: _.Iso<A, B>,
      fallback: A,
    ) => _.Traversal.composeWithFallback(TRAVERSAL_FB, _.Traversal.fromIsoWithFallback(ISO), fallback),
    [Optic.Type.Prism]: <S, A, B>(
      TRAVERSAL_FB: _.TraversalWithPredicate<S, A>,
      PRISM: _.Prism<A, B>,
      fallback: A,
    ) => _.Traversal.composeWithFallback(TRAVERSAL_FB, _.Traversal.fromPrismWithFallback(PRISM, fallback), fallback),
    [Optic.Type.Lens]: <S, A, B>(
      TRAVERSAL_FB: _.TraversalWithPredicate<S, A>,
      LENS: _.Lens<A, B>,
      fallback: B,
    ) => _.Traversal.composeWithFallback(TRAVERSAL_FB, _.Traversal.fromLensWithFallback(LENS, fallback), fallback),
    [Optic.Type.Optional]: <S, A, B>(
      TRAVERSAL_FB: _.TraversalWithPredicate<S, A>,
      OPTIONAL: _.Optional<A, B>,
      fallback: A
    ) => _.Traversal.composeWithFallback(TRAVERSAL_FB, _.Traversal.fromOptionalWithFallback(OPTIONAL, fallback), fallback),
    // [Optic.Type.Traversal]: _.Traversal.compose,
    [Optic.Type.TraversalWithPredicate]: _.Traversal.composeWithFallback,
  }
}

function compose<
  Source extends Optic.Any<any, any>,
  Target extends Optic.Any<A, any>,
  S extends InferSource<Source>,
  A extends InferTarget<Source>,
  B extends InferTarget<Target>,
  F extends Optic.BoxByTag[Lattice[Source[symbol.tag]][Target[symbol.tag]]]
>(sa: Source, ab: Target): Box<F, [S, B]>

function compose<
  Source extends Optic.Any<any, any>,
  Target extends Optic.Any<any, any>,
>(sa: Source, ab: Target): Optic.Any

function compose(sa: Optic.Any, ab: Optic.Any): {} {
  const f
    : (sa: Optic.Any, ab: Optic.Any) => Optic.Any
    = CompositionLattice[sa[symbol.tag]][ab[symbol.tag]] as never
  return f(sa, ab)
}

const Handler = {
  Iso: fn.const(Optic.Type.Iso),
  Prism: fn.const(Optic.Type.Prism),
  Lens: fn.const(Optic.Type.Lens),
  Optional: fn.const(Optic.Type.Optional),
  // Traversal: fn.const(Optic.Type.Traversal),
  TraversalWithPredicate: fn.const(Optic.Type.TraversalWithPredicate)
} satisfies { [K in Optic.Type]: P.Interpreter.Handler<keyof P.Interpreter, Optic.Type> }

const pathInterpreter = {
  array: Handler.TraversalWithPredicate,
  catch: Handler.Lens,
  custom: Handler.TraversalWithPredicate,
  default: Handler.Lens,
  intersectionLeft: Handler.Iso,
  intersectionRight: Handler.Iso,
  lazy: Handler.Iso,
  literal: Handler.Lens,
  mapKey: Handler.TraversalWithPredicate,
  mapValue: Handler.TraversalWithPredicate,
  nonoptional: Handler.Lens,
  null: Handler.Iso,
  nullable: Handler.Prism,
  number: Handler.Lens,
  string: Handler.Lens,
  object: Handler.Lens,
  optional: Handler.Prism,
  pipe: Handler.TraversalWithPredicate,
  prefault: Handler.Lens,
  promise: Handler.TraversalWithPredicate,
  readonly: Handler.Iso,
  recordKey: Handler.Lens,
  recordValue: Handler.Lens,
  set: Handler.TraversalWithPredicate,
  success: Handler.Prism,
  symbol: Handler.Lens,
  transform: Handler.TraversalWithPredicate,
  tuple: Handler.Iso,
  union: Handler.Prism,
} satisfies { [K in keyof P.Interpreter]-?: P.Interpreter.Handler<keyof P.Interpreter, Optic.Type> }

declare const Z: {
  literal: Z.Literal
  optional: Z.Optional
  array: Z.Array
  record: Z.Record
  union: Z.Union
  tuple: Z.Tuple
  object: Z.Object
}

declare namespace Z {
  // @ts-ignore
  type infer<T> = T['_output']
  interface Type<T> { _output: T }
  interface Indexed { [x: number]: Z.Typed }
  interface Named { [x: string]: Z.Typed }
  type Objects = readonly Z.Object[]
  type Ordered = readonly Z.Typed[]
  interface Infer<
    T extends
    | { _output: unknown }
    = { _output: unknown }
  > { _output: T['_output'] }
  interface Typed<
    T extends
    | { _zod: { def: { type: unknown } } }
    = { _zod: { def: { type: unknown } } }
  > { _zod: { def: { type: T['_zod']['def']['type'] } } }
  //
  interface Literal<
    T extends
    | { _zod: { output: Showable } }
    = { _zod: { output: Showable } }
  > { _zod: { output: T['_zod']['output'] } }
  interface Optional<
    T extends
    | { _zod: { def: { innerType: Z.Typed } } }
    = { _zod: { def: { innerType: Z.Typed } } }
  > { _zod: { def: { innerType: T['_zod']['def']['innerType'] } } }
  interface Array<
    T extends
    | { _zod: { def: { element: Z.Typed } } }
    = { _zod: { def: { element: Z.Typed } } }
  > { _zod: { def: { element: T['_zod']['def']['element'] } } }
  interface Record<
    T extends
    | { _zod: { def: { keyType: Z.Type<keyof any>, valueType: Z.Typed } } }
    = { _zod: { def: { keyType: Z.Type<keyof any>, valueType: Z.Typed } } }
  > { _zod: { def: { keyType: T['_zod']['def']['keyType'], valueType: T['_zod']['def']['valueType'] } } }
  interface Union<
    T extends
    | { _zod: { def: { options: Z.Indexed } } }
    = { _zod: { def: { options: Z.Indexed } } }
  > { _zod: { def: { options: T['_zod']['def']['options'] } } }
  interface Tuple<
    T extends
    | { _zod: { def: { items: Z.Ordered } } }
    = { _zod: { def: { items: Z.Ordered } } }
  > { _zod: { def: { items: T['_zod']['def']['items'] } } }
  interface Object<
    T extends
    | { _zod: { def: { shape: Z.Named } } }
    = { _zod: { def: { shape: Z.Named } } }
  > { _zod: { def: { shape: T['_zod']['def']['shape'] } } }
}

type MakeProxy<Z> = typeOf<Z>

type typeOf<T>
  = [T] extends [Z.Object] ? t.object<T['_zod']['def']['shape']>
  : [T] extends [Z.Optional] ? t.optional<T['_zod']['def']['innerType']>
  : [T] extends [Z.Tuple] ? typeOfItems<T['_zod']['def']['items']>
  : [T] extends [Z.Union] ? UnionType<T['_zod']['def']['options']>
  : [T] extends [Z.Array] ? t.array<T['_zod']['def']['element']>
  : [T] extends [Z.Record] ? Record<
    T['_zod']['def']['keyType']['_output'],
    typeOf<T['_zod']['def']['valueType']>
  >
  : T['_output' & keyof T]

declare namespace t { export { t_object as object } }
declare namespace t {
  interface t_object<S> extends newtype<{ [K in keyof S]: typeOf<S[K]> }> {}
  interface union<S> extends newtype<{ [I in keyof S]: typeOf<S[I]> }> {}
  interface disjointUnion<T extends [keyof any, unknown]> extends newtype<{ [E in T as E[0]]: { [K in keyof E[1]]: typeOf<E[1][K]> } }> {}
  interface optional<S> {
    ʔ: typeOf<S>
    ǃ: typeOf<S>
  }
  interface array<S> {
    ↆ: typeOf<S>
    map<T>(f: (x: typeOf<S>) => T): T
  }
}

type typeOfItems<T> = { [I in Extract<keyof T, `${number}`>]: typeOf<T[I]> }

type UnionType<
  T extends Z.Indexed,
  // @ts-expect-error
  K extends keyof any = keyof T[number]['_zod']['def']['shape'],
  // @ts-expect-error
  Disc extends keyof any = T[number]['_zod']['def']['shape'][K]['_output']
> = [K] extends [never]
  ? never | t.union<T>
  : never | t.disjointUnion<
    Disc extends Disc
    ? [
      Disc,
      Extract<
        // @ts-expect-error
        T[number]['_zod']['def']['shape'],
        Record<K, { _output: Disc }>
      >
    ]
    : never
  >

declare function makeProxy<Z extends Z.Typed, T, P = MakeProxy<Z>>(
  type: Z,
  selector: (proxy: P) => T
): (data: Z.infer<Z>) => Force<T>

type Cmd =
  | ArrayDSL[keyof ArrayDSL]
  | OptionalDSL[keyof OptionalDSL]
  | IsoDSL[keyof IsoDSL]
  | RecordDSL[keyof RecordDSL]

type CMD = Cmd | (string & {})

type DSL =
  | ArrayDSL
  | OptionalDSL
  | IsoDSL
  | RecordDSL

type ArrayDSL = typeof ArrayDSL
const ArrayDSL = {
  each: 'ↆ',
} as const

type RecordDSL = typeof RecordDSL
const RecordDSL = {
  each: 'ↆ',
} as const

type IsoDSL = typeof IsoDSL
const IsoDSL = {
  id: 'Ɐ',
  iso: 'ꘌ',
} as const

type OptionalDSL = typeof OptionalDSL
const OptionalDSL = {
  chain: 'ʔ',
  filter: 'ǃ',
} as const

const DSL = {
  array: ArrayDSL,
  record: RecordDSL,
  optional: OptionalDSL,
  iso: IsoDSL,
} as const

declare namespace DSL {
  namespace optional {
    type chain = typeof DSL.optional.chain
    type filter = typeof DSL.optional.filter
  }
  namespace array {
    type each = typeof DSL.array.each
  }
  namespace record {
    type each = typeof DSL.record.each
  }
}

const WitnessURI = Symbol.for('Witness')
export function createWitness<T extends z.core.$ZodType>(type: T): MakeProxy<T> & { [WitnessURI]: (keyof any)[] }
export function createWitness<const T extends object = never>() {
  let state: (keyof any)[] = []
  const handler: ProxyHandler<T> = {
    get(target, key) {
      if (key === WitnessURI) return state
      else {
        Reflect.set(state, state.length, key)
        return new Proxy(Object_assign(target, { [WitnessURI]: state }), handler)
      }
    },
  }
  return new Proxy({}, handler)
}

declare namespace Witness {
  namespace Kind {
    interface Schema<T extends {}> extends newtype<T> { kind: 'schema' }
    interface Proxy<T extends {}> extends newtype<T> { kind: 'proxy' }
  }
  namespace Proxy {
    interface Array<T> {
      [DSL.array.each]: F.Z.Array<T>
    }
    interface Optional<T> {
      [DSL.optional.chain]: F.Z.Optional<T>
      [DSL.optional.filter]: F.Z.Optional<T>
    }
  }
  interface Free extends HKT { [-1]: Witness.F<this[0]> }
  type F<T> =
    | Kind.Proxy<Proxy.Array<T>>
    | Kind.Proxy<Proxy.Optional<T>>
    | Kind.Schema<F.Z.Nullary>
    | Kind.Schema<F.Z.Prefault<T>>
    | Kind.Schema<F.Z.Nullable<T>>
    | Kind.Schema<F.Z.Set<T>>
    | Kind.Schema<F.Z.Map<T>>
    | Kind.Schema<F.Z.Readonly<T>>
    | Kind.Schema<F.Z.Object<T>>
    | Kind.Schema<F.Z.Record<T>>
    | Kind.Schema<F.Z.Tuple<T>>
    | Kind.Schema<F.Z.Lazy<T>>
    | Kind.Schema<F.Z.Intersection<T>>
    | Kind.Schema<F.Z.Union<T>>
    | Kind.Schema<F.Z.Default<T>>
    | Kind.Schema<F.Z.Success<T>>
    | Kind.Schema<F.Z.NonOptional<T>>
    | Kind.Schema<F.Z.Pipe<T>>
    | Kind.Schema<F.Z.Transform<T>>
    | Kind.Schema<F.Z.Catch<T>>
    /** @deprecated */
    | Kind.Schema<F.Z.Promise<T>>
  type Fixpoint =
    | Kind.Proxy<Proxy.Array<Fixpoint>>
    | Kind.Proxy<Proxy.Optional<Fixpoint>>
    | Kind.Schema<F.Z.Nullary>
    | Kind.Schema<F.Z.Prefault<Fixpoint>>
    | Kind.Schema<F.Z.Nullable<Fixpoint>>
    | Kind.Schema<F.Z.Set<Fixpoint>>
    | Kind.Schema<F.Z.Map<Fixpoint>>
    | Kind.Schema<F.Z.Readonly<Fixpoint>>
    | Kind.Schema<F.Z.Object<Fixpoint>>
    | Kind.Schema<F.Z.Record<Fixpoint>>
    | Kind.Schema<F.Z.Tuple<Fixpoint>>
    | Kind.Schema<F.Z.Lazy<Fixpoint>>
    | Kind.Schema<F.Z.Intersection<Fixpoint>>
    | Kind.Schema<F.Z.Union<Fixpoint>>
    | Kind.Schema<F.Z.Default<Fixpoint>>
    | Kind.Schema<F.Z.Success<Fixpoint>>
    | Kind.Schema<F.Z.NonOptional<Fixpoint>>
    | Kind.Schema<F.Z.Pipe<Fixpoint>>
    | Kind.Schema<F.Z.Transform<Fixpoint>>
    | Kind.Schema<F.Z.Catch<Fixpoint>>
    /** @deprecated */
    | Kind.Schema<F.Z.Promise<Fixpoint>>
}

function leastUpperBound(descriptors: Optic.Descriptor[], next: Optic.Type = Optic.Type.Iso): Optic.Type {
  return descriptors.reduce((acc, { type: cur }) => Lattice[acc][cur], next)
}

const schemaToPredicate
  : <Z extends F.Z.Hole<unknown>>(type: Z) => (x: unknown) => boolean
  = (type) => (x: unknown) => type.safeParse(x).success

function findIndices<T>(predicate: (x: T) => boolean): (xs: T[]) => number[]
function findIndices<T>(predicate: (x: T) => boolean) {
  return (xs: T[]) => xs.reduce((acc, x, ix) => predicate(x) ? [...acc, ix] : acc, Array.of<number>())
}

const findSymbols = findIndices((x) => typeof x === 'symbol')

function slicesFromIndices<T>(xs: T[], indices: number[]) {
  return indices.reduce(
    (acc, _, i, all) => {
      if (i === all.length - 1) return [...acc, xs]
      else {
        const next = all[i + 1]
        return [...acc, xs.slice(0, next)]
      }
    },
    [Array.of<T>()]
  )
}

const emptyDescriptor = { type: Optic.Type.Iso, tag: 'declaration' } satisfies Optic.Descriptor

const prefixEmptyDescriptor
  : (schemaPath: Optic.SchemaPath) => Optic.SchemaPath
  = ([path, descriptors, type]: Optic.SchemaPath) => {
    return [path, [emptyDescriptor, ...descriptors], type] satisfies Optic.SchemaPath
  }

const KeyLookup = {
  [symbol.object]: '',
  [symbol.tuple]: '',
  [symbol.array]: DSL.array.each,
  [symbol.record]: DSL.record.each,
  [symbol.optional]: DSL.optional.chain,
} as const satisfies Record<symbol, string>

function buildKey(path: (keyof any)[]): string {
  return path.reduce<string>(
    (acc, cur) => {
      const NEXT = isKeyOf(KeyLookup, cur) ? KeyLookup[cur] : String(cur)
      const SEP = acc.length === 0 ? '' : NEXT.length === 0 ? '' : '.'
      return `${acc}${SEP}${NEXT}`
    },
    ''
  )
}

function buildPath(path: (keyof any)[]): string[] {
  return path.reduce(
    (acc, cur) => {
      const HEAD = isKeyOf(KeyLookup, cur) ? KeyLookup[cur] : String(cur)
      const NEXT = acc.length === 0 ? HEAD.length === 0 ? [] : [HEAD] : HEAD.length === 0 ? [] : [HEAD]
      return [...acc, ...NEXT]
    },
    Array.of<string>()
  )
}

type Applied = { key: string, path: string[], optic: Optic.Any, fallback: unknown }

/**
 * TODO:
 * 1. Parameterize DSL, so users can define their own
 * 2. Checking that the path segment contains these particular properties is brittle.
 *    Experiment with ways to handle that better
 */
function getFallback(rootFallback: unknown, ...path: string[]): unknown {
  console.log('rootFallback: ', rootFallback)
  let HEAD: string | undefined
  let CURSOR: unknown = rootFallback
  while ((HEAD = path.shift()) !== undefined) {
    switch (true) {
      default: {
        console.log('proxy-v4.getFallback encountered a value it did not know how to interpret, CURSOR: ', CURSOR)
        throw Error('proxy-v4.getFallback encountered a value it did not know how to interpret: ' + HEAD)
      }
      case HEAD === DSL.iso.id: continue
      case HEAD === DSL.optional.chain: continue
      case HEAD === DSL.optional.filter: continue
      case HEAD === DSL.array.each && Array_isArray(CURSOR): {
        if (CURSOR.length === 0) break
        else { CURSOR = CURSOR[0]; continue }
      }
      case HEAD === DSL.record.each && !!CURSOR && typeof CURSOR === 'object': {
        const values = Object_values(CURSOR)
        if (values.length === 0) break
        else { CURSOR = values[0]; continue }
      }
      case has(HEAD)(CURSOR): CURSOR = CURSOR[HEAD]; continue
    }
  }
  return CURSOR
}

type IR = {
  path: (keyof any)[]
  optics: Optic.Descriptor[]
}

const Get = {
  Identity: (optic: any) => function IdentityGet(data: unknown) { return Pro.get(optic, data) },
  Lens: (optic: any) => function LensGet(data: unknown) { return Pro.get(optic, data) },
  Traversal: (optic: any) => function TraversalGet(data: unknown) { return Pro.collect(optic)(data) },
  Prism: (optic: any) => function PrismGet(data: unknown) { return Pro.preview(optic, data) },
}

const Set = {
  Identity: (optic: any) => function IdentitySet(update: unknown, data: unknown) { return Pro.set(optic, update, data) },
  Lens: (optic: any) => function LensSet(update: unknown, data: unknown) { return Pro.set(optic, update, data) },
  Traversal: (optic: any) => function TraversalSet(update: unknown, data: unknown) { return Pro.set(optic, update, data) },
  Prism: (optic: any) => function PrismSet(update: unknown, data: unknown) { return Pro.set(optic, update, data) },
}

const Modify = {
  Identity: (optic: any) => function IdentityModify(fn: (x: any) => unknown, data: unknown) { return Pro.modify(optic, fn, data) },
  Lens: (optic: any) => function LensModify(fn: (x: any) => unknown, data: unknown) { return Pro.modify(optic, fn, data) },
  Traversal: (optic: any) => function TraversalModify(fn: (x: any) => unknown, data: unknown) { return Pro.modify(optic, fn, data) },
  Prism: (optic: any) => function PrismModify(fn: (x: any) => unknown, data: unknown) { return Pro.modify(optic, fn, data) },
}

function interpretIR(rootFallback: unknown) {
  return (x: IR) => {
    const key = buildKey(x.path)
    const path = buildPath(x.path) as CMD[]
    const fallback = getFallback(rootFallback, ...path)
    const init = [Pro.id]

    const optics = path.reduce((optics, cmd) => {
      switch (true) {
        default: return fn.exhaustive(cmd)
        case cmd === 'ǃ': return [...optics, Pro.propOr(fallback, cmd)]
        case cmd === 'ↆ': return [...optics, Pro.traverse]
        case cmd === 'ʔ': return [...optics, Pro.when((x) => x != null)]
        case cmd === 'Ɐ': return [...optics, Pro.id]
        case typeof cmd === 'string': return [...optics, Pro.prop(cmd)]
      }
    }, init)

    const optic = Pro.pipe(...optics)
    const get = (Get[optic[symbol.tag as never]] as Function)(optic)       // TODO: type assertions
    const set = (Set[optic[symbol.tag as never]] as Function)(optic)       // TODO: type assertions
    const modify = (Modify[optic[symbol.tag as never]] as Function)(optic) // TODO: type assertions

    return {
      key,
      path,
      get,
      set,
      modify,
      type: optic[symbol.tag],
      fallback,
    }
  }
}

const applyAll = <T extends z.ZodType>(type: T) => (xs: { path: (string | number | symbol)[], optics: Optic.Descriptor[] }[]) => {
  const fallback = withDefault(type)
  const entries = xs.map(
    fn.flow(
      interpretIR(fallback),
      ({ key, ...$ }) => [key, $] satisfies [any, any],
    )
  )

  return Object_fromEntries(entries)
}

export type GeneratedLens<Data, Focus = Data> = {
  type: Pro.Optic.Type
  get(data: Data): Focus
  set(update: Focus, data: Data): Data
  modify<T>(fn: (x: Focus) => T, data: Data): Data
}

export type buildLenses<Data> = {
  [x: string]: GeneratedLens<Data, unknown>
}

export function buildLenses<Z extends z.ZodType, Data = z.infer<Z>>(type: Z): buildLenses<Data>
export function buildLenses<Z extends z.ZodType>(type: Z) {
  return buildIntermediateRepresentation(type)
    .map(applyAll(type))
    // might want to remove this later
    .reduce((acc, cur) => Object_assign(Object_create(null), acc, cur))
}

export function buildIntermediateRepresentation<T extends z.ZodType>(type: T) {
  const schemaPaths = buildDescriptors(type).map(prefixEmptyDescriptor)
  return schemaPaths.map(([path, descriptors]) => {
    const indices = findSymbols(path)
    const slices = slicesFromIndices(path, indices)
    const firstPass = descriptors.map(
      ({ type, ...descriptor }, i) => ({
        path: slices[i],
        index: i,
        optic: {
          type: leastUpperBound(descriptors.slice(0, i), type),
          ...descriptor,
        }
      })
    )
    const secondPass = firstPass.map(({ path, optic, index }) => ({
      path,
      optics: firstPass.slice(0, index).map(({ optic }) => optic).concat(optic)
    }))
    return secondPass
  })
}

export function buildDescriptors<T extends z.core.$ZodType>(type: T): Optic.SchemaPath[]
export function buildDescriptors<T extends F.Z.Hole<unknown>>(type: T): {} {
  return F.fold<Optic.Path[]>((x) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case tagged('void')(x): return [[[], [], x]]
      case tagged('never')(x): return [[[], [], x]]
      case tagged('unknown')(x): return [[[], [], x]]
      case tagged('any')(x): return [[[], [], x]]
      case tagged('undefined')(x): return [[[], [], x]]
      case tagged('null')(x): return [[[], [], x]]
      case tagged('nan')(x): return [[[], [], x]]
      case tagged('boolean')(x): return [[[], [], x]]
      case tagged('symbol')(x): return [[[], [], x]]
      case tagged('int')(x): return [[[], [], x]]
      case tagged('bigint')(x): return [[[], [], x]]
      case tagged('number')(x): return [[[], [], x]]
      case tagged('string')(x): return [[[], [], x]]
      case tagged('date')(x): return [[[], [], x]]
      case tagged('file')(x): return [[[], [], x]]

      case tagged('optional')(x): return fn.pipe(
        x._zod.def.innerType,
        (paths) => paths.map(([path, descriptors, schema]) => [
          [symbol.optional, ...path],
          [
            {
              type: Optic.Type.Prism,
              tag: 'fromNullable',
              nullable: undefined,
            },
            ...descriptors,
          ],
          schema,
        ] satisfies Optic.Path
        )
      )

      case tagged('nullable')(x): return fn.pipe(
        x._zod.def.innerType,
        (paths) => paths.map(
          ([path, descriptors, schema]) => [
            [symbol.nullable, ...path],
            [
              {
                type: Optic.Type.Prism,
                tag: 'fromNullable',
                nullable: null,
              },
              ...descriptors,
            ],
            schema,
          ] satisfies Optic.Path
        )
      )

      case tagged('readonly')(x): return x._zod.def.innerType

      case tagged('array')(x): return fn.pipe(
        x._zod.def.element,
        (paths) => paths.map(
          ([path, descriptors, schema]) => [
            [symbol.array, ...path],
            [
              {
                type: Optic.Type.TraversalWithPredicate,
                tag: 'applicative',
                applicative: 'array',
              },
              ...descriptors,
            ],
            schema,
          ] satisfies Optic.Path
        )
      )

      case tagged('record')(x): return fn.pipe(
        x._zod.def.valueType,
        (paths) => paths.map(
          ([path, descriptors, schema]) => [
            [symbol.record, ...path],
            [
              {
                type: Optic.Type.TraversalWithPredicate,
                tag: 'applicative',
                applicative: 'record',
              },
              ...descriptors,
            ],
            schema,
          ] satisfies Optic.Path
        )
      )

      case tagged('tuple')(x): {
        return fn.pipe(
          x._zod.def.items,
          (matrix) => (
            matrix.flatMap(
              (paths, i) => (
                paths.map(
                  ([path, descriptors, schema]) => [
                    [symbol.tuple, i, ...path],
                    [
                      {
                        type: Optic.Type.Lens,
                        tag: 'index',
                        index: i,
                      },
                      ...descriptors,
                    ],
                    schema,
                  ] satisfies Optic.Path
                )
              )
            )
          ),
        )
      }

      case tagged('object')(x): {
        return fn.pipe(
          Object_entries(x._zod.def.shape),
          (matrix) => matrix.flatMap(
            ([k, paths]) => paths.map(
              ([path, descriptors, schema]) => [
                [symbol.object, k, ...path],
                [
                  {
                    type: Optic.Type.Lens,
                    tag: 'prop',
                    prop: k,
                  },
                  ...descriptors,
                ],
                schema,
              ] satisfies Optic.Path
            )
          )
        )
      }

      case tagged('union')(x): {
        return fn.pipe(
          x._zod.def.options,
          (matrix) => matrix.flatMap((
            paths, i) => paths.map(
              ([path, descriptors, schema]) => [
                [symbol.union, i, ...path],
                [
                  {
                    type: Optic.Type.Prism,
                    tag: 'fromPredicate',
                    predicate: schemaToPredicate(schema),
                  },
                  ...descriptors,
                ],
                schema,
              ] satisfies Optic.Path
            )
          )
        )
      }

      case tagged('enum')(x): {
        return [[[], [], x]] satisfies Optic.Path[]
      }

      case tagged('intersection')(x):
      case tagged('map')(x):
      case tagged('set')(x):
      case tagged('nonoptional')(x):
      case tagged('default')(x):
      case tagged('prefault')(x):
      case tagged('catch')(x):
      case tagged('literal')(x):
      case tagged('template_literal')(x):
      case tagged('success')(x):
      case tagged('custom')(x):
      case tagged('lazy')(x):
      case tagged('transform')(x):
      case tagged('pipe')(x):
      case tagged('promise')(x): throw Error('buildLens does not yet support schema type: ' + x._zod.def.type)
    }
  })(type)
}

declare function makeProxy<Z extends Z.Typed, T, P = MakeProxy<Z>>(type: Z, selector: (proxy: P) => T): (data: Z.infer<Z>) => Force<T>

// type BoxByName = {
//   [Optic.Type.Iso]: Iso.Box
//   [Optic.Type.Prism]: Prism.Box
//   [Optic.Type.Lens]: Lens.Box
//   [Optic.Type.Optional]: Optional.Box
//   [Optic.Type.Traversal]: Traversal.Box
// }

// const declare = {
//   Iso: Iso.declare,
//   Prism: Prism.declare,
//   Lens: Lens.declare,
//   Optional: Optional.declare,
//   Traversal: Traversal.declare,
// } satisfies { [K in Optic.Type]: unknown }

// const IsoLattice = {
//   Iso: Iso.fromIso,
//   Prism: Prism.fromIso,
//   Lens: Lens.fromIso,
//   Optional: Optional.fromIso,
//   Traversal: Traversal.fromIso,
// }

// export function isoFrom<A, B>(iso: Iso<A, B>): Iso<A, B>
// export function isoFrom<A, B>(prism: Prism<A, B>): Iso<A, B>
// export function isoFrom<A, B>(lens: Lens<A, B>): Iso<A, B>
// export function isoFrom<A, B>(sa: Optional<A, B>): Iso<A, B>
// export function isoFrom<A, B>(sa: Traversal<A, B>): Iso<A, B>
// export function isoFrom<A, B>(sa: Iso<A, B> | Prism<A, B> | Lens<A, B> | Optional<A, B> | Traversal<A, B>): Iso<A, B>
// export function isoFrom<A, B>(sa: Iso<A, B> | Prism<A, B> | Lens<A, B> | Optional<A, B> | Traversal<A, B>) {
//   if (!(sa[symbol.tag] in IsoLattice)) throw Error('isoFrom expected a value with a tag')
//   else return IsoLattice[sa[symbol.tag]](sa as never)
// }


// const PrismLattice = {
//   Iso: Prism.fromIso,
//   Prism: Prism.fromPrism,
//   Lens: Optional.join,
//   Optional: Optional.fromPrism,
//   Traversal: Traversal.fromPrism,
// }

// export function prismFrom<A, B>(iso: Iso<A, B>): Prism<A, B>
// export function prismFrom<A, B>(prism: Prism<A, B>): Prism<A, B>
// export function prismFrom<A, B>(lens: Lens<A, B>): Prism<A, B>
// export function prismFrom<A, B>(sa: Optional<A, B>): Prism<A, B>
// export function prismFrom<A, B>(sa: Traversal<A, B>): Prism<A, B>
// export function prismFrom<A, B>(sa: Iso<A, B> | Prism<A, B> | Lens<A, B> | Optional<A, B> | Traversal<A, B>): Prism<A, B>
// export function prismFrom<A, B>(sa: Iso<A, B> | Prism<A, B> | Lens<A, B> | Optional<A, B> | Traversal<A, B>) {
//   if (!(sa[symbol.tag] in PrismLattice)) throw Error('prismFrom expected a value with a tag')
//   else return PrismLattice[sa[symbol.tag]](sa as never)
// }

// const OptionalLattice = {
//   Iso: Optional.fromIso,
//   Prism: Optional.fromPrism,
//   Lens: Optional.fromLens,
//   Optional: Optional.fromOptional,
//   Traversal: Traversal.fromOptional,
// }

// export function optionalFrom<A, B>(iso: Iso<A, B>): Optional<A, B>
// export function optionalFrom<A, B>(prism: Prism<A, B>): Optional<A, B>
// export function optionalFrom<A, B>(lens: Lens<A, B>): Optional<A, B>
// export function optionalFrom<A, B>(sa: Optional<A, B>): Optional<A, B>
// export function optionalFrom<A, B>(sa: Traversal<A, B>): Optional<A, B>
// export function optionalFrom<A, B>(sa: Iso<A, B> | Prism<A, B> | Lens<A, B> | Optional<A, B> | Traversal<A, B>): Optional<A, B>
// export function optionalFrom<A, B>(sa: Iso<A, B> | Prism<A, B> | Lens<A, B> | Optional<A, B> | Traversal<A, B>) {
//   if (!(sa[symbol.tag] in OptionalLattice)) throw Error('optionalFrom expected a value with a tag')
//   else return OptionalLattice[sa[symbol.tag]](sa as never)
// }
// const LensLattice = {
//   Iso: Lens.fromIso,
//   Prism: Optional.join,
//   Lens: Lens.fromLens,
//   Optional: Optional.fromLens,
//   Traversal: Traversal.fromLens,
// }

// export function liftLens<A, B>(iso: Iso<A, B>): Lens<A, B>
// export function liftLens<A, B>(prism: Prism<A, B>): Lens<A, B>
// export function liftLens<A, B>(lens: Lens<A, B>): Lens<A, B>
// export function liftLens<A, B>(sa: Optional<A, B>): Lens<A, B>
// export function liftLens<A, B>(sa: Traversal<A, B>): Lens<A, B>
// export function liftLens<A, B>(sa: Iso<A, B> | Prism<A, B> | Lens<A, B> | Optional<A, B> | Traversal<A, B>): Lens<A, B>
// export function liftLens<A, B>(sa: Iso<A, B> | Prism<A, B> | Lens<A, B> | Optional<A, B> | Traversal<A, B>) {
//   if (!(sa[symbol.tag] in LensLattice)) throw Error('lensFrom expected a value with a tag')
//   else return LensLattice[sa[symbol.tag]](sa as never)
// }

// type JoinLattice = {
//   [Optic.Type.Iso]: [
//     typeof Optic.Type.Iso
//   ]
//   [Optic.Type.Prism]: [
//     typeof Optic.Type.Iso,
//     typeof Optic.Type.Prism,
//   ]
//   [Optic.Type.Lens]: [
//     typeof Optic.Type.Iso,
//     typeof Optic.Type.Lens,
//   ]
//   [Optic.Type.Optional]: [
//     typeof Optic.Type.Iso,
//     typeof Optic.Type.Prism,
//     typeof Optic.Type.Lens,
//   ]
//   [Optic.Type.Traversal]: [
//     typeof Optic.Type.Iso,
//     typeof Optic.Type.Prism,
//     typeof Optic.Type.Lens,
//     typeof Optic.Type.Optional,
//     typeof Optic.Type.Traversal,
//   ]
// }

// type MeetLattice = {
//   [Optic.Type.Traversal]: [
//     typeof Optic.Type.Traversal,
//   ]
//   [Optic.Type.Optional]: [
//     typeof Optic.Type.Traversal,
//     typeof Optic.Type.Optional,
//   ]
//   [Optic.Type.Lens]: [
//     typeof Optic.Type.Traversal,
//     typeof Optic.Type.Optional,
//     typeof Optic.Type.Lens,
//   ]
//   [Optic.Type.Prism]: [
//     typeof Optic.Type.Traversal,
//     typeof Optic.Type.Optional,
//     typeof Optic.Type.Prism,
//   ]
//   [Optic.Type.Iso]: [
//     typeof Optic.Type.Traversal,
//     typeof Optic.Type.Optional,
//     typeof Optic.Type.Lens,
//     typeof Optic.Type.Prism,
//     typeof Optic.Type.Iso,
//   ]
// }

// type IsoUpcast = JoinLattice[typeof Optic.Type.Iso][number]
// type IsoDowncast = MeetLattice[typeof Optic.Type.Iso][number]
// type PrismUpcast = JoinLattice[typeof Optic.Type.Prism][number]
// type PrismDowncast = MeetLattice[typeof Optic.Type.Prism][number]
// type LensUpcast = JoinLattice[typeof Optic.Type.Lens][number]
// type LensDowncast = MeetLattice[typeof Optic.Type.Lens][number]
// type OptionalUpcast = JoinLattice[typeof Optic.Type.Optional][number]
// type OptionalDowncast = MeetLattice[typeof Optic.Type.Optional][number]
// type TraveralUpcast = JoinLattice[typeof Optic.Type.Traversal][number]
// type TraveralDowncast = MeetLattice[typeof Optic.Type.Traversal][number]

// type Join = typeof JoinLattice
// const JoinLattice = {
//   [Optic.Type.Iso]: {
//     from: {
//       [Optic.Type.Iso]: Iso.fromIso,
//     }
//   },
//   [Optic.Type.Prism]: {
//     from: {
//       [Optic.Type.Iso]: Prism.fromIso,
//       [Optic.Type.Prism]: Prism.fromPrism,
//     }
//   },
//   [Optic.Type.Lens]: {
//     from: {
//       [Optic.Type.Iso]: Lens.fromIso,
//       [Optic.Type.Lens]: Lens.fromLens,
//     }
//   },
//   [Optic.Type.Optional]: {
//     from: {
//       [Optic.Type.Iso]: Optional.fromIso,
//       [Optic.Type.Prism]: Optional.fromPrism,
//       [Optic.Type.Lens]: Optional.fromLens,
//       [Optic.Type.Optional]: Optional.fromOptional,
//     }
//   },
//   [Optic.Type.Traversal]: {
//     from: {
//       [Optic.Type.Iso]: Traversal.fromIso,
//       [Optic.Type.Prism]: Traversal.fromPrism,
//       [Optic.Type.Lens]: Traversal.fromLens,
//       [Optic.Type.Optional]: Traversal.fromOptional,
//       [Optic.Type.Traversal]: Traversal.fromTraversal,
//     }
//   }
// }

// type Meet = typeof MeetLattice
// const MeetLattice = {
//   [Optic.Type.Iso]: {
//     to: {
//       [Optic.Type.Iso]: Iso.fromIso,
//       [Optic.Type.Prism]: Prism.fromIso,
//       [Optic.Type.Lens]: Lens.fromIso,
//       [Optic.Type.Optional]: Optional.fromIso,
//       [Optic.Type.Traversal]: Traversal.fromIso,
//     }
//   },
//   [Optic.Type.Prism]: {
//     to: {
//       [Optic.Type.Prism]: Prism.fromPrism,
//       [Optic.Type.Optional]: Optional.fromPrism,
//       [Optic.Type.Traversal]: Traversal.fromPrism,
//     }
//   },
//   [Optic.Type.Lens]: {
//     to: {
//       [Optic.Type.Lens]: Lens.fromLens,
//       [Optic.Type.Optional]: Optional.fromLens,
//       [Optic.Type.Traversal]: Traversal.fromLens,
//     }
//   },
//   [Optic.Type.Optional]: {
//     to: {
//       [Optic.Type.Optional]: Optional.fromOptional,
//       [Optic.Type.Traversal]: Traversal.fromOptional,
//     }
//   },
//   [Optic.Type.Traversal]: {
//     to: {
//       [Optic.Type.Traversal]: Traversal.fromTraversable,
//     }
//   }
// }

// export type Lattice = typeof Lattice
// export const Lattice = {
//   [Optic.Type.Iso]: {
//     [Optic.Type.Iso]: Iso.compose,
//     [Optic.Type.Prism]: <S, A, B>(ISO: Iso<S, A>, PRISM: Prism<A, B>) => Prism.compose(Prism.fromIso(ISO), PRISM),
//     [Optic.Type.Lens]: <S, A, B>(ISO: Iso<S, A>, LENS: Lens<A, B>) => Lens.compose(Lens.fromIso(ISO), LENS),
//     [Optic.Type.Optional]: <S, A, B>(ISO: Iso<S, A>, OPTIONAL: Optional<A, B>) => Optional.compose(Optional.fromIso(ISO), OPTIONAL),
//     [Optic.Type.Traversal]: <S, A, B>(ISO: Iso<S, A>, TRAVERSAL: Traversal<A, B>) => Traversal.compose(Traversal.fromIso(ISO), TRAVERSAL),
//   },
//   [Optic.Type.Prism]: {
//     [Optic.Type.Prism]: Prism.compose,
//     [Optic.Type.Iso]: <S, A, B>(PRISM: Prism<S, A>, ISO: Iso<A, B>) => Prism.compose(PRISM, Prism.fromIso(ISO)),
//     [Optic.Type.Lens]: <S, A, B>(PRISM: Prism<S, A>, LENS: Lens<A, B>) => Optional.join(PRISM, LENS),
//     [Optic.Type.Optional]: <S, A, B>(PRISM: Prism<S, A>, OPTIONAL: Optional<A, B>) => Optional.compose(Optional.fromPrism(PRISM), OPTIONAL),
//     [Optic.Type.Traversal]: <S, A, B>(PRISM: Prism<S, A>, TRAVERSAL: Traversal<A, B>) => Traversal.compose(Traversal.fromPrism(PRISM), TRAVERSAL),
//   },
//   [Optic.Type.Lens]: {
//     [Optic.Type.Lens]: Lens.compose,
//     [Optic.Type.Iso]: <S, A, B>(LENS: Lens<S, A>, ISO: Iso<A, B>) => Lens.compose(LENS, Lens.fromIso(ISO)),
//     [Optic.Type.Prism]: <S, A, B>(LENS: Lens<S, A>, PRISM: Prism<A, B>) => Optional.join(LENS, PRISM),
//     [Optic.Type.Optional]: <S, A, B>(LENS: Lens<S, A>, OPTIONAL: Optional<A, B>) => Optional.compose(Optional.fromLens(LENS), OPTIONAL),
//     [Optic.Type.Traversal]: <S, A, B>(LENS: Lens<S, A>, TRAVERSAL: Traversal<A, B>) => Traversal.compose(Traversal.fromLens(LENS), TRAVERSAL),
//   },
//   [Optic.Type.Optional]: {
//     [Optic.Type.Optional]: Optional.compose,
//     [Optic.Type.Iso]: <S, A, B>(OPTIONAL: Optional<S, A>, ISO: Iso<A, B>) => Optional.compose(OPTIONAL, Optional.fromIso(ISO)),
//     [Optic.Type.Prism]: <S, A, B>(OPTIONAL: Optional<S, A>, PRISM: Prism<A, B>) => Optional.compose(OPTIONAL, Optional.fromPrism(PRISM)),
//     [Optic.Type.Lens]: <S, A, B>(OPTIONAL: Optional<S, A>, LENS: Lens<A, B>) => Optional.compose(OPTIONAL, Optional.fromLens(LENS)),
//     [Optic.Type.Traversal]: <S, A, B>(OPTIONAL: Optional<S, A>, TRAVERSAL: Traversal<A, B>) => Traversal.compose(Traversal.fromOptional(OPTIONAL), TRAVERSAL),
//   },
//   [Optic.Type.Traversal]: {
//     [Optic.Type.Traversal]: Traversal.compose,
//     [Optic.Type.Iso]: <S, A, B>(TRAVERSAL: Traversal<S, A>, ISO: Iso<A, B>) => Traversal.compose(TRAVERSAL, Traversal.fromIso(ISO)),
//     [Optic.Type.Prism]: <S, A, B>(TRAVERSAL: Traversal<S, A>, PRISM: Prism<A, B>) => Traversal.compose(TRAVERSAL, Traversal.fromPrism(PRISM)),
//     [Optic.Type.Lens]: <S, A, B>(TRAVERSAL: Traversal<S, A>, LENS: Lens<A, B>) => Traversal.compose(TRAVERSAL, Traversal.fromLens(LENS)),
//     [Optic.Type.Optional]: <S, A, B>(TRAVERSAL: Traversal<S, A>, OPTIONAL: Optional<A, B>) => Traversal.compose(TRAVERSAL, Traversal.fromOptional(OPTIONAL)),
//   }
// }

// function downcast<T extends Optic.Type>(target: T): <S extends keyof Join[T]['from']>(source: S) => Join[T]['from'][S]
// function downcast(target: Optic.Type) {
//   const lookup = JoinLattice[target].from
//   return (source: keyof typeof lookup) => lookup[source]
// }

// function upcast<S extends Optic.Type>(source: S): <T extends keyof Meet[S]['to']>(target: T) => Meet[S]['to'][T]
// function upcast(source: Optic.Type) {
//   const lookup = MeetLattice[source].to
//   return (target: keyof typeof lookup) => lookup[target]
// }

/**
 * @example
 * [
 *   [
 *     [
 *       Symbol(@traversable/schema/URI::union),
 *       0,
 *       Symbol(@traversable/schema/URI::array),
 *     ],
 *     "z.number()",
 *     [
 *       {
 *         "predicate": [Function],
 *         "tag": "predicate",
 *         "type": "Traversal",
 *       },
 *       {
 *         "applicative": "array",
 *         "tag": "applicative",
 *         "type": "Traversal",
 *       },
 *       {
 *         "tag": "none",
 *         "type": "Iso",
 *       },
 *     ],
 *   ],
 *   [
 *     [
 *       Symbol(@traversable/schema/URI::union),
 *       1,
 *       Symbol(@traversable/schema/URI::object),
 *       "a",
 *       Symbol(@traversable/schema/URI::optional),
 *     ],
 *     "z.string()",
 *     [
 *       {
 *         "predicate": [Function],
 *         "tag": "predicate",
 *         "type": "Optional",
 *       },
 *       {
 *         "prop": "a",
 *         "tag": "prop",
 *         "type": "Optional",
 *       },
 *       {
 *         "nullable": undefined,
 *         "tag": "fromNullable",
 *         "type": "Prism",
 *       },
 *       {
 *         "tag": "none",
 *         "type": "Iso",
 *       },
 *     ],
 *   ],
 *   [
 *     [
 *       Symbol(@traversable/schema/URI::union),
 *       2,
 *     ],
 *     "z.boolean()",
 *     [
 *       {
 *         "predicate": [Function],
 *         "tag": "predicate",
 *         "type": "Prism",
 *       },
 *       {
 *         "tag": "none",
 *         "type": "Iso",
 *       },
 *     ],
 *   ],
 * ]
 */


// export function fromPredicate<
//   SA extends Optic.LowerBound<SA>,
//   K extends keyof any,
//   A extends { [P in K]: unknown }
// >(
//   predicate: (x: unknown) => boolean,
//   optic: SA
// ):
//   | _.Prism<_.Prism.inferSource<SA>, A[K]>
//   | _.Optional<_.Optional.inferSource<SA>, A[K]>
//   | _.Traversal<_.Traversal.inferSource<SA>, A[K]>

// export function fromPredicate<S, A>(predicate: (x: unknown) => boolean, iso: _.Iso<S, A>): _.Prism<S, A>
// export function fromPredicate<S, A>(predicate: (x: unknown) => boolean, prism: _.Prism<S, A>): _.Prism<S, A>
// export function fromPredicate<S, A>(predicate: (x: unknown) => boolean, lens: _.Iso<S, A>): _.Optional<S, A>
// export function fromPredicate<S, A>(predicate: (x: unknown) => boolean, optional: _.Optional<S, A>): _.Optional<S, A>
// export function fromPredicate<S, A>(predicate: (x: unknown) => boolean, traversal: _.Traversal<S, A>): _.Traversal<S, A>
// export function fromPredicate<S, A>(predicate: (x: unknown) => boolean): _.Prism<S, A> | _.Optional<S, A> | _.Traversal<S, A>

// export function fromPredicate<S, A>(
//   predicate: (x: unknown) => boolean,
//   SA: Optic.Any<S, A> = _.Prism.declare() as never
// ) {
//   const AB = _.Prism.fromPredicate(predicate)
//   switch (true) {
//     default: return fn.exhaustive(SA)
//     case _.Prism.is(SA): return _.Prism.compose(SA, AB)
//     case _.Iso.is(SA): return _.Prism.compose(_.Prism.fromIso(SA), AB)
//     case _.Lens.is(SA): return _.Optional.compose(_.Optional.fromLens(SA), _.Optional.fromPrism(AB))
//     case _.Optional.is(SA): return _.Optional.compose(SA, _.Optional.fromPrism(AB))
//     case _.Traversal.is(SA): return _.Traversal.compose(SA, _.Traversal.fromPrism(AB))
//   }
// }

// export function prop<
//   SA extends Optic.LowerBound<SA>,
//   K extends keyof any,
//   A extends { [P in K]: unknown }
// >(
//   prop: K,
//   optic: SA
// ):
//   | _.Lens<_.Lens.inferSource<SA>, A[K]>
//   | _.Optional<_.Optional.inferSource<SA>, A[K]>
//   | _.Traversal<_.Traversal.inferSource<SA>, A[K]>

// export function prop<S, K extends keyof any, A extends { [P in K]: unknown }>(prop: K, iso: _.Iso<S, A>): _.Lens<S, A[K]>
// export function prop<S, K extends keyof any, A extends { [P in K]: unknown }>(prop: K, lens: _.Lens<S, A>): _.Lens<S, A[K]>
// export function prop<S, K extends keyof any, A extends { [P in K]: unknown }>(prop: K, prism: _.Prism<S, A>): _.Optional<S, A[K]>
// export function prop<S, K extends keyof any, A extends { [P in K]: unknown }>(prop: K, optional: _.Optional<S, A>): _.Optional<S, A[K]>
// export function prop<S, K extends keyof any, A extends { [P in K]: unknown }>(prop: K, traversal: _.Traversal<S, A>): _.Traversal<S, A[K]>
// export function prop<S, K extends keyof any, A extends { [P in K]: unknown }>(prop: K): _.Lens<S, A[K]>
// export function prop<K extends keyof any, A extends { [P in K]: unknown }>(prop: K, SA: Optic.Any<unknown, A> = _.Lens.declare() as never) {
//   const AK = _.Lens.prop(prop)
//   switch (true) {
//     default: return fn.exhaustive(SA)
//     case _.Lens.is(SA): return _.Lens.compose(SA, AK)
//     case _.Iso.is(SA): return _.Lens.compose(_.Lens.fromIso(SA), AK)
//     case _.Prism.is(SA): return _.Optional.compose(_.Optional.fromPrism(SA), _.Optional.fromLens(AK))
//     case _.Optional.is(SA): return _.Optional.compose(SA, _.Optional.fromLens(AK))
//     case _.Traversal.is(SA): return _.Traversal.compose(SA, _.Traversal.fromLens(AK))
//   }
// }

// const TraversalLattice = {
//   Iso: _.Traversal.fromIso,
//   Prism: _.Traversal.fromPrism,
//   Lens: _.Traversal.fromLens,
//   Optional: _.Traversal.fromOptional,
//   Traversal: _.Traversal.fromTraversal,
// }

// function traversalFrom<A, B>(iso: _.Iso<A, B>): _.Traversal<A, B>
// function traversalFrom<A, B>(prism: _.Prism<A, B>): _.Traversal<A, B>
// function traversalFrom<A, B>(lens: _.Lens<A, B>): _.Traversal<A, B>
// function traversalFrom<A, B>(sa: _.Optional<A, B>): _.Traversal<A, B>
// function traversalFrom<A, B>(sa: _.Traversal<A, B>): _.Traversal<A, B>
// function traversalFrom<A, B>(sa: _.Iso<A, B> | _.Prism<A, B> | _.Lens<A, B> | _.Optional<A, B> | _.Traversal<A, B>): _.Traversal<A, B>
// function traversalFrom<A, B>(sa: _.Iso<A, B> | _.Prism<A, B> | _.Lens<A, B> | _.Optional<A, B> | _.Traversal<A, B>) {
//   if (!(sa[symbol.tag] in TraversalLattice)) throw Error('traversalFrom expected a value with a tag')
//   else return TraversalLattice[sa[symbol.tag]](sa as never)
// }

// const declarationGet = fn.identity
// const declarationSet = fn.const(fn.identity)

// const propGet
//   : (prop: string) => (object: unknown) => unknown
//   = (prop) => (object) => {
//     if (!has(prop)(object)) throw Error('proxy-v4.propGet: could not find property ' + prop + ' in object')
//     else return object[prop]
//   }

// function chunkBy<T>(predicate: (x: T) => boolean, ...xs: T[]): T[][] {
//   let ix = 0
//   let x: T | undefined
//   let chunk = Array.of<T>()
//   let prev = Array.of<T>()
//   let out = Array.of<T[]>()
//   while ((x = xs.shift()) !== undefined) {
//     chunk.push(x)
//     if (predicate(x)) {
//       // out.push(chunk)
//       (
//         out.push(prev.concat(chunk)),
//         prev = chunk,
//         chunk = Array.of<T>()
//       )
//     }
//   }
//   return out
// }

// // const isArrayEachCmd = (x: unknown) => x === 'ↆ'
// // const isNotCmd = (x: unknown) => typeof x === 'string'
// //   && !Object.values(DSL.array).includes(x as never)
// //   && !Object.values(DSL.optional).includes(x as never)

// // function example(
// //   CMD: ['a', 'ↆ', 'b', 'ↆ', 'c'],
// //   data: {
// //     a: [
// //       {
// //         b: [
// //           { c: 1 },
// //           { c?: -1 },
// //           { c: 2 }
// //         ]
// //       },
// //       { b?: [{ c?: -2 }] },
// //       {
// //         b: [
// //           { c: 3 },
// //           { c: 4 },
// //           { c: undefined }
// //         ]
// //       }
// //     ]
// //   }
// // ) {
// //   const chunks = chunkBy(isArrayEachCmd, ...CMD)
// //   // let cursor: unknown = structuredClone(data)
// //   // let paths = Array.of<string[]>()

// //   // function go(cursor: unknown, cmds: CMD[], paths: (string | number)[][]): (string | number)[][] {
// //   //   const cmd = cmds[0]
// //   //   console.group('\n\ncalling go, CMD: ', cmd)
// //   //   console.debug('\ncursor: ', cursor)
// //   //   console.debug('\ncmds: ', cmds)
// //   //   console.debug('\npaths: ', paths)
// //   //   console.debug()
// //   //   console.groupEnd()

// //   //   if (cmds.length === 0) {
// //   //     console.log('BOTTOM', paths)
// //   //     return paths
// //   //   }

// //   //   else if (cmd === '.') return go(cursor, cmds.slice(1), paths)

// //   //   else if (has(cmd)(cursor))
// //   //     return go(cursor[cmd], cmds.slice(1), paths.length === 0 ? [[cmd]] : paths.map((path) => [...path, cmd]))

// //   //   else if (cmd === 'ʔ') throw Error('Unimplemented: ' + cmd)

// //   //   else if (cmd === 'ǃ') throw Error('Unimplemented: ' + cmd)

// //   //   else if (cmd === 'ↆ' && Array_isArray(cursor))
// //   //     return cursor.flatMap((x, i) => go(x, cmds.slice(1), paths.map((path) => [...path, i])))

// //   //   else
// //   //     return paths
// //   // }

// //   // console.log('END: ', go(data, CMD, []))

// //   /**
// //    * ['a', 0, 'b', 0, 'c']
// //    * ['a', 0, 'b', 1, 'c']
// //    * ['a', 0, 'b', 2, 'c']
// //    * ['a', 1, 'b', 0, 'c'] (if it were to exist)
// //    * ['a', 2, 'b', 0, 'c']
// //    * ['a', 2, 'b', 1, 'c']
// //    * ['a', 2, 'b', 2, 'c']
// //    *
// //    * ['a', 0, 'b', 0, 'c']
// //    * ['a', 0, 'b', 1, 'c']
// //    * ['a', 0, 'b', 2, 'c']
// //    * ['a', 1, 'b', 0, 'c'] (if it were to exist)
// //    * ['a', 2, 'b', 0, 'c']
// //    * ['a', 2, 'b', 1, 'c']
// //    * ['a', 2, 'b', 2, 'c']
// //    */

// //   return [
// //     data?.a?.[0]?.b?.[0]?.c ?? symbol.notfound,
// //     data?.a?.[0]?.b?.[1]?.c ?? symbol.notfound,
// //     data?.a?.[0]?.b?.[2]?.c ?? symbol.notfound,
// //     data?.a?.[1]?.b?.[0]?.c ?? symbol.notfound,
// //     data?.a?.[2]?.b?.[0]?.c ?? symbol.notfound,
// //     data?.a?.[2]?.b?.[1]?.c ?? symbol.notfound,
// //     data?.a?.[2]?.b?.[2]?.c ?? symbol.notfound,
// //   ] as const satisfies any[]
// // }

// // const example_01 = example(
// //   ['a', 'ↆ', 'b', 'ↆ', 'c'],
// //   {
// //     a: [
// //       {
// //         b: [
// //           { c: 1 },         // [a, 0, b, 0, c]
// //           {},               // [a, 0, b, 1, c]
// //           { c: 2 }          // [a, 0, b, 2, c]
// //         ]
// //       },
// //       {},                   // [a, 1]
// //       {
// //         b: [
// //           { c: 3 },         // [a, 2, b, 0, c]
// //           { c: 4 },         // [a, 2, b, 1, c]
// //           { c: undefined }  // [a, 2, b, 2, c]
// //         ]
// //       }
// //     ]
// //   }
// // )

// // console.log('\n\nexample:\n\n', example_01)

// // for (let chunk of chunks) {
// //   let accessor: unknown = cursor
// //   let cmd1: CMD | undefined
// //   while ((cmd1 = chunk.shift()) !== undefined) {
// //     /**
// //      * if (cmd === '?') ...
// //      * if (cmd === '!') ...
// //      */
// //     if (cmd1 === 'ↆ' && Array_isArray(accessor)) {
// //       accessor.forEach((x, i) => {
// //         let cmd2: CMD | undefined
// //         while ((cmd2 = chunk.shift()) !== undefined) {
// //           if (isNotCmd(cmd2) && has(cmd2)(x)) {
// //             x = x[cmd2]
// //           }
// //         }
// //         accessors.push(accessor)
// //       })
// //       break
// //     }
// //     if (has(cmd1)(accessor)) {
// //       accessor = accessor[cmd1]
// //     }
// //     else {
// //       accessor = symbol.notfound
// //     }
// //     accessors.push(accessor)
// //   }
// // }

// function createGetter(fallback: unknown, ...path: CMD[]) {
//   let cmd: CMD | undefined
//   return function getter(data: unknown) {
//     let cursor = data
//     while ((cmd = path.shift()) !== undefined) {
//       if (cmd === DSL.array.each && Array_isArray(cursor)) {
//         // cursor = cursor.map((x) => )
//       }
//     }
//   }
// }

// function chunksFromIndices_<T>(xs: T[], indices: number[]) {
//   return indices.reduce(
//     (acc, prev, i, all) => {
//       if (i === all.length - 1) return [...acc, xs.slice(i)]
//       else {
//         const next = all[i + 1]
//         return [...acc, xs.slice(prev, next)]
//       }
//     },
//     [[] as T[]]
//   )
// }

// function windowsFromIndices<T>(xs: T[], indices: number[]) {
//   return indices.reduce(
//     (acc, prev, i, all) => {
//       if (i === all.length - 1) return [...acc, [prev, xs.length - 1]]
//       else {
//         const next = all[i + 1]
//         return [...acc, [prev, next]]
//       }
//     },
//     [[0, 0]]
//   )
// }

// const bound = (bound: number, fallback: number) => (x: number) => x > bound ? x : fallback

// const preprocess = F.fold<Witness.Fixpoint>((x) => {
//   switch (true) {
//     case tagged('array')(x): return { kind: 'proxy', [DSL.array.each]: x }
//     case tagged('optional')(x): return { kind: 'proxy', [DSL.optional.chain]: x, [DSL.optional.filter]: x }
//     default: return (
//       (x as typeof x & { kind: 'schema' }).kind = 'schema',
//       (x as typeof x & { kind: 'schema' })
//     )
//   }
// })



// const applyEach = (rootFallback: unknown) => (x: { path: (keyof any)[], optics: Optic.Descriptor[] }) => {
//   const key = buildKey(x.path)
//   const path = buildPath(x.path)
//   const fallback = getFallback(rootFallback, ...path)

//   return x.optics.reduce<Applied>(
//     ({ optic, ...$ }, descriptor_, i) => {
//       const descriptor = { ...descriptor_, fallback }
//       switch (descriptor.tag) {
//         default: return fn.exhaustive(descriptor)
//         case 'applicative': return { key, path, optic: compose(optic, applicative(descriptor)), fallback: [descriptor.fallback] } satisfies Applied
//         case 'declaration': return { key, path, optic: compose(optic, declaration(descriptor)), fallback: descriptor.fallback } satisfies Applied
//         case 'fromNullable': return { key, path, optic: compose(optic, fromNullable(descriptor)), fallback: descriptor.fallback } satisfies Applied
//         case 'fromPredicate': return { key, path, optic: compose(optic, fromPredicate(descriptor)), fallback: descriptor.fallback } satisfies Applied
//         case 'index': return { key, path, optic: compose(optic, index(descriptor)), fallback: descriptor.fallback } satisfies Applied
//         case 'prop': return { key, path, optic: compose(optic, prop(descriptor)), fallback: descriptor.fallback } satisfies Applied
//       }
//     },
//     { key: '', path: Array.of<string>(), optic: _.Iso.declare() as Optic.Any, fallback: rootFallback } satisfies Applied
//   )
// }
