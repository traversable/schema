import * as fc from 'fast-check'

import type { SeedMap } from './generator.js'
import * as Bounds from './generator-bounds.js'
import { byTag } from './generator-seed.js'
import { TypeNames } from '@traversable/json-schema-types'

export type ArrayParams = {
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
  boolean?: {}
  const?: {}
  enum?: {}
  integer?: IntegerParams
  allOf?: {}
  never?: {}
  null?: {}
  number?: NumberParams
  object?: {}
  record?: {}
  string?: StringParams
  tuple?: {}
  anyOf?: {}
  oneOf?: {}
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
  sortBias: { [K in keyof SeedMap]: number }
  forceInvalid: boolean
}
export interface Config<T = never> extends OptionsBase<T>, byTypeName {}

export type Constraints = {
  array?: { minLength?: number, maxLength?: number, unbounded?: boolean }
  boolean?: {}
  const?: {}
  enum?: {}
  integer?: { min: undefined | number, max: undefined | number, multipleOf?: number, unbounded?: boolean } & fc.IntegerConstraints
  allOf?: {}
  never?: {}
  null?: {}
  number?: { min?: undefined | number, max?: undefined | number, multipleOf?: number, unbounded?: boolean } & fc.DoubleConstraints
  object?: ObjectConstraints
  record?: RecordConstraints
  string?: fc.StringConstraints & { unbounded?: boolean }
  tuple?: fc.ArrayConstraints
  anyOf?: fc.ArrayConstraints
  oneOf?: fc.ArrayConstraints
  unknown?: {}
  ['*']?: fc.OneOfConstraints
}

export interface byTypeName extends Required<Omit<Constraints, 'array' | 'object'>> {
  object: fc.UniqueArrayConstraintsRecommended<[k: string, v: unknown], string>
  array: fc.IntegerConstraints & { unbounded?: boolean }
}

export type RecordConstraints = fc.DictionaryConstraints & {
  additionalPropertiesOnly?: boolean
  patternPropertiesOnly?: boolean
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
  boolean: {},
  const: {},
  enum: {},
  integer: {
    min: undefined,
    max: undefined,
    multipleOf: Number.NaN,
    unbounded: false,
  },
  allOf: {},
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
  record: {
    additionalPropertiesOnly: false,
    patternPropertiesOnly: false,
    depthIdentifier: fc.createDepthIdentifier(),
    maxKeys: 3,
    minKeys: 1,
    noNullPrototype: false,
    size: 'xsmall',
  } satisfies RecordConstraints,
  string: {
    minLength: Bounds.defaults.string[0],
    maxLength: Bounds.defaults.string[1],
    size: 'xsmall',
    unit: 'grapheme-ascii',
    unbounded: false,
  },
  tuple: {
    minLength: 1,
    maxLength: 3,
    size: 'xsmall',
    depthIdentifier: fc.createDepthIdentifier(),
  } satisfies fc.ArrayConstraints,
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
      unbounded: arrayUnbounded,
      ...ARRAY
    } = defaultConstraints.array,
    boolean = defaultConstraints.boolean,
    const: const_ = defaultConstraints.const,
    enum: enum_ = defaultConstraints.enum,
    integer: {
      max: intMax,
      min: intMin,
      unbounded: intUnbounded,
      // ...INT
    } = defaultConstraints.integer,
    allOf = defaultConstraints.allOf,
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
    tuple: {
      maxLength: tupleMaxLength = defaultConstraints.tuple.maxLength,
      minLength: tupleMinLength = defaultConstraints.tuple.minLength,
      ...TUPLE
    } = defaultConstraints.tuple,
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
    exclude: exclude,
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
    boolean,
    integer: {
      // ...INT,
      max: intMax,
      min: intMin,
      unbounded: intUnbounded,
    },
    allOf,
    const: const_,
    enum: enum_,
    never,
    null: null_,
    number: {
      max: numberMax,
      min: numberMin,
      maxExcluded: numberMaxExcluded,
      minExcluded: numberMinExcluded,
      unbounded: numberUnbounded,
    },
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
    tuple: {
      ...TUPLE,
      minLength: tupleMinLength,
      maxLength: tupleMaxLength,
    },
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
