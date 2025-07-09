import * as fc from 'fast-check'

import type { SeedMap } from './generator.js'
import * as Bounds from './generator-bounds.js'
import { TypeNames } from './typename.js'
import { byTag } from './seed.js'

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
  any?: {}
  array?: ArrayParams
  bigint?: BigIntParams
  boolean?: {}
  catch?: {}
  custom?: {}
  date?: {}
  default?: {}
  enum?: {}
  file?: {}
  int?: IntegerParams
  intersection?: {}
  lazy?: {}
  literal?: {}
  map?: {}
  nan?: {}
  never?: {}
  nonoptional?: {}
  null?: {}
  nullable?: {}
  number?: NumberParams
  object?: {}
  optional?: {}
  pipe?: {}
  readonly?: {}
  record?: {}
  set?: {}
  string?: StringParams
  success?: {}
  symbol?: {}
  template_literal?: {}
  transform?: {}
  tuple?: {}
  undefined?: {}
  union?: {}
  unknown?: {}
  void?: {}
  interface?: {}
  promise?: {}
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
  minDepth: number
  // minDepth: 1 | 2 | 3 | 4 | 5
}
export interface Config<T = never> extends OptionsBase<T>, byTypeName {}

export type Constraints = {
  any?: {}
  array?: { minLength?: number, maxLength?: number }
  bigint?: { min: undefined | bigint, max: undefined | bigint, multipleOf?: bigint | null }
  boolean?: {}
  catch?: {}
  custom?: {}
  date?: {}
  default?: {}
  enum?: {}
  file?: {}
  int?: { min: undefined | number, max: undefined | number, multipleOf?: number } & fc.IntegerConstraints
  intersection?: {}
  lazy?: {}
  literal?: {}
  map?: {}
  nan?: {}
  never?: {}
  nonoptional?: {}
  null?: {}
  nullable?: {}
  number?: { min?: undefined | number, max?: undefined | number, multipleOf?: number } & fc.DoubleConstraints
  object?: ObjectConstraints
  optional?: {}
  pipe?: {}
  prefault?: {}
  readonly?: {}
  record?: fc.DictionaryConstraints
  set?: {}
  string?: fc.StringConstraints
  success?: {}
  symbol?: {}
  template_literal?: fc.ArrayConstraints
  transform?: {}
  tuple?: fc.ArrayConstraints
  undefined?: {}
  union?: fc.ArrayConstraints
  unknown?: {}
  void?: {}
  promise?: {}
  ['*']?: fc.OneOfConstraints
}

export interface byTypeName extends Required<Omit<Constraints, 'array' | 'object'>> {
  object: fc.UniqueArrayConstraintsRecommended<[k: string, v: unknown], string>
  array: fc.IntegerConstraints
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
  any: {},
  array: {
    minLength: 0,
    maxLength: 0x10
  },
  bigint: {
    min: undefined,
    max: undefined,
    multipleOf: null,
  },
  boolean: {},
  catch: {},
  custom: {},
  date: {},
  default: {},
  enum: {},
  file: {},
  int: {
    min: undefined,
    max: undefined,
    multipleOf: Number.NaN,
  },
  intersection: {},
  lazy: {},
  literal: {},
  map: {},
  nan: {},
  never: {},
  nonoptional: {},
  null: {},
  nullable: {},
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
  optional: {},
  pipe: {},
  prefault: {},
  readonly: {},
  record: {
    depthIdentifier: fc.createDepthIdentifier(),
    maxKeys: 3,
    minKeys: 1,
    noNullPrototype: false,
    size: 'xsmall',
  } satisfies fc.DictionaryConstraints,
  set: {},
  string: {
    minLength: 0,
    maxLength: 0x100,
    size: 'xsmall',
    unit: 'grapheme-ascii',
  } satisfies fc.StringConstraints,
  success: {},
  symbol: {},
  template_literal: {
    minLength: 0,
    maxLength: 10,
    depthIdentifier: fc.createDepthIdentifier(),
    size: 'xsmall',
  } satisfies fc.ArrayConstraints,
  transform: {},
  tuple: {
    minLength: 1,
    maxLength: 3,
    size: 'xsmall',
    depthIdentifier: fc.createDepthIdentifier(),
  } satisfies fc.ArrayConstraints,
  undefined: {},
  union: {
    depthIdentifier: fc.createDepthIdentifier(),
    minLength: 1,
    maxLength: 3,
    size: 'xsmall',
  } satisfies fc.ArrayConstraints,
  unknown: {},
  void: {},
  promise: {},
  ['*']: {
    maxDepth: 3,
    depthIdentifier: fc.createDepthIdentifier(),
    depthSize: 'xsmall',
    withCrossShrink: true,
  } satisfies fc.OneOfConstraints,
} as const satisfies { [K in keyof Constraints]-?: Required<Constraints[K]> }


