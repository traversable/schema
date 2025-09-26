import * as fc from 'fast-check'

import type { SeedMap } from './generator.js'
import { byTag } from './generator-seed.js'
import { TypeNames } from './typename.js'

export type ArrayParams = {
  /* length?: number */
  minLength?: number
  maxLength?: number
}

export type IntegerParams = {
  minimum?: number
  maximum?: number
  multipleOf?: number
}

export type NumberParams = {
  minimum?: number
  maximum?: number
  minExcluded?: boolean
  maxExcluded?: boolean
  multipleOf?: number
}

export type BigIntParams = {
  minimum?: bigint
  maximum?: bigint
  multipleOf?: bigint
}

export type StringParams = {
  /* prefix?: string, postfix?: string, pattern?: string, substring?: string, length?: number */
  minLength?: number
  maxLength?: number
}

export type Params = {
  array?: ArrayParams
  bigint?: BigIntParams
  boolean?: {}
  date?: {}
  enum?: {}
  intersection?: {}
  literal?: {}
  never?: {}
  null?: {}
  number?: NumberParams
  object?: {}
  optional?: {}
  record?: {}
  string?: StringParams
  symbol?: {}
  tuple?: {}
  undefined?: {}
  union?: {}
  unknown?: {}
}

export interface Options<T = never> extends Partial<OptionsBase<T>>, Constraints {}

export type InferConfigType<S> = S extends Options<infer T> ? T : never

export interface OptionsBase<
  T = never,
  K extends
  | string & keyof T
  = string & keyof T
> {
  include: readonly K[]
  exclude: readonly K[]
  root: '*' | K
  sortBias: { [K in keyof SeedMap]+?: number }
  forceInvalid: boolean
}
export interface Config<T = never> extends OptionsBase<T>, byTypeName {}

export type Constraints = {
  array?: { minLength?: number, maxLength?: number, unbounded?: boolean }
  bigint?: { min: undefined | bigint, max: undefined | bigint, multipleOf?: bigint | null, unbounded?: boolean }
  boolean?: {}
  date?: {}
  enum?: {}
  // int?: { min: undefined | number, max: undefined | number, multipleOf?: number } & fc.IntegerConstraints
  allOf?: {}
  literal?: {}
  never?: {}
  null?: {}
  number?: { min?: undefined | number, max?: undefined | number, multipleOf?: number, unbounded?: boolean } & fc.DoubleConstraints
  object?: ObjectConstraints
  optional?: {}
  record?: fc.DictionaryConstraints
  string?: fc.StringConstraints & { unbounded?: boolean }
  symbol?: {}
  tuple?: fc.ArrayConstraints
  undefined?: {}
  anyOf?: fc.ArrayConstraints
  oneOf?: fc.ArrayConstraints
  unknown?: {}
  ['*']?: fc.OneOfConstraints
}

export interface byTypeName extends Required<Omit<Constraints, 'array' | 'object'>> {
  object: fc.UniqueArrayConstraintsRecommended<[k: string, v: unknown], string>
  array: fc.IntegerConstraints & { unbounded?: boolean }
}

export type ObjectConstraints =
  & Omit<fc.UniqueArrayConstraintsRecommended<[k: string, v: unknown], string>, 'minLength' | 'maxLength'>
  & {
    minKeys?: number
    maxKeys?: number
    size?: fc.SizeForArbitrary
  }

const objectDefaults = {
  minKeys: 1,
  maxKeys: 3,
  size: 'xsmall',
  selector: ([k]) => k,
  comparator: 'SameValueZero',
  depthIdentifier: fc.createDepthIdentifier(),
} satisfies ObjectConstraints

