export * from './combinators.js'
export * as Recursive from './recursive.js'
export * as toString from './toString.js'
export { enum } from './enum.js'

export type {
  typeOf as typeof,
  // Free,
  // Leaf,
  // F,
  Unspecified,
  // Fixpoint,
  invalid,
  top,
  bottom,
} from './core.js'
export {
  isLeaf,
} from './core.js'

export type {
  AnySchema,
  Schema,
  F,
  Fixpoint,
  Free,
  FullSchema,
} from './schema.js'
export {
  Functor,
  fold,
  unfold,
} from './schema.js'

export {
  never,
  unknown,
  any,
  void,
  null,
  undefined,
  symbol,
  boolean,
  integer,
  inline,
  bigint,
  number,
  string,
  eq,
  optional,
  array,
  record,
  union,
  intersect,
  tuple,
  object,
  //
} from './schema.js'

// declare module "@traversable/core" {
//   const _: typeof import("./ast.js").t
//   const Tag: typeof import("./ast.js").Tag
//   const Tags: typeof import("./ast.js").Tags
//   const isComposite: typeof import("./ast.js").isComposite
//   const isOptional: typeof import("./ast.js").isOptional
//   const isOptionalNotUndefined: typeof import("./ast.js").isOptionalNotUndefined
//   type type<T extends Config> = import("./ast.js").type<T>
//   type leaf<Tag extends Tag.Scalar, T> = import("./ast.js").leaf<Tag, T>
//   const null_: typeof import("./ast.js").null_
//   type null$ = import("./ast.js").null$
//   type array_<T extends AST.Node> = import("./ast.js").array_<T>
//   type array_toJSON<T extends AST.Node> = import("./ast.js").array_toJSON<T>
//   type array_toString<T extends AST.Node> = import("./ast.js").array_toString<T>
//   type object_<T extends { [x: string]: AST.Node }> = import("./ast.js").object_<T>
//   type object_toString = import("./ast.js").object_toString
//   type object_toJSON<T extends { [x: string]: AST.Node; } = { [x: string]: AST.Node; }> = import("./ast.js").object_toJSON<T>
//   type object_is<T extends { [x: string]: AST.Node }> = import("./ast.js").object_is<T>
//   const object_is: typeof import("./ast.js").object_is
//   const objectDefault: typeof import("./ast.js").objectDefault
//   const objectEOPT: typeof import("./ast.js").objectEOPT
//   const object_isEOPT: typeof import("./ast.js").object_isEOPT
//   type optional_<T extends AST.Node> = import("./ast.js").optional_<T>
//   const optional_: typeof import("./ast.js").optional_
//   type optional_toJSON<T extends AST.Node = AST.Node> = import("./ast.js").optional_toJSON<T>
//   type optional_toString<T extends AST.Node = AST.Node> = import("./ast.js").optional_toString<T>
// }
// export * as path from "./toPaths.js"
// const toJSON: typeof import("./ast.js").toJSON
// const toString: typeof import("./ast.js").toString
// export type { AST, Config, Meta, infer } from "./ast.js"
// export type { AST } from "./ast-lite.js"
// export { toJSON, toString } from "./ast.js"


// export * as t from './schema.js'

// import { toString, toTypeString } from './recursive.js'

// import * as _ from './schema.js'

//
// import never_ = _.never
// import unknown_ = _.unknown
// import any_ = _.any
// import undefined_ = _.undefined
// import symbol_ = _.symbol
// import boolean_ = _.boolean
// import bigint_ = _.bigint
// import integer_ = _.integer
// import number_ = _.number
// import string_ = _.string
// import eq = _.eq
// import array = _.array
// import record = _.record
// import optional = _.optional
// import object_ = _.object
// import tuple = _.tuple
// import union = _.union
// import intersect = _.intersect
// import void_ = _.void_
// import null_ = _.null_
// import inline = core.inline

// export declare namespace t {
//   export {
//     typeOf as typeof,
//     // void_ as void,
//     // null_ as null,
//     // never_ as never,
//     // unknown_ as unknown,
//     // any_ as any,
//     // undefined_ as undefined,
//     // symbol_ as symbol,
//     // boolean_ as boolean,
//     // bigint_ as bigint,
//     // integer_ as integer,
//     // number_ as number,
//     // string_ as string,
//     // eq,
//     // array,
//     // record,
//     // optional,
//     // object_ as object,
//     // tuple,
//     // union,
//     // intersect,
//     //
//     top,
//     bottom,
//     // inline,
//     //
//     F,
//     Fixpoint,
//     Free,
//     Functor,
//     invalid,
//     Leaf,
//     Schema,
//     toString,
//     toTypeString,
//   }

//   // re-exports, as an escape hatch to avoid colliding with keywords
//   export {
//     // void_,
//     // null_,
//     typeOf,
//   }
// }

// export namespace t {
//   export const isLeaf = core.isLeaf;
// }

// t.never = never_
// t.unknown = unknown_
// t.any = any_
// t.null = _.null
// t.void = _.void
// t.undefined = undefined_
// t.symbol = symbol_
// t.boolean = boolean_
// t.bigint = bigint_
// t.integer = integer_
// t.number = number_
// t.string = string_
// t.eq = eq
// t.array = array
// t.record = record
// t.optional = optional
// t.object = object_
// t.tuple = tuple
// t.union = union
// t.intersect = intersect
// //
// t.toString = toString
// t.toTypeString = toTypeString