export const paramsDefaults = {
  object: objectDefaults,
  any: {},
  array: {
    minLength: Bounds.defaults.array[0],
    maxLength: Bounds.defaults.array[1],
  },
  bigint: {
    min: Bounds.defaults.bigint[0],
    max: Bounds.defaults.bigint[1],
  },
  boolean: {},
  catch: {},
  custom: {},
  date: {},
  default: {},
  enum: {},
  file: {},
  int: {
    min: Bounds.defaults.int[0],
    max: Bounds.defaults.int[1]
  },
  intersection: {},
  lazy: {},
  literal: {},
  map: {},
  nan: {},
  never: {},
  nonoptional: {},
  null: {},
  nullable: {},
  number: {
    min: Bounds.defaults.number[0],
    max: Bounds.defaults.number[1],
    noNaN: true,
    noDefaultInfinity: true,
    minExcluded: false,
    maxExcluded: false,
    noInteger: false,
  },
  optional: {},
  pipe: {},
  readonly: {},
  record: {
    depthIdentifier: fc.createDepthIdentifier(),
    maxKeys: 3,
    minKeys: 1,
    noNullPrototype: false,
    size: 'xsmall',
  } satisfies fc.DictionaryConstraints,
  set: {},
  string: {
    minLength: Bounds.defaults.string[0],
    maxLength: Bounds.defaults.string[1],
    size: 'xsmall',
    unit: 'grapheme-ascii',
  } satisfies fc.StringConstraints,
  success: {},
  symbol: {},
  template_literal: {},
  transform: {},
  tuple: {
    minLength: 1,
    maxLength: 3,
    size: 'xsmall',
    depthIdentifier: fc.createDepthIdentifier(),
  } satisfies fc.ArrayConstraints,
  undefined: {},
  union: {
    depthIdentifier: fc.createDepthIdentifier(),
    minLength: 1,
    maxLength: 3,
    size: 'xsmall',
  } satisfies fc.ArrayConstraints,
  unknown: {},
  void: {},
  promise: {},
  ['*']: {
    maxDepth: 3,
    depthIdentifier: fc.createDepthIdentifier(),
    depthSize: 'xsmall',
    withCrossShrink: true,
  } satisfies fc.OneOfConstraints,
}

export const unsupportedSchemas = ['promise'] satisfies (keyof SeedMap)[]