export const defaultConstraints = {
  object: objectDefaults,
  array: {
    minLength: 0,
    maxLength: 0x10,
    unbounded: false,
  },
  bigint: {
    min: undefined,
    max: undefined,
    multipleOf: null,
    unbounded: false,
  },
  boolean: {},
  date: {},
  enum: {},
  // int: {
  //   min: undefined,
  //   max: undefined,
  //   multipleOf: Number.NaN,
  // },
  allOf: {},
  literal: {},
  never: {},
  null: {},
  number: {
    min: -0x10000,
    max: 0x10000,
    multipleOf: Number.NaN,
    noNaN: true,
    noDefaultInfinity: true,
    minExcluded: false,
    maxExcluded: false,
    noInteger: false,
    unbounded: false,
  },
  optional: {},
  record: {
    depthIdentifier: fc.createDepthIdentifier(),
    maxKeys: 3,
    minKeys: 1,
    noNullPrototype: false,
    size: 'xsmall',
  } satisfies fc.DictionaryConstraints,
  string: {
    minLength: 0,
    maxLength: 0x100,
    size: 'xsmall',
    unit: 'grapheme-ascii',
    unbounded: false,
  },
  symbol: {},
  tuple: {
    minLength: 1,
    maxLength: 3,
    size: 'xsmall',
    depthIdentifier: fc.createDepthIdentifier(),
  } satisfies fc.ArrayConstraints,
  undefined: {},
  anyOf: {
    depthIdentifier: fc.createDepthIdentifier(),
    minLength: 1,
    maxLength: 3,
    size: 'xsmall',
  } satisfies fc.ArrayConstraints,
  oneOf: {
    depthIdentifier: fc.createDepthIdentifier(),
    minLength: 1,
    maxLength: 3,
    size: 'xsmall',
  } satisfies fc.ArrayConstraints,
  unknown: {},
  ['*']: {
    maxDepth: 3,
    depthIdentifier: fc.createDepthIdentifier(),
    depthSize: 'xsmall',
    withCrossShrink: true,
  } satisfies fc.OneOfConstraints,
} as const satisfies { [K in keyof Constraints]-?: Required<Constraints[K]> }

export const defaults = {
  exclude: [],
  forceInvalid: false,
  include: TypeNames,
  root: '*',
  sortBias: byTag,
} as const satisfies OptionsBase<any>

