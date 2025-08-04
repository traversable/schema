import * as v from 'valibot'
import {
  accessor,
  Equal,
  ident,
  joinPath,
  Object_is,
  Object_keys,
  stringifyKey,
  stringifyLiteral,
} from '@traversable/registry'
import {
  F,
  Tag,
  hasType,
  tagged,
  inlinePrimitiveCheck,
  isNullary,
  isAnyObject,
  isPrimitive,
  schemaOrdering,
  Invariant,
} from '@traversable/valibot-types'

import { check } from './check.js'
import { toType } from './to-type.js'

export type Path = (string | number)[]

export interface Scope extends F.Functor.Index {
  bindings: Map<string, string>
  isOptional: boolean
}

export type Builder = (left: Path, right: Path, index: Scope) => string

const defaultIndex = () => ({
  ...F.defaultIndex,
  bindings: new Map(),
  isOptional: false,
}) satisfies Scope

const deepEqual_unsupported = [
  // 'promise',
] as const satisfies any[]

const deepEqual_unfuzzable = [
  ...deepEqual_unsupported,
  'promise',
  'custom',
] as const satisfies any[]

type UnsupportedSchema = F.V.Catalog[typeof deepEqual_unsupported[number]]

function isUnsupported(x: unknown): x is UnsupportedSchema {
  return hasType(x) && deepEqual_unsupported.includes(x.type as never)
}

function isCompositeTypeName(x: string): boolean {
  switch (x) {
    case 'array': return true
    case 'record': return true
    case 'object': return true
    case 'looseObject': return true
    case 'strictObject': return true
    case 'objectWithRest': return true
    case 'tuple': return true
    case 'looseTuple': return true
    case 'strictTuple': return true
    case 'tupleWithRest': return true
    default: return false
  }
}

function requiresObjectIs(x: unknown): boolean {
  return tagged('NaN', x)
    || tagged('number', x)
    || tagged('bigint', x)
    || tagged('enum', x)
    || tagged('literal', x)
    || (tagged('union', x) && x.options.some(requiresObjectIs))
}

/**
 * Specialization of
 * [`TC39: SameValueZero`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevaluezero)
 * that operates on numbers
 */
function SameNumberOrFail(l: (string | number)[], r: (string | number)[], ix: Scope) {
  const X = joinPath(l, ix.isOptional)
  const Y = joinPath(r, ix.isOptional)
  return `if (${X} !== ${Y} && (${X} === ${X} || ${Y} === ${Y})) return false;`
}

/**
 * Specified by
 * [`TC39: SameValue`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-samevalue)
 */
function SameValueOrFail(l: (string | number)[], r: (string | number)[], ix: Scope) {
  const X = joinPath(l, ix.isOptional)
  const Y = joinPath(r, ix.isOptional)
  return `if (!Object.is(${X}, ${Y})) return false;`
}

/**
 * Specified by
 * [`TC39: IsStrictlyEqual`](https://tc39.es/ecma262/multipage/abstract-operations.html#sec-isstrictlyequal)
 */
function StrictlyEqualOrFail(l: (string | number)[], r: (string | number)[], ix: Scope) {
  const X = joinPath(l, ix.isOptional)
  const Y = joinPath(r, ix.isOptional)
  return `if (${X} !== ${Y}) return false;`
}

export const writeableDefaults = {
  [Tag.never]: function neverDeepEqual(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [Tag.any]: function anyDeepEqual(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [Tag.unknown]: function unknownDeepEqual(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [Tag.void]: function voidDeepEqual(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) },
  [Tag.undefined]: function undefinedDeepEqual(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [Tag.null]: function nullDeepEqual(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) },
  [Tag.symbol]: function symbolDeepEqual(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) },
  [Tag.boolean]: function booleanDeepEqual(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) },
  [Tag.NaN]: function nanDeepEqual(l, r, ix) { return SameNumberOrFail(l, r, ix) },
  [Tag.bigint]: function bigintDeepEqual(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) },
  [Tag.number]: function numberDeepEqual(l, r, ix) { return SameNumberOrFail(l, r, ix) },
  [Tag.string]: function stringDeepEqual(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) },
  [Tag.enum]: function enumDeepEqual(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [Tag.picklist]: function picklistDeepEqual(l, r, ix) { return SameValueOrFail(l, r, ix) },
  [Tag.file]: function fileDeepEqual(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) },
  [Tag.blob]: function blobDeepEqual(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) },
  [Tag.function]: function functionDeepEqual(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) },
  [Tag.custom]: function customDeepEqual(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) },
  [Tag.promise]: function promiseDeepEqual(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) },
  [Tag.instance]: function promiseDeepEqual(l, r, ix) { return StrictlyEqualOrFail(l, r, ix) },
  [Tag.date]: function continueDateEquals(l, r, ix) {
    return `if (!Object.is(${joinPath(l, ix.isOptional)}?.getTime(), ${joinPath(r, ix.isOptional)}?.getTime())) return false;`
  },
} as const satisfies Record<string, Builder>

