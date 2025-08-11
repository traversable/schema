import * as fc from 'fast-check'

import type { SeedMap } from './generator.js'
import * as Bounds from './generator-bounds.js'
import { byTag } from './generator-seed.js'
import { TypeNames } from '@traversable/json-schema-types'

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
  minDepth: number
  // minDepth: 1 | 2 | 3 | 4 | 5
}
export interface Config<T = never> extends OptionsBase<T>, byTypeName {}

export type Constraints = {
  array?: { minLength?: number, maxLength?: number }
  boolean?: {}
  const?: {}
  enum?: {}
  integer?: { min: undefined | number, max: undefined | number, multipleOf?: number } & fc.IntegerConstraints
  intersection?: {}
  never?: {}
  null?: {}
  number?: { min?: undefined | number, max?: undefined | number, multipleOf?: number } & fc.DoubleConstraints
  object?: ObjectConstraints
  record?: RecordConstraints
  string?: fc.StringConstraints
  tuple?: fc.ArrayConstraints
  union?: fc.ArrayConstraints
  unknown?: {}
  ['*']?: fc.OneOfConstraints
}

export interface byTypeName extends Required<Omit<Constraints, 'array' | 'object'>> {
  object: fc.UniqueArrayConstraintsRecommended<[k: string, v: unknown], string>
  array: fc.IntegerConstraints
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
    maxLength: 0x10
  },
  boolean: {},
  const: {},
  enum: {},
  integer: {
    min: undefined,
    max: undefined,
    multipleOf: Number.NaN,
  },
  intersection: {},
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
  } satisfies fc.StringConstraints,
  tuple: {
    minLength: 1,
    maxLength: 3,
    size: 'xsmall',
    depthIdentifier: fc.createDepthIdentifier(),
  } satisfies fc.ArrayConstraints,
  union: {
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
  minDepth: -1,
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
    minDepth: rootMinDepth = defaults.minDepth,
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
      ...ARRAY
    } = defaultConstraints.array,
    boolean = defaultConstraints.boolean,
    const: const_ = defaultConstraints.const,
    enum: enum_ = defaultConstraints.enum,
    integer: {
      max: intMax,
      min: intMin,
      // ...INT
    } = defaultConstraints.integer,
    intersection = defaultConstraints.intersection,
    never = defaultConstraints.never,
    null: null_ = defaultConstraints.null,
    number: {
      max: numberMax,
      maxExcluded: numberMaxExcluded,
      min: numberMin,
      minExcluded: numberMinExcluded,
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
      // ...STRING
    } = defaultConstraints.string,
    tuple: {
      maxLength: tupleMaxLength = defaultConstraints.tuple.maxLength,
      minLength: tupleMinLength = defaultConstraints.tuple.minLength,
      ...TUPLE
    } = defaultConstraints.tuple,
    union: {
      minLength: unionMinLength = defaultConstraints.union.minLength,
      maxLength: unionMaxLength = defaultConstraints.union.maxLength,
      size: unionSize = defaultConstraints.union.size,
      ...UNION
    } = defaultConstraints.union,
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
    minDepth: rootMinDepth,
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
    },
    boolean,
    integer: {
      // ...INT,
      max: intMax,
      min: intMin,
    },
    intersection,
    const: const_,
    enum: enum_,
    never,
    null: null_,
    number: {
      max: numberMax,
      min: numberMin,
      maxExcluded: numberMaxExcluded,
      minExcluded: numberMinExcluded,
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
    },
    tuple: {
      ...TUPLE,
      minLength: tupleMinLength,
      maxLength: tupleMaxLength,
    },
    union: {
      ...UNION,
      minLength: unionMinLength,
      maxLength: unionMaxLength,
      size: unionSize,
    },
    unknown,
  }
}