export function parseOptions<Opts extends Options>(options?: Opts): Config<InferConfigType<Opts>>
export function parseOptions(options?: Options<any>): Config<any>
export function parseOptions(options: Options<any> = defaults as never): Config {
  const {
    exclude = defaults.exclude,
    forceInvalid = defaults.forceInvalid,
    include = defaults.include,
    root = defaults.root,
    sortBias = defaults.sortBias,
    ['*']: {
      maxDepth: starMaxDepth = defaultConstraints['*'].maxDepth,
      depthSize: starDepthSize = defaultConstraints['*'].depthSize,
      ...STAR
    } = defaultConstraints['*'],
    array: {
      maxLength: arrayMax = defaultConstraints.array.maxLength,
      minLength: arrayMin = defaultConstraints.array.minLength,
      unbounded: arrayUnbounded = defaultConstraints.array.unbounded,
      ...ARRAY
    } = defaultConstraints.array,
    bigint: {
      max: bigIntMax,
      min: bigIntMin,
      ...BIGINT
    } = defaultConstraints.bigint,
    boolean = defaultConstraints.boolean,
    date = defaultConstraints.date,
    enum: enum_ = defaultConstraints.enum,
    // int: {
    //   max: intMax,
    //   min: intMin,
    //   // ...INT
    // } = defaultConstraints.int,
    allOf = defaultConstraints.allOf,
    literal = defaultConstraints.literal,
    never = defaultConstraints.never,
    null: null_ = defaultConstraints.null,
    number: {
      max: numberMax,
      maxExcluded: numberMaxExcluded,
      min: numberMin,
      minExcluded: numberMinExcluded,
      unbounded: numberUnbounded,
      // ...NUMBER
    } = defaultConstraints.number,
    optional = defaultConstraints.optional,
    record: {
      maxKeys: recordMaxKeys = defaultConstraints.record.maxKeys,
      minKeys: recordMinKeys = defaultConstraints.record.minKeys,
      size: recordSize = defaultConstraints.record.size,
      ...RECORD
    } = defaultConstraints.record,
    string: {
      minLength: stringMinLength,
      maxLength: stringMaxLength,
      size: stringSize = defaultConstraints.string.size,
      unbounded: stringUnbounded,
      // ...STRING
    } = defaultConstraints.string,
    symbol = defaultConstraints.symbol,
    tuple: {
      maxLength: tupleMaxLength = defaultConstraints.tuple.maxLength,
      minLength: tupleMinLength = defaultConstraints.tuple.minLength,
      ...TUPLE
    } = defaultConstraints.tuple,
    undefined: undefined_ = defaultConstraints.undefined,
    anyOf: {
      minLength: anyOfMinLength = defaultConstraints.anyOf.minLength,
      maxLength: anyOfMaxLength = defaultConstraints.anyOf.maxLength,
      size: anyOfSize = defaultConstraints.anyOf.size,
      ...ANY_OF
    } = defaultConstraints.anyOf,
    oneOf: {
      minLength: oneOfMinLength = defaultConstraints.oneOf.minLength,
      maxLength: oneOfMaxLength = defaultConstraints.oneOf.maxLength,
      size: oneOfSize = defaultConstraints.oneOf.size,
      ...ONE_OF
    } = defaultConstraints.oneOf,
    unknown = defaultConstraints.unknown,
    object: {
      maxKeys: objectMaxKeys = defaultConstraints.object.maxKeys,
      minKeys: objectMinKeys = defaultConstraints.object.minKeys,
      size: objectSize = defaultConstraints.object.size,
      ...OBJECT
    } = {
      maxKeys: defaultConstraints.object.maxKeys,
      minKeys: defaultConstraints.object.minKeys,
      size: defaultConstraints.object.size,
    },
  } = options
  return {
    exclude,
    forceInvalid,
    include: include.length === 0 || include[0] === '*' ? defaults.include : include,
    root,
    sortBias: { ...defaults.sortBias, ...sortBias },
    ['*']: {
      ...STAR,
      depthSize: starDepthSize,
      maxDepth: starMaxDepth,
    },
    object: {
      ...OBJECT,
      minLength: objectMinKeys,
      maxLength: objectMaxKeys,
      size: objectSize,
    },
    array: {
      ...ARRAY,
      min: arrayMin,
      max: arrayMax,
      unbounded: arrayUnbounded,
    },
    bigint: {
      ...BIGINT,
      max: bigIntMax,
      min: bigIntMin,
    },
    boolean,
    date,
    enum: enum_,
    // int: {
    //   // ...INT,
    //   max: intMax,
    //   min: intMin,
    // },
    allOf,
    literal,
    never,
    null: null_,
    number: {
      max: numberMax,
      min: numberMin,
      maxExcluded: numberMaxExcluded,
      minExcluded: numberMinExcluded,
      unbounded: numberUnbounded,
    },
    optional,
    record: {
      ...RECORD,
      maxKeys: recordMaxKeys,
      minKeys: recordMinKeys,
      size: recordSize,
    },
    string: {
      // ...STRING,
      minLength: stringMinLength,
      maxLength: stringMaxLength,
      size: stringSize,
      unbounded: stringUnbounded,
    },
    symbol,
    tuple: {
      ...TUPLE,
      minLength: tupleMinLength,
      maxLength: tupleMaxLength,
    },
    undefined: undefined_,
    anyOf: {
      ...ANY_OF,
      minLength: anyOfMinLength,
      maxLength: anyOfMaxLength,
      size: anyOfSize,
    },
    oneOf: {
      ...ONE_OF,
      minLength: oneOfMinLength,
      maxLength: oneOfMaxLength,
      size: oneOfSize,
    },
    unknown,
  }
}