function literal(x: F.V.Literal, _: Scope): Builder {
  return function literalDeepEqual(LEFT, RIGHT, IX) {
    return typeof x.literal === 'number'
      ? SameNumberOrFail(LEFT, RIGHT, IX)
      : StrictlyEqualOrFail(LEFT, RIGHT, IX)
  }
}

function nullable(
  x: F.V.Nullable<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('nullable')(input)) {
    return Invariant.IllegalState('deepEqual', 'expected input to be a nullable schema', input)
  } else {
    return function nullableDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
      const LEFT = joinPath(LEFT_PATH, IX.isOptional)
      const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
      return isNullary(input.wrapped)
        ? [
          `if ((${LEFT} === null || ${RIGHT} === null) && ${LEFT} !== ${RIGHT}) return false`,
          x.wrapped(LEFT_PATH, RIGHT_PATH, IX)
        ].join('\n')
        : [
          `if ((${LEFT} === null || ${RIGHT} === null) && ${LEFT} !== ${RIGHT}) return false`,
          `if (${LEFT} !== ${RIGHT}) {`,
          x.wrapped(LEFT_PATH, RIGHT_PATH, IX),
          `}`,
        ].join('\n')
    }
  }
}

function nonNullable(x: F.V.NonNullable<Builder>): Builder {
  return function nonNullableDeepEqual(...args) {
    return x.wrapped(...args)
  }
}

function nullish(
  x: F.V.Nullish<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('nullish')(input)) {
    return Invariant.IllegalState('deepEqual', 'expected input to be a nullish schema', input)
  } else {
    return function nullableDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
      const LEFT = joinPath(LEFT_PATH, IX.isOptional)
      const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
      return isNullary(input.wrapped)
        ? [
          `if ((${LEFT} == null || ${RIGHT} == null) && ${LEFT} !== ${RIGHT}) return false`,
          x.wrapped(LEFT_PATH, RIGHT_PATH, IX)
        ].join('\n')
        : [
          `if ((${LEFT} == null || ${RIGHT} == null) && ${LEFT} !== ${RIGHT}) return false`,
          `if (${LEFT} !== ${RIGHT}) {`,
          x.wrapped(LEFT_PATH, RIGHT_PATH, IX),
          `}`,
        ].join('\n')
    }
  }
}

function nonNullish(x: F.V.NonNullish<Builder>): Builder {
  return function nonNullishDeepEqual(...args) {
    return x.wrapped(...args)
  }
}

function optional(
  x: F.V.Optional<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('optional')(input)) {
    return Invariant.IllegalState('deepEqual', 'expected input to be an optional schema', input)
  } else {
    return function optionalDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
      const LEFT = joinPath(LEFT_PATH, IX.isOptional)
      const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
      return isNullary(input.wrapped)
        ? [
          `if ((${LEFT} === undefined || ${RIGHT} == undefined) && ${LEFT} !== ${RIGHT}) return false`,
          x.wrapped(LEFT_PATH, RIGHT_PATH, IX)
        ].join('\n')
        : [
          `if ((${LEFT} === undefined || ${RIGHT} === undefined) && ${LEFT} !== ${RIGHT}) return false`,
          `if (${LEFT} !== ${RIGHT}) {`,
          x.wrapped(LEFT_PATH, RIGHT_PATH, IX),
          `}`,
        ].join('\n')
    }
  }
}

function exactOptional(
  x: F.V.ExactOptional<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('exactOptional')(input)) {
    return Invariant.IllegalState('deepEqual', 'expected input to be an exactOptional schema', input)
  } else {
    return function exactOptionalDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
      const LEFT = joinPath(LEFT_PATH, IX.isOptional)
      const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
      return isNullary(input.wrapped)
        ? [
          `if ((${LEFT} === undefined || ${RIGHT} == undefined) && ${LEFT} !== ${RIGHT}) return false`,
          x.wrapped(LEFT_PATH, RIGHT_PATH, IX)
        ].join('\n')
        : [
          `if ((${LEFT} === undefined || ${RIGHT} === undefined) && ${LEFT} !== ${RIGHT}) return false`,
          `if (${LEFT} !== ${RIGHT}) {`,
          x.wrapped(LEFT_PATH, RIGHT_PATH, IX),
          `}`,
        ].join('\n')
    }
  }
}