export const defaults = {
  exclude: unsupportedSchemas,
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
    any = defaultConstraints.any,
    array: {
      maxLength: arrayMax = defaultConstraints.array.maxLength,
      minLength: arrayMin = defaultConstraints.array.minLength,
      ...ARRAY
    } = defaultConstraints.array,
    bigint: {
      max: bigIntMax,
      min: bigIntMin,
      ...BIGINT
    } = defaultConstraints.bigint,
    boolean = defaultConstraints.boolean,
    catch: catch_ = defaultConstraints.catch,
    custom = defaultConstraints.custom,
    date = defaultConstraints.date,
    default: default_ = defaultConstraints.default,
    enum: enum_ = defaultConstraints.enum,
    file = defaultConstraints.file,
    int: {
      max: intMax,
      min: intMin,
      // ...INT
    } = defaultConstraints.int,
    intersection = defaultConstraints.intersection,
    lazy = defaultConstraints.lazy,
    literal = defaultConstraints.literal,
    map = defaultConstraints.map,
    nan = defaultConstraints.nan,
    never = defaultConstraints.never,
    nonoptional = defaultConstraints.nonoptional,
    null: null_ = defaultConstraints.null,
    nullable = defaultConstraints.nullable,
    number: {
      max: numberMax,
      maxExcluded: numberMaxExcluded,
      min: numberMin,
      minExcluded: numberMinExcluded,
      // ...NUMBER
    } = defaultConstraints.number,
    optional = defaultConstraints.optional,
    pipe = defaultConstraints.pipe,
    prefault = defaultConstraints.prefault,
    readonly = defaultConstraints.readonly,
    record: {
      maxKeys: recordMaxKeys = defaultConstraints.record.maxKeys,
      minKeys: recordMinKeys = defaultConstraints.record.minKeys,
      size: recordSize = defaultConstraints.record.size,
      ...RECORD
    } = defaultConstraints.record,
    set = defaultConstraints.set,
    string: {
      minLength: stringMinLength,
      maxLength: stringMaxLength,
      size: stringSize = defaultConstraints.string.size,
      // ...STRING
    } = defaultConstraints.string,
    success = defaultConstraints.success,
    symbol = defaultConstraints.symbol,
    template_literal: {
      maxLength: templateLiteralMaxLength,
      minLength: templateLiteralMinLength,
      size: templateLiteralSize,
      ...TEMPLATE_LITERAL
    } = defaultConstraints.template_literal,
    transform = defaultConstraints.transform,
    tuple: {
      maxLength: tupleMaxLength = defaultConstraints.tuple.maxLength,
      minLength: tupleMinLength = defaultConstraints.tuple.minLength,
      ...TUPLE
    } = defaultConstraints.tuple,
    undefined: undefined_ = defaultConstraints.undefined,
    union: {
      minLength: unionMinLength = defaultConstraints.union.minLength,
      maxLength: unionMaxLength = defaultConstraints.union.maxLength,
      size: unionSize = defaultConstraints.union.size,
      ...UNION
    } = defaultConstraints.union,
    unknown = defaultConstraints.unknown,
    void: void_ = defaultConstraints.void,
    promise = defaultConstraints.promise,
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
    any,
    array: {
      ...ARRAY,
      min: arrayMin,
      max: arrayMax,
    },
    bigint: {
      ...BIGINT,
      max: bigIntMax,
      min: bigIntMin,
    },
    boolean,
    catch: catch_,
    custom,
    date,
    default: default_,
    enum: enum_,
    file,
    int: {
      // ...INT,
      max: intMax,
      min: intMin,
    },
    intersection,
    lazy,
    literal,
    map,
    nan,
    never,
    nonoptional,
    null: null_,
    nullable,
    number: {
      max: numberMax,
      min: numberMin,
      maxExcluded: numberMaxExcluded,
      minExcluded: numberMinExcluded,
    },
    optional,
    pipe,
    prefault,
    readonly,
    record: {
      ...RECORD,
      maxKeys: recordMaxKeys,
      minKeys: recordMinKeys,
      size: recordSize,
    },
    set,
    string: {
      // ...STRING,
      minLength: stringMinLength,
      maxLength: stringMaxLength,
      size: stringSize,
    },
    success,
    symbol,
    template_literal: {
      ...TEMPLATE_LITERAL,
      maxLength: templateLiteralMaxLength,
      minLength: templateLiteralMinLength,
      size: templateLiteralSize,
    },
    transform,
    tuple: {
      ...TUPLE,
      minLength: tupleMinLength,
      maxLength: tupleMaxLength,
    },
    undefined: undefined_,
    union: {
      ...UNION,
      minLength: unionMinLength,
      maxLength: unionMaxLength,
      size: unionSize,
    },
    unknown,
    void: void_,
    promise,
  }
}