function nonOptional(
  x: F.V.NonOptional<Builder>,
): Builder {
  return function nonOptionalDeepEqual(...args) {
    return x.wrapped(...args)
  }
}

function undefinedable(
  x: F.V.Undefinedable<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('undefinedable')(input)) {
    return Invariant.IllegalState('deepEqual', 'expected input to be an undefinedable schema', input)
  } else {
    return function undefinedableDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
      const LEFT = joinPath(LEFT_PATH, IX.isOptional)
      const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
      return isNullary(input.wrapped)
        ? [
          `if ((${LEFT} === undefined || ${RIGHT} == undefined) && ${LEFT} !== ${RIGHT}) return false`,
          x.wrapped(LEFT_PATH, RIGHT_PATH, IX)
        ].join('\n')
        : [
          `if ((${LEFT} === undefined || ${RIGHT} === undefined) && ${LEFT} !== ${RIGHT}) return false`,
          `if (${LEFT} !== ${RIGHT}) {`,
          x.wrapped(LEFT_PATH, RIGHT_PATH, IX),
          `}`,
        ].join('\n')
    }
  }
}

function set(x: F.V.Set<Builder>): Builder {
  return function setDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    const LEFT_IDENT = ident(LEFT, IX.bindings)
    const RIGHT_IDENT = ident(RIGHT, IX.bindings)
    const LEFT_VALUES_IDENT = `${LEFT_IDENT}_values`
    const RIGHT_VALUES_IDENT = `${RIGHT_IDENT}_values`
    const LEFT_VALUE_IDENT = `${LEFT_IDENT}_value`
    const RIGHT_VALUE_IDENT = `${RIGHT_IDENT}_value`
    const LENGTH = ident('length', IX.bindings)
    return [
      `if (${LEFT}?.size !== ${RIGHT}?.size) return false;`,
      `const ${LEFT_VALUES_IDENT} = Array.from(${LEFT}).sort();`,
      `const ${RIGHT_VALUES_IDENT} = Array.from(${RIGHT}).sort();`,
      `let ${LENGTH} = ${LEFT_VALUES_IDENT}.length;`,
      `for (let ix = ${LENGTH}; ix-- !== 0;) {`,
      `const ${LEFT_VALUE_IDENT} = ${LEFT_VALUES_IDENT}[ix];`,
      `const ${RIGHT_VALUE_IDENT} = ${RIGHT_VALUES_IDENT}[ix];`,
      x.value([LEFT_VALUE_IDENT], [RIGHT_VALUE_IDENT], IX),
      `}`,
    ].join('\n')
  }
}

function map(x: F.V.Map<Builder>): Builder {
  return function mapDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT_ACCESSOR = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT_ACCESSOR = joinPath(RIGHT_PATH, IX.isOptional)
    const LEFT_IDENT = ident(LEFT_ACCESSOR, IX.bindings)
    const RIGHT_IDENT = ident(RIGHT_ACCESSOR, IX.bindings)
    const LEFT_ENTRIES = `${LEFT_IDENT}_entries`
    const RIGHT_ENTRIES = `${RIGHT_IDENT}_entries`
    const LEFT_KEY = `${LEFT_IDENT}_key`
    const RIGHT_KEY = `${RIGHT_IDENT}_key`
    const LEFT_VALUE = `${LEFT_IDENT}_value`
    const RIGHT_VALUE = `${RIGHT_IDENT}_value`
    return [
      `if (${LEFT_ACCESSOR}?.size !== ${RIGHT_ACCESSOR}?.size) return false;`,
      `const ${LEFT_ENTRIES} = Array.from(${LEFT_ACCESSOR}).sort();`,
      `const ${RIGHT_ENTRIES} = Array.from(${RIGHT_ACCESSOR}).sort();`,
      `for (let ix = 0, len = ${LEFT_ENTRIES}.length; ix < len; ix++) {`,
      `const [${LEFT_KEY}, ${LEFT_VALUE}] = ${LEFT_ENTRIES}[ix];`,
      `const [${RIGHT_KEY}, ${RIGHT_VALUE}] = ${RIGHT_ENTRIES}[ix];`,
      x.key([LEFT_KEY], [RIGHT_KEY], IX),
      x.value([LEFT_VALUE], [RIGHT_VALUE], IX),
      `}`,
    ].join('\n')
  }
}

function array(x: F.V.Array<Builder>): Builder {
  return function arrayDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    const LEFT_ITEM_IDENT = `${ident(LEFT, IX.bindings)}_item`
    const RIGHT_ITEM_IDENT = `${ident(RIGHT, IX.bindings)}_item`
    const LENGTH = ident('length', IX.bindings)
    const DOT = IX.isOptional ? '?.' : '.'
    return [
      `const ${LENGTH} = ${LEFT}${DOT}length;`,
      `if (${LENGTH} !== ${RIGHT}${DOT}length) return false`,
      `for (let ix = ${LENGTH}; ix-- !== 0;) {`,
      `const ${LEFT_ITEM_IDENT} = ${LEFT}[ix];`,
      `const ${RIGHT_ITEM_IDENT} = ${RIGHT}[ix];`,
      x.item([LEFT_ITEM_IDENT], [RIGHT_ITEM_IDENT], IX),
      `}`,
    ].join('\n')
  }
}

function record(x: F.V.Record<Builder>): Builder {
  return function recordDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, IX.isOptional)
    const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
    const LEFT_IDENT = ident(LEFT, IX.bindings)
    const RIGHT_IDENT = ident(RIGHT, IX.bindings)
    const LEFT_KEYS_IDENT = `${LEFT_IDENT}_keys`
    const RIGHT_KEYS_IDENT = `${RIGHT_IDENT}_keys`
    const LEFT_VALUE_IDENT = ident(`${LEFT_IDENT}[k]`, IX.bindings)
    const RIGHT_VALUE_IDENT = ident(`${RIGHT_IDENT}[k]`, IX.bindings)
    const LENGTH = ident('length', IX.bindings)
    return [
      `const ${LEFT_KEYS_IDENT} = Object.keys(${LEFT});`,
      `const ${RIGHT_KEYS_IDENT} = Object.keys(${RIGHT});`,
      `const ${LENGTH} = ${LEFT_KEYS_IDENT}.length;`,
      `if (${LENGTH} !== ${RIGHT_KEYS_IDENT}.length) return false;`,
      `for (let ix = ${LENGTH}; ix-- !== 0;) {`,
      `const k = ${LEFT_KEYS_IDENT}[ix];`,
      `if (!${RIGHT_KEYS_IDENT}.includes(k)) return false;`,
      `const ${LEFT_VALUE_IDENT} = ${LEFT}[k];`,
      `const ${RIGHT_VALUE_IDENT} = ${RIGHT}[k];`,
      x.value([LEFT_VALUE_IDENT], [RIGHT_VALUE_IDENT], IX),
      `}`,
    ].join('\n')
  }
}

function intersect(x: F.V.Intersect<Builder>): Builder {
  return function intersectDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
    return x.options.map(
      (continuation) => continuation(
        [joinPath(LEFT_PATH, IX.isOptional)],
        [joinPath(RIGHT_PATH, IX.isOptional)],
        IX
      )
    ).join('\n')
  }
}

function union(
  x: F.V.Union<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('union')(input)) {
    return Invariant.IllegalState('deepEqual', 'expected input to be a union schema', input)
  } else {
    return function unionDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
      const LEFT = joinPath(LEFT_PATH, IX.isOptional)
      const RIGHT = joinPath(RIGHT_PATH, IX.isOptional)
      const SATISFIED = ident('satisfied', IX.bindings)
      const CHECKS = input.options
        .map((option, i) => [option, i] satisfies [any, any])
        .toSorted(([l], [r]) => schemaOrdering(l, r)).map(([option, I]) => {
          const continuation = x.options[I]
          if (isPrimitive(option)) {
            return [
              `if (${inlinePrimitiveCheck(
                option,
                LEFT_PATH,
                RIGHT_PATH
              )}) {`,
              continuation([LEFT], [RIGHT], IX),
              `${SATISFIED} = true;`,
              `}`,
            ].join('\n')
          } else {
            const FUNCTION_NAME = ident('check', IX.bindings)
            return [
              check.writeable(option, { functionName: FUNCTION_NAME }),
              `if (${FUNCTION_NAME}(${LEFT}) && ${FUNCTION_NAME}(${RIGHT})) {`,
              continuation([LEFT], [RIGHT], IX),
              `${SATISFIED} = true;`,
              `}`
            ].join('\n')
          }
        })
      return [
        `let ${SATISFIED} = false;`,
        ...CHECKS,
        `if (!${SATISFIED}) return false;`,
      ].join('\n')
    }
  }
}

function variant(
  x: F.V.Variant<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('variant')(input)) {
    return Invariant.IllegalState('deepEqual', 'expected input to be a variant schema', input)
  }
  else if (!input.options.every(isAnyObject)) {
    return Invariant.IllegalState('deepEqual', 'expected every variant to be an object schema', input)
  }

  return function variantDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
    const LEFT = joinPath(LEFT_PATH, false)   // `false` because `*_PATH` already takes optionality into account
    const RIGHT = joinPath(RIGHT_PATH, false) // `false` because `*_PATH` already takes optionality into account
    const SATISFIED = ident('satisfied', IX.bindings)
    return [
      `let ${SATISFIED} = false;`,
      ...x.options.map((variant, I) => {
        const objectSchema = input.options[I]
        const literalSchema = objectSchema.entries[input.key]
        if (!tagged('literal', literalSchema)) {
          return Invariant.IllegalState('deepEqual', 'expected variant tag to be a literal schema', literalSchema)
        }
        const TAG = stringifyLiteral(literalSchema.literal)
        const LEFT_ACCESSOR = `${LEFT}${accessor(input.key, IX.isOptional)}`
        return [
          `if (${LEFT_ACCESSOR} === ${TAG}) {`,
          ...Object.entries(variant.entries).map(([key, continuation]) => {
            if (!isCompositeTypeName(objectSchema.entries[key].type)) {
              return [
                continuation([LEFT, key], [RIGHT, key], IX),
              ].join('\n')
            } else {
              return [
                `if (${LEFT_ACCESSOR} === ${TAG}) {`,
                continuation([LEFT, key], [RIGHT, key], IX),
                `}`,
              ].join('\n')
            }
          }),
          `${SATISFIED} = true;`,
          `}`,
        ].filter((_) => _ !== null).join('\n')
      }),
      `if (!${SATISFIED}) return false;`,
    ].join('\n')
  }
}

function object(
  x:
    | F.V.Object<Builder>
    | F.V.LooseObject<Builder>
    | F.V.StrictObject<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged(x.type as 'object')(input)) {
    return Invariant.IllegalState('deepEqual', `expected input to be a ${x.type} schema`, input)
  } else {
    return function objectDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
      const LEFT = joinPath(LEFT_PATH, false)   // `false` because `*_PATH` already takes optionality into account
      const RIGHT = joinPath(RIGHT_PATH, false) // `false` because `*_PATH` already takes optionality into account
      const keys = Object_keys(x.entries)
      // if we got `v.object({})`, just check that the number of keys are the same
      if (keys.length === 0) return `if (Object.keys(${LEFT}).length !== Object.keys(${RIGHT}).length) return false`
      return [
        ...Object.entries(x.entries).map(([key, continuation]) => {
          if (!isCompositeTypeName(input.entries[key].type))
            return continuation([LEFT, key], [RIGHT, key], IX)
          else {
            const LEFT_ACCESSOR = joinPath([LEFT, key], IX.isOptional)
            const RIGHT_ACCESSOR = joinPath([RIGHT, key], IX.isOptional)
            return [
              `if (${LEFT_ACCESSOR} !== ${RIGHT_ACCESSOR}) {`,
              continuation([LEFT, key], [RIGHT, key], IX),
              `}`,
            ].join('\n')
          }
        }),
      ].filter((_) => _ !== null).join('\n')
    }
  }
}

function objectWithRest(
  x: F.V.ObjectWithRest<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('objectWithRest')(input)) {
    return Invariant.IllegalState('deepEqual', `expected input to be a ${x.type} schema`, input)
  } else {
    return function objectWithRestDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
      const LEFT = joinPath(LEFT_PATH, false)   // `false` because `*_PATH` already takes optionality into account
      const RIGHT = joinPath(RIGHT_PATH, false) // `false` because `*_PATH` already takes optionality into account
      const keys = Object_keys(x.entries)
      // if we got `v.object({})`, just check that the number of keys are the same
      if (keys.length === 0) return `if (Object.keys(${LEFT}).length !== Object.keys(${RIGHT}).length) return false`
      const LENGTH = ident('length', IX.bindings)
      const LEFT_KEYS_IDENT = ident(`${LEFT_PATH}_keys`, IX.bindings)
      const KEY_IDENT = ident('key', IX.bindings)
      const KNOWN_KEY_CHECK = Object_keys(x.entries).map((k) => `${KEY_IDENT} === ${stringifyKey(k)}`).join(' || ')
      const LEFT_VALUE_IDENT = ident(`${LEFT}_value`, IX.bindings)
      const RIGHT_VALUE_IDENT = ident(`${RIGHT}_value`, IX.bindings)
      const LENGTH_CHECK = [
        `const ${LEFT_KEYS_IDENT} = Object.keys(${LEFT})`,
        `const ${LENGTH} = ${LEFT_KEYS_IDENT}.length`,
        `if (${LENGTH} !== Object.keys(${RIGHT}).length) return false`,
      ].join('\n')
      const FOR_LOOP = [
        `for (let ix = ${LENGTH}; ix-- !== 0; ) {`,
        `const ${KEY_IDENT} = ${LEFT_KEYS_IDENT}[ix];`,
        `if (${KNOWN_KEY_CHECK}) continue;`,
        `const ${LEFT_VALUE_IDENT} = ${LEFT}[${KEY_IDENT}];`,
        `const ${RIGHT_VALUE_IDENT} = ${RIGHT}[${KEY_IDENT}];`,
        x.rest([LEFT_VALUE_IDENT], [RIGHT_VALUE_IDENT], { ...IX, isOptional: true }),
        `}`,
      ].join('\n')
      return [
        LENGTH_CHECK,
        ...Object.entries(x.entries).map(([key, continuation]) => {
          if (!isCompositeTypeName(input.entries[key].type))
            return continuation([LEFT, key], [RIGHT, key], IX)
          else {
            const LEFT_ACCESSOR = joinPath([LEFT, key], IX.isOptional)
            const RIGHT_ACCESSOR = joinPath([RIGHT, key], IX.isOptional)
            return [
              `if (${LEFT_ACCESSOR} !== ${RIGHT_ACCESSOR}) {`,
              continuation([LEFT, key], [RIGHT, key], IX),
              `}`,
            ].join('\n')
          }
        }),
        FOR_LOOP,
      ].filter((_) => _ !== null).join('\n')
    }
  }
}

function tuple(
  x:
    | F.V.Tuple<Builder>
    | F.V.LooseTuple<Builder>
    | F.V.StrictTuple<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged(x.type as 'tuple')(input)) {
    return Invariant.IllegalState('deepEqual', `expected a ${x.type} schema`, input)
  } else {
    return function tupleDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
      const LEFT = joinPath(LEFT_PATH, false)   // `false` because `*_PATH` already takes optionality into account
      const RIGHT = joinPath(RIGHT_PATH, false) // `false` because `*_PATH` already takes optionality into account
      // if we got `v.tuple([])`, just check that the lengths are the same
      if (x.items.length === 0) return `if (${LEFT}.length !== ${RIGHT}.length) return false`
      const LENGTH = ident('length', IX.bindings)
      const LENGTH_CHECK = [
        `const ${LENGTH} = ${LEFT}.length;`,
        `if (${LENGTH} !== ${RIGHT}.length) return false;`,
      ].join('\n')
      return [
        LENGTH_CHECK,
        ...x.items.map((continuation, i) => {
          if (!isCompositeTypeName(input.items[i].type)) {
            return continuation([LEFT, i], [RIGHT, i], IX)
          } else {
            const LEFT_ACCESSOR = joinPath([LEFT, i], IX.isOptional)
            const RIGHT_ACCESSOR = joinPath([RIGHT, i], IX.isOptional)
            return [
              `if (${LEFT_ACCESSOR} !== ${RIGHT_ACCESSOR}) {`,
              continuation([LEFT, i], [RIGHT, i], IX),
              `}`,
            ].join('\n')
          }
        }),
      ].filter((_) => _ !== null).join('\n')
    }
  }
}

function tupleWithRest(
  x: F.V.TupleWithRest<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('tupleWithRest', input)) {
    return Invariant.IllegalState('deepEqual', 'expected input to be a tupleWithRest schema', input)
  } else {
    return function tupleWithRestDeepEqual(LEFT_PATH, RIGHT_PATH, IX) {
      const LEFT = joinPath(LEFT_PATH, false)   // `false` because `*_PATH` already takes optionality into account
      const RIGHT = joinPath(RIGHT_PATH, false) // `false` because `*_PATH` already takes optionality into account
      // if we got `v.tuple([])`, just check that the lengths are the same
      if (x.items.length === 0) return `if (${LEFT}.length !== ${RIGHT}.length) return false`
      const LENGTH = ident('length', IX.bindings)
      const LENGTH_CHECK = [
        `const ${LENGTH} = ${LEFT}.length;`,
        `if (${LENGTH} !== ${RIGHT}.length) return false;`,
      ].join('\n')
      const LEFT_ITEM_IDENT = ident(`${LEFT}_item`, IX.bindings)
      const RIGHT_ITEM_IDENT = ident(`${RIGHT}_item`, IX.bindings)
      const FOR_LOOP = [
        `if (${LENGTH} > ${x.items.length}) {`,
        `for (let ix = ${LENGTH}; ix-- !== ${x.items.length};) {`,
        `const ${LEFT_ITEM_IDENT} = ${LEFT}[ix];`,
        `const ${RIGHT_ITEM_IDENT} = ${RIGHT}[ix];`,
        x.rest([LEFT_ITEM_IDENT], [RIGHT_ITEM_IDENT], IX),
        `}`,
        `}`,
      ].join('\n')
      return [
        LENGTH_CHECK,
        ...x.items.map((continuation, i) => {
          if (!isCompositeTypeName(input.items[i].type)) {
            return continuation([LEFT, i], [RIGHT, i], IX)
          } else {
            const LEFT_ACCESSOR = joinPath([LEFT, i], IX.isOptional)
            const RIGHT_ACCESSOR = joinPath([RIGHT, i], IX.isOptional)
            return [
              `if (${LEFT_ACCESSOR} !== ${RIGHT_ACCESSOR}) {`,
              continuation([LEFT, i], [RIGHT, i], IX),
              `}`,
            ].join('\n')
          }
        }),
        FOR_LOOP,
      ].filter((_) => _ !== null).join('\n')
    }
  }
}

const fold = F.fold<Builder>((x, ix, input) => {
  switch (true) {
    default: return (void (x satisfies never), writeableDefaults.any)
    case tagged('literal')(x): return literal(x, ix as never)
    case isNullary(x): return writeableDefaults[x.type]
    case tagged('lazy')(x): return x.getter()
    case tagged('optional')(x): return optional(x, input)
    case tagged('undefinedable')(x): return undefinedable(x, input)
    case tagged('exactOptional')(x): return exactOptional(x, input)
    case tagged('nonOptional')(x): return nonOptional(x)
    case tagged('nullable')(x): return nullable(x, input)
    case tagged('nonNullable')(x): return nonNullable(x)
    case tagged('nullish')(x): return nullish(x, input)
    case tagged('nonNullish')(x): return nonNullish(x)
    case tagged('set')(x): return set(x)
    case tagged('map')(x): return map(x)
    case tagged('array')(x): return array(x)
    case tagged('record')(x): return record(x)
    case tagged('intersect')(x): return intersect(x)
    case tagged('union')(x): return union(x, input)
    case tagged('variant')(x): return variant(x, input)
    case tagged('looseTuple')(x):
    case tagged('strictTuple')(x):
    case tagged('tuple')(x): return tuple(x, input)
    case tagged('tupleWithRest')(x): return tupleWithRest(x, input)
    case tagged('looseObject')(x):
    case tagged('strictObject')(x):
    case tagged('object')(x): return object(x, input)
    case tagged('objectWithRest')(x): return objectWithRest(x, input)
  }
})

export declare namespace deepEqual {
  type Options = toType.Options & {
    /**
     * Configure the name of the generated deepEqual function
     * @default "deepEqual"
     */
    functionName?: string
    /**
     * Whether to access global identifiers like `Date` from the `globalThis` namespace
     * @default false
     */
    useGlobalThis?: boolean
  }
  /**
   * ## {@link unsupported `deepEqual.Unsupported`}
   *
   * These are the schema types that {@link deepEqual `vx.deepEqual`} does not
   * support, either because they haven't been implemented yet, or because
   * we haven't found a reasonable interpretation of them in this context.
   *
   * If you'd like to see one of these supported or have an idea for how
   * it could be done, we'd love to hear from you!
   *
   * Here's the link to [raise an issue](https://github.com/traversable/schema/issues).
   */
  type Unsupported = typeof deepEqual_unsupported
}

deepEqual.writeable = deepEqual_writeable
deepEqual.unfuzzable = deepEqual_unfuzzable
deepEqual.unsupported = deepEqual_unsupported

/**
 * ## {@link deepEqual `vx.deepEqual`}
 *
 * Derive a _"deep equal"_ function from a valibot schema.
 *
 * A "deep equal" function" (see also, {@link Equal `Equal`}) is similar to
 * lodash's `isEqual` function, except more performant, because
 * when the shape of the values being compared is known ahead of time,
 * we can optimize ahead of time, and only check what's necessary.
 *
 * Note that the deep equal generated by {@link deepEqual `vx.deepEqual`}
 * **assumes that both values have already been validated**. Passing
 * unvalidated values to the function might result in undefined behavior.
 * 
 * See also:
 * - {@link deepEqual_writeable `vx.deepEqual.writeable`}
 *
 * @example
 * import * as v from 'valibot'
 * import { vx } from '@traversable/valibot'
 * 
 * const deepEqual = vx.deepEqual(
 *   v.object({
 *     street1: v.string(),
 *     street2: v.optional(v.string()),
 *     city: v.string()
 *   })
 * )
 * 
 * deepEqual(
 *   { street1: '221B Baker St', city: 'London' },
 *   { street1: '221B Baker St', city: 'London' }
 * ) // => true
 * 
 * deepEqual(
 *   { street1: '221B Baker St', city: 'London' },
 *   { street1: '4 Privet Dr', city: 'Little Whinging' }
 * ) // => false
 */

export function deepEqual<T extends v.BaseSchema<any, any, any>>(schema: T): Equal<v.InferOutput<T>>
export function deepEqual(schema: v.BaseSchema<any, any, any>) {
  const index = defaultIndex()
  const ROOT_CHECK = requiresObjectIs(schema) ? `if (Object.is(l, r)) return true` : `if (l === r) return true`
  const BODY = fold(schema as F.V.Hole<Builder>)(['l'], ['r'], index)
  return isNullary(schema) || tagged('enum', schema)
    ? globalThis.Function('l', 'r', [
      BODY,
      'return true'
    ].join('\n'))
    : globalThis.Function('l', 'r', [
      ROOT_CHECK,
      BODY,
      'return true'
    ].join('\n'))
}

/**
 * ## {@link deepEqual_writeable `vx.deepEqual.writeable`}
 *
 * Derive a writeable (stringified) _"deep equal"_ function from a valibot schema.
 *
 * A "deep equal" function (see also, {@link Equal `Equal`}) is similar to
 * Lodash's `isEqual` function, except more performant, because
 * when the shape of the values being compared is known ahead of time,
 * we can optimize ahead of time, and only check what's necessary.
 *
 * Note that the deep equal function generated by {@link deepEqual `vx.deepEqual`}
 * **assumes that both values have already been validated**. Passing
 * unvalidated values to the function might result in undefined behavior.
 * 
 * {@link deepEqual_writeable `vx.deepEqual.writeable`} accepts an optional
 * configuration object as its second argument; documentation for those
 * options are available via hover on autocompletion.
 * 
 * See also:
 * - {@link deepEqual `vx.deepEqual`}
 *
 * @example
 * import * as v from 'valibot'
 * import { vx } from '@traversable/valibot'
 * 
 * const deepEqual = vx.deepEqual.writeable(
 *   v.object({
 *     street1: v.string(),
 *     street2: v.optional(v.string()),
 *     city: v.string(),
 *   }),
 *   { typeName: 'Address' }
 * )
 * 
 * console.log(deepEqual) 
 * // =>
 * // type Address = { street1: string; street2?: string; city: string; }
 * // function deepEqual(x: Address, y: Address) {
 * //   if (x === y) return true;
 * //   if (x.street1 !== y.street1) return false;
 * //   if (x.street2 !== y.street2) return false;
 * //   if (x.city !== y.city) return false;
 * //   return true;
 * // }
 */

function deepEqual_writeable(schema: v.BaseSchema<any, any, any>, options?: deepEqual.Options): string {
  const index = { ...defaultIndex(), ...options } satisfies Scope
  const compiled = fold(schema as F.V.Hole<Builder>)(['l'], ['r'], index)
  const FUNCTION_NAME = options?.functionName ?? 'deepEqual'
  const inputType = toType(schema, options)
  const TYPE = options?.typeName ?? inputType
  const ROOT_CHECK = requiresObjectIs(schema) ? `if (Object.is(l, r)) return true` : `if (l === r) return true`
  const BODY = compiled.length === 0 ? null : compiled
  return (
    isNullary(schema) || tagged('enum', schema)
      ? [
        options?.typeName === undefined ? null : inputType,
        `function ${FUNCTION_NAME} (l: ${TYPE}, r: ${TYPE}) {`,
        BODY,
        `return true;`,
        `}`,
      ]
      : [
        options?.typeName === undefined ? null : inputType,
        `function ${FUNCTION_NAME} (l: ${TYPE}, r: ${TYPE}) {`,
        ROOT_CHECK,
        BODY,
        `return true;`,
        `}`
      ]
  ).filter((_) => _ !== null).join('\n')
}
