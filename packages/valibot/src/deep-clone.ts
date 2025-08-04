import * as v from 'valibot'
import { accessor, has, joinPath, Object_entries, Object_keys, parseKey, stringifyKey, stringifyLiteral } from '@traversable/registry'
import type { AnyTag, Discriminated } from '@traversable/valibot-types'
import {
  F,
  Invariant,
  Tag,
  areAllObjects,
  hasType,
  isNullary,
  tagged,
  deepCloneIsPrimitive as isPrimitive,
  deepCloneInlinePrimitiveCheck as inlinePrimitiveCheck,
  deepCloneSchemaOrdering as schemaOrdering,
  isAnyObject,
  getTags,
} from '@traversable/valibot-types'

import { check } from './check.js'
import { toType } from './to-type.js'

export type Path = (string | number)[]
export type Builder = (prev: Path, next: Path, ix: Scope) => string

export interface Scope extends F.Functor.Index {
  bindings: Map<string, string>
  isRoot: boolean
  isProperty: boolean
  mutateDontAssign: boolean
  needsReturnStatement: boolean
  stripTypes: boolean
}

type IndexedSchema = v.BaseSchema<unknown, unknown, never> & { index?: number }
interface ExtractedUnions {
  unions: IndexedSchema[]
  schema: F.V.Fixpoint
}

function defaultIndex(options?: Partial<Scope>): Scope {
  return {
    ...F.defaultIndex,
    bindings: new Map(),
    isProperty: false,
    isRoot: true,
    mutateDontAssign: false,
    needsReturnStatement: true,
    stripTypes: false,
    ...options,
  }
}

type UnsupportedSchema = F.V.Catalog[typeof deepClone_unsupported[number]]
const deepClone_unsupported = [
  'promise',
] satisfies AnyTag[]

function isUnsupported(x: unknown): x is UnsupportedSchema {
  return hasType(x) && deepClone_unsupported.includes(x.type as never)
}

function isVoidOrUndefined(x: unknown): boolean {
  switch (true) {
    default: return false
    case tagged('void')(x):
    case tagged('undefined')(x): return true
    case tagged('undefinedable')(x):
    case tagged('optional')(x):
    case tagged('nonOptional')(x):
    case tagged('exactOptional')(x):
    case tagged('nullish')(x):
    case tagged('nonNullish')(x):
    case tagged('nullable')(x):
    case tagged('nonNullable')(x): return isVoidOrUndefined(x.wrapped)
    case tagged('lazy')(x): return isVoidOrUndefined(x.getter())
    case tagged('union')(x): return x.options.some(isVoidOrUndefined)
  }
}

function isDefinedOptional<T>(x: unknown): x is F.V.Optional<T> {
  return (tagged('exactOptional')(x) && !isVoidOrUndefined(x.wrapped))
    || (tagged('optional')(x) && !isVoidOrUndefined(x.wrapped))
}

function isDeepPrimitive(x: unknown): boolean {
  switch (true) {
    default: return false
    case isPrimitive(x): return true
    case tagged('undefinedable')(x):
    case tagged('optional')(x):
    case tagged('nonOptional')(x):
    case tagged('exactOptional')(x):
    case tagged('nullish')(x):
    case tagged('nonNullish')(x):
    case tagged('nullable')(x):
    case tagged('nonNullable')(x): return isDeepPrimitive(x.wrapped)
    case tagged('lazy')(x): return isDeepPrimitive(x.getter())
    case tagged('union')(x): return x.options.every(isVoidOrUndefined)
  }
}

function isAtomic(x: unknown): boolean {
  switch (true) {
    default: return false
    case tagged('void', x):
    case tagged('null', x):
    case tagged('undefined', x):
    case tagged('symbol', x):
    case tagged('boolean', x):
    case tagged('NaN', x):
    case tagged('bigint', x):
    case tagged('number', x):
    case tagged('string', x):
    case tagged('enum', x):
    case tagged('literal', x): return true
    case tagged('undefinedable', x):
    case tagged('optional', x):
    case tagged('nonOptional', x):
    case tagged('exactOptional', x):
    case tagged('nullable', x):
    case tagged('nonNullable', x):
    case tagged('nullish', x):
    case tagged('nonNullish', x): return isAtomic(x.wrapped)
  }
}

const isPrimitiveMember = (x: unknown) => isPrimitive(x) || tagged('literal')(x)
const isNonPrimitiveMember = (x: unknown) => !isPrimitiveMember(x)

function getPredicates(unions: IndexedSchema[], stripTypes: boolean) {
  return unions
    .filter(isNonPrimitiveMember)
    .map(({ index, ...x }) => check.writeable(x, { stripTypes, functionName: `check_${index}`, }))
}

function extractUnions(schema: v.BaseSchema<unknown, unknown, never>): ExtractedUnions {
  let index = 0
  let unions = Array.of<IndexedSchema>()
  const out = F.fold<F.V.Fixpoint>((x) => {
    if (tagged('variant')(x)) {
      return x
    } else if (!tagged('union')(x) || getTags(x.options) !== null) {
      return x
    } else {
      const sorted = x.options
        .toSorted(schemaOrdering)
        .map((union) => isPrimitiveMember(union) ? union : { ...union, index: index++ })
      if (sorted.length === 1) unions.push(sorted[0] as IndexedSchema)
      else unions.push(...sorted.slice(0, -1) as IndexedSchema[])
      return { type: 'union', options: sorted as [F.V.Fixpoint, F.V.Fixpoint] } satisfies F.V.Union
    }
  })(schema as F.V.Fixpoint)
  return {
    unions,
    schema: out
  } satisfies ExtractedUnions
}

function assign(_: Path, NEXT_PATH: Path, IX: Scope) {
  return `${IX.needsReturnStatement ? 'return ' : ''}${joinPath(NEXT_PATH, false)}`
}

const defaultWriteable = {
  [Tag.custom]: function customDeepClone(...args) { return assign(...args) },
  [Tag.any]: function anyDeepClone(...args) { return assign(...args) },
  [Tag.unknown]: function unknownDeepClone(...args) { return assign(...args) },
  [Tag.never]: function neverDeepClone(...args) { return assign(...args) },
  [Tag.void]: function voidDeepClone(...args) { return assign(...args) },
  [Tag.undefined]: function undefinedDeepClone(...args) { return assign(...args) },
  [Tag.null]: function nullDeepClone(...args) { return assign(...args) },
  [Tag.NaN]: function nanDeepClone(...args) { return assign(...args) },
  [Tag.boolean]: function booleanDeepClone(...args) { return assign(...args) },
  [Tag.symbol]: function symbolDeepClone(...args) { return assign(...args) },
  [Tag.bigint]: function bigintDeepClone(...args) { return assign(...args) },
  [Tag.number]: function numberDeepClone(...args) { return assign(...args) },
  [Tag.string]: function stringDeepClone(...args) { return assign(...args) },
  [Tag.enum]: function enumDeepClone(...args) { return assign(...args) },
  [Tag.picklist]: function picklistDeepClone(...args) { return assign(...args) },
  [Tag.function]: function functionDeepClone(...args) { return assign(...args) },
  [Tag.literal]: function literalDeepClone(...args) { return assign(...args) },
  [Tag.blob]: function blobDeepClone(...args) { return assign(...args) },
  [Tag.instance]: function instanceDeepClone(...args) { return assign(...args) },
  [Tag.file]: function fileDeepClone(_, NEXT_PATH, IX) {
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    const IDENT = joinPath(NEXT_PATH, false)
    const OPTIONS = `{ type: ${IDENT}.type, lastModified: ${IDENT}.lastModified }`
    return `${RETURN} new File([${IDENT}], ${IDENT}.name, ${OPTIONS})`
  },
  [Tag.date]: function dateDeepClone(_, NEXT_PATH, IX) {
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    return `${RETURN} new Date(${joinPath(NEXT_PATH, false)}?.getTime())`
  },
} satisfies Record<string, Builder>

function union(
  x: F.V.Union<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('union')(input))
    return Invariant.IllegalState('deepClone', 'expected input to be a union schema', input)
  else if (x.options.length === 1)
    return x.options[0]
  else if (!areAllObjects(input.options)) {
    return inclusiveUnion(x, input)
  } else {
    const withTags = getTags(input.options)
    return withTags === null
      ? inclusiveUnion(x, input)
      : exclusiveUnion(x, withTags)
  }
}

function inclusiveUnion(
  x: F.V.Union<Builder>,
  input: F.V.Union<F.LowerBound<string>>,
): Builder {
  return function inclusiveUnionDeepEqual(PREV_PATH, NEXT_PATH, IX) {
    const index = { ...IX, needsReturnStatement: false }
    if (input.options.every(isAtomic))
      return assign(PREV_PATH, NEXT_PATH, IX)
    else {
      return input.options
        .map((option, i) => {
          const continuation = x.options[i]
          const RETURN = IX.needsReturnStatement ? 'return ' : ''
          const IDENT = joinPath(NEXT_PATH, false)
          if (i === x.options.length - 1) {
            return ` : ${continuation(PREV_PATH, NEXT_PATH, index)}`
          } else if (isPrimitive(option)) {
            const CHECK = inlinePrimitiveCheck(option, [IDENT], undefined)
            return `${i === 0 ? RETURN : ' : '}${CHECK} ? ${continuation([IDENT], [IDENT], index)}`
          } else {
            if (!has('index')(option)) {
              return Invariant.IllegalState('deepClone', 'expected non-primitive union member to have an index', option)
            } else {
              const FUNCTION_NAME = `check_${option.index}`
              return `${i === 0 ? RETURN : ' : '}${FUNCTION_NAME}(${IDENT}) ? ${continuation(PREV_PATH, NEXT_PATH, index)}`
            }
          }
        })
        .join('\n')
    }
  }
}

function exclusiveUnion(
  x: F.V.Union<Builder>,
  [discriminant, TAGGED]: Discriminated
): Builder {
  return function exclusiveUnionDeepEqual(PREV_PATH, NEXT_PATH, IX) {
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    return ''
      + RETURN
      + TAGGED.map(({ tag }, I) => {
        const continuation = x.options[I]
        const TAG = stringifyLiteral(tag)
        const PREV_ACCESSOR = joinPath([...PREV_PATH, discriminant], false)
        return [
          I === x.options.length - 1 ? '' : `${PREV_ACCESSOR} === ${TAG} ? `,
          continuation(PREV_PATH, NEXT_PATH, { ...IX, needsReturnStatement: false }),
          I === x.options.length - 1 ? '' : ' : ',
        ].join('\n')
      }).join('\n')
  }
}

function variant(
  x: F.V.Variant<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('variant')(input))
    return Invariant.IllegalState('deepClone', 'expected input to be a variant schema', input)
  else if (!input.options.every(isAnyObject))
    return Invariant.IllegalState('deepEqual', 'expected every variant to be an object schema', input)
  else return function variantDeepClone(PREV_PATH, NEXT_PATH, IX) {
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    if (x.options.length === 0) {
      return `${RETURN}${joinPath(PREV_PATH, false)}`
    } else {
      const PREV = joinPath(PREV_PATH, false) // `false` because `*_PATH` already takes optionality into account
      const NEXT = joinPath(NEXT_PATH, false) // `false` because `*_PATH` already takes optionality into account
      return ''
        + RETURN
        + x.options.map((variant, I) => {
          const objectSchema = input.options[I]
          const literalSchema = objectSchema.entries[input.key]
          if (!tagged('literal', literalSchema)) {
            return Invariant.IllegalState('deepClone', 'expected variant tag to be a literal schema', literalSchema)
          }
          const TAG = stringifyLiteral(literalSchema.literal)
          const NEXT_ACCESSOR = `${NEXT}${accessor(input.key, false)}`
          return [
            I === x.options.length - 1 ? '' : `${NEXT_ACCESSOR} === ${TAG} ? `,
            '{',
            Object_entries(variant.entries).map(([key, continuation]) =>
              `${parseKey(key)}: ${continuation([PREV, key], [NEXT, key], { ...IX, needsReturnStatement: false })}`
            ).join(',\n'),
            '}',
            I === x.options.length - 1 ? '' : ' : ',
          ].join('\n')
        }).join('\n')
    }
  }
}

function array(
  x: F.V.Array<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('array')(input))
    return Invariant.IllegalState('deepClone', 'expected input to be an array schema', input)
  else return function arrayDeepClone(PREV_PATH, NEXT_PATH, IX) {
    const nullary = isNullary(input.item)
    const needsReturnStatement = !nullary
    const index = { ...IX, needsReturnStatement, isProperty: false } satisfies Scope
    const OPEN = IX.needsReturnStatement ? 'return ' : ''
    const OPEN_BRACKET = nullary ? '(' : '{'
    const CLOSE_BRACKET = nullary ? ')' : '}'
    if (isDeepPrimitive(input.item)) return [
      `${OPEN}${joinPath(NEXT_PATH, false)}.slice()`,
    ].join('\n')
    else return [
      `${OPEN}${joinPath(NEXT_PATH, false)}.map((value) => ${OPEN_BRACKET}`,
      `${x.item([...PREV_PATH, 'value'], ['value'], index)}`,
      `${CLOSE_BRACKET})`,
    ].join('\n')
  }
}

function record(x: F.V.Record<Builder>): Builder {
  return function recordDeepClone(_, NEXT_PATH, IX) {
    const index = { ...IX, needsReturnStatement: false, isProperty: false } satisfies Scope
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    const BODY = x.value(['value'], ['value'], index)
    return ''
      + RETURN
      + [
        `Object.entries(${joinPath(NEXT_PATH, false)}).reduce(`,
        `  (acc, [key, value]) => {`,
        `    acc[key] = ${BODY}`,
        `    return acc`,
        `  },`,
        `  Object.create(null)`,
        `)`,
      ].filter((_) => _ !== null).join('\n')
  }
}

function tuple(
  x: F.V.Tuple<Builder> | F.V.LooseTuple<Builder> | F.V.StrictTuple<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged(x.type as 'tuple', input))
    return Invariant.IllegalState('deepClone', `expected input to be a ${x.type} schema`, input)
  else return function tupleDeepClone(_, NEXT_PATH, IX) {
    const index = { ...IX, needsReturnStatement: false, isProperty: false } satisfies Scope
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    const ITEMS = x.items.map((continuation, I) => continuation([], [...NEXT_PATH, I], index))
    return `${RETURN}[${ITEMS.join(', ')}]`
  }
}

function tupleWithRest(
  x: F.V.TupleWithRest<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('tupleWithRest', input))
    return Invariant.IllegalState('deepClone', 'expected input to be a tuple schema', input)
  else return function tupleWithRestDeepClone(_, NEXT_PATH, IX) {
    const index = { ...IX, needsReturnStatement: false, isProperty: false } satisfies Scope
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    const ITEMS = x.items.map((continuation, I) => continuation([], [...NEXT_PATH, I], index))
    const TYPE_ASSERTION = IX.stripTypes === true ? '' : ` as Array<${toType(input.rest)}>`
    const OPEN = TYPE_ASSERTION === '' ? '' : '('
    const CLOSE = TYPE_ASSERTION === '' ? '' : ')'
    const MAPPED = isDeepPrimitive(input.rest)
      ? ''
      : `.map((value) => (${x.rest([], ['value'], index)}))`
    const REST = ''
      + (x.items.length === 0 ? '' : ', ')
      + '...'
      + OPEN
      + joinPath(NEXT_PATH, false)
      + '.slice('
      + x.items.length
      + ')'
      + TYPE_ASSERTION
      + CLOSE
      + MAPPED
    return `${RETURN}[${ITEMS.join(', ')}${REST}]`
  }
}

function object(
  x: F.V.Object<Builder> | F.V.LooseObject<Builder> | F.V.StrictObject<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('object', input))
    return Invariant.IllegalState('deepClone', 'expected input to be an object', input)
  else return function objectDeepClone(PREV_PATH, NEXT_PATH, IX) {
    const OPEN = IX.needsReturnStatement ? 'return (' : null
    const CLOSE = IX.needsReturnStatement ? ')' : null
    return [
      OPEN,
      `{`,
      Object_entries(x.entries).map(
        ([k, continuation]) => {
          const VALUE = continuation(
            [...PREV_PATH, k],
            [...NEXT_PATH, k],
            { ...IX, needsReturnStatement: false, isProperty: true }
          )
          if (isDefinedOptional(input.entries[k]))
            if (isDeepPrimitive(input.entries[k].wrapped))
              return `...${joinPath([...NEXT_PATH, k], false)} !== undefined && { ${parseKey(k)}: ${VALUE} }`
            else
              return `...${joinPath([...NEXT_PATH, k], false)} && { ${parseKey(k)}: ${VALUE} }`
          else
            return `${parseKey(k)}: ${VALUE}`
        }
      ).join(', '),
      `}`,
      CLOSE,
    ].filter((_) => _ !== null).join('\n')
  }
}

function objectWithRest(
  x: F.V.ObjectWithRest<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('objectWithRest', input))
    return Invariant.IllegalState('deepClone', 'expected input to be an object', input)
  else return function objectWithRestDeepClone(PREV_PATH, NEXT_PATH, IX) {
    const index = { ...IX, needsReturnStatement: false, isProperty: true }
    const PREV = joinPath(PREV_PATH, false)
    const OPEN = IX.needsReturnStatement ? 'return (' : null
    const CLOSE = IX.needsReturnStatement ? ')' : null
    const KEYS = Object_keys(x.entries).map((key) => `key === ${stringifyLiteral(key)}`)
    const KEY_CHECK = KEYS.length === 0 ? null : `if(${KEYS.join(' || ')}) return acc`
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    const BODY = Object_entries(x.entries).map(
      ([k, continuation]) => {
        const VALUE = continuation([...PREV_PATH, k], [...NEXT_PATH, k], index)
        if (isDefinedOptional(input.entries[k]))
          if (isDeepPrimitive(input.entries[k].wrapped))
            return `...${joinPath([...NEXT_PATH, k], false)} !== undefined && { ${parseKey(k)}: ${VALUE} }`
          else
            return `...${joinPath([...NEXT_PATH, k], false)} && { ${parseKey(k)}: ${VALUE} }`
        else
          return `${parseKey(k)}: ${VALUE}`
      }
    )
    const REST = [
      `Object.entries(${PREV}).reduce((acc, [key, value]) => {`,
      KEY_CHECK,
      `acc[key] = ${x.rest(['value'], ['value'], { ...IX, needsReturnStatement: false })}`,
      `return acc`,
      `}, Object.create(null))`,
    ].filter((_) => _ !== null).join('\n')
    return BODY.length === 0
      ? `${RETURN}${REST}`
      : [
        OPEN,
        `{`,
        `${BODY.join(', ')},`,
        `...${REST}`,
        `}`,
        CLOSE,
      ].filter((_) => _ !== null).join('\n')
  }
}

function intersect(
  x: F.V.Intersect<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('intersect')(input)) {
    return Invariant.IllegalState('deepClone', 'expected input to be an intersect schema', input)
  } else return function intersectDeepClone(PREV_PATH, NEXT_PATH, IX) {
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    const index = { ...IX, needsReturnStatement: false }
    if (input.options.every(isPrimitiveMember))
      return assign(PREV_PATH, NEXT_PATH, IX)
    else if (input.options.every(isAnyObject))
      return ''
        + RETURN
        + '{'
        + x.options.map((continuation) => `...${continuation(PREV_PATH, NEXT_PATH, index)}`).join(',')
        + '}'
    else
      return Invariant.IllegalState('deepClone', 'expected intersect options to be primitives or objects', input.options)
  }
}

function exactOptional(
  x: F.V.ExactOptional<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('exactOptional', input)) {
    return Invariant.IllegalState('deepClone', 'expected input to be an exactOptional schema', input)
  } else return function exactOptionalDeepClone(PREV_PATH, NEXT_PATH, IX) {
    const index = { ...IX, needsReturnStatement: false } satisfies Scope
    const IDENT = joinPath(NEXT_PATH, false)
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    if (IX.isProperty) return x.wrapped(PREV_PATH, NEXT_PATH, index)
    else if (isDeepPrimitive(input.wrapped)) return `${RETURN}${IDENT}`
    else return `${RETURN}${IDENT} === undefined ? ${IDENT} : ${x.wrapped(PREV_PATH, NEXT_PATH, index)}`
  }
}

function optional(
  x: F.V.Optional<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('optional', input)) {
    return Invariant.IllegalState('deepClone', 'expected input to be an optional schema', input)
  } else return function optionalDeepClone(PREV_PATH, NEXT_PATH, IX) {
    const index = { ...IX, needsReturnStatement: false } satisfies Scope
    const IDENT = joinPath(NEXT_PATH, false)
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    if (isDeepPrimitive(input.wrapped)) return `${RETURN}${IDENT}`
    else return `${RETURN}${IDENT} === undefined ? ${IDENT} : ${x.wrapped(PREV_PATH, NEXT_PATH, index)}`
  }
}

function undefinedable(
  x: F.V.Undefinedable<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('undefinedable', input)) {
    return Invariant.IllegalState('deepClone', 'expected input to be an undefinedable schema', input)
  } else return function undefinedableDeepClone(PREV_PATH, NEXT_PATH, IX) {
    const index = { ...IX, needsReturnStatement: false } satisfies Scope
    const IDENT = joinPath(NEXT_PATH, false)
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    if (isDeepPrimitive(input.wrapped)) return `${RETURN}${IDENT}`
    else return `${RETURN}${IDENT} === undefined ? ${IDENT} : ${x.wrapped(PREV_PATH, NEXT_PATH, index)}`
  }
}

function nullable(
  x: F.V.Nullable<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('nullable', input)) {
    return Invariant.IllegalState('deepClone', 'expected input to be a nullable schema', input)
  } else return function nullableDeepClone(PREV_PATH, NEXT_PATH, IX) {
    const index = { ...IX, needsReturnStatement: false } satisfies Scope
    const IDENT = joinPath(NEXT_PATH, false)
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    if (isPrimitive(input.wrapped)) return `${RETURN}${IDENT}`
    else return `${RETURN}${IDENT} === null ? ${IDENT} : ${x.wrapped(PREV_PATH, NEXT_PATH, index)}`
  }
}

function nullish(
  x: F.V.Nullish<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('nullish', input))
    return Invariant.IllegalState('deepClone', 'expected input to be a nullish schema', input)
  else return function nullishDeepClone(PREV_PATH, NEXT_PATH, IX) {
    const index = { ...IX, needsReturnStatement: false } satisfies Scope
    const IDENT = joinPath(NEXT_PATH, false)
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    if (isPrimitive(input.wrapped)) return `${RETURN}${IDENT}`
    else return `${RETURN}${IDENT} == null ? ${IDENT} : ${x.wrapped(PREV_PATH, NEXT_PATH, index)}`
  }
}

function set(
  x: F.V.Set<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('set', input))
    return Invariant.IllegalState('deepClone', 'expected input to be a nullable schema', input)
  else return function setDeepClone(_, NEXT_PATH, IX) {
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    const IDENT = joinPath(NEXT_PATH, false)
    const index = { ...IX, needsReturnStatement: false, isProperty: false } satisfies Scope
    if (isDeepPrimitive(input.value))
      return `${RETURN}new Set(${IDENT})`
    else
      return ''
        + RETURN
        + `new Set(Array.from(${IDENT}).map((value) => (${x.value([], ['value'], index)})))`
  }
}

function map(
  x: F.V.Map<Builder>,
  input: F.V.Hole<F.LowerBound>
): Builder {
  if (!tagged('map', input))
    return Invariant.IllegalState('deepClone', 'expected input to be a nullable schema', input)
  else return function mapDeepClone(_, NEXT_PATH, IX) {
    const RETURN = IX.needsReturnStatement ? 'return ' : ''
    const IDENT = joinPath(NEXT_PATH, false)
    const index = { ...IX, needsReturnStatement: false, isProperty: false } satisfies Scope
    const KEY = x.key([], ['key'], index)
    const VALUE = x.value([], ['value'], index)
    if (isDeepPrimitive(input.key) && isDeepPrimitive(input.value)) {
      return `${RETURN}new Map(${IDENT})`
    } else {
      return `${RETURN}new Map([...${IDENT}].map(([key, value]) => ([${KEY}, ${VALUE}])))`
    }
  }
}

const fold = F.fold<Builder>((x, _, input) => {
  switch (true) {
    default: return (void (x satisfies never), () => '')
    case isUnsupported(x): return Invariant.Unimplemented(x.type, 'vx.deepClone')
    case tagged('file')(x):
    case tagged('enum')(x):
    case isNullary(x): return defaultWriteable[x.type]
    case tagged('lazy')(x): return x.getter()
    case tagged('nonOptional')(x): return x.wrapped
    case tagged('nonNullable')(x): return x.wrapped
    case tagged('nonNullish')(x): return x.wrapped
    case tagged('union')(x): return union(x, input)
    case tagged('variant')(x): return variant(x, input)
    case tagged('array')(x): return array(x, input)
    case tagged('record')(x): return record(x)
    case tagged('looseTuple')(x):
    case tagged('strictTuple')(x):
    case tagged('tuple')(x): return tuple(x, input)
    case tagged('tupleWithRest')(x): return tupleWithRest(x, input)
    case tagged('looseObject')(x):
    case tagged('strictObject')(x):
    case tagged('object')(x): return object(x, input)
    case tagged('objectWithRest')(x): return objectWithRest(x, input)
    case tagged('intersect')(x): return intersect(x, input)
    case tagged('exactOptional')(x): return exactOptional(x, input)
    case tagged('optional')(x): return optional(x, input)
    case tagged('undefinedable')(x): return undefinedable(x, input)
    case tagged('nullable')(x): return nullable(x, input)
    case tagged('nullish')(x): return nullish(x, input)
    case tagged('set')(x): return set(x, input)
    case tagged('map')(x): return map(x, input)
  }
})

export declare namespace deepClone {
  type Options = toType.Options & {
    /**
     * Configure the name of the generated deepClone function
     * @default "deepClone"
     */
    functionName?: string
    /**
     * Whether to remove TypeScript type annotations from the generated output
     * @default false
     */
    stripTypes?: boolean
  }
}

deepClone.writeable = deepClone_writeable
deepClone.unsupported = deepClone_unsupported

/**
 * ## {@link deepClone `vx.deepClone`}
 *
 * Derive a _"deep clone"_ function from a valibot schema.
 *
 * The generated cloning function is significantly faster than JavaScript's built-in
 * {@link structuredClone `structuredClone`}:
 *
 * - __~3x__ faster with shallow schemas
 * - __~10x__ faster with large schemas
 *
 * It's even faster when compared with Lodash's `deepCloneDeep`:
 *
 * - __~9x__ faster with shallow schemas
 * - __~25x__ faster with large schemas
 *
 * This is possible because the cloning function knows the shape of your data ahead
 * of time, and will do the minimum amount of work necessary to create a new copy
 * of your data.
 *
 * Note that the deep clone function generated by {@link deepClone `vx.deepClone`}
 * **assumes that both values have already been validated**. Passing
 * invalid data to the deepClone function will result in undefined behavior.
 *
 * Note that {@link deepClone `vx.deepClone`} works in any environment that
 * supports defining functions using the `Function` constructor. If your
 * environment does not support the `Function` constructor, use
 * {@link deepClone_writeable `vx.deepClone_writeable`}.
 *
 * See also:
 * - {@link deepClone_writeable `vx.deepClone.writeable`}
 *
 * @example
 * import { assert } from 'vitest'
 * import * as v from 'valibot'
 * import { vx } from '@traversable/valibot'
 *
 * const deepClone = vx.deepClone(
 *   v.object({
 *     street1: v.string(),
 *     street2: v.optional(v.string()),
 *     city: v.string(),
 *   })
 * )
 *
 * const sherlock = { street1: '221 Baker St', street2: '#B', city: 'London' }
 * const harry = { street1: '4 Privet Dr', city: 'Little Whinging' }
 *
 * const sherlockCloned = deepClone(sherlock)
 * const harryCloned = deepClone(harry)
 *
 * // values are deeply equal:
 * assert.deepEqual(sherlockCloned, sherlock) // ✅
 * assert.deepEqual(harryCloned, harry)       // ✅
 *
 * // values are fresh copies:
 * assert.notEqual(sherlockCloned, sherlock)  // ✅
 * assert.notEqual(harryCloned, harry)        // ✅
 */

export function deepClone<S extends v.BaseSchema<unknown, unknown, any>, T = v.InferOutput<S>>(schema: S): (cloneMe: T) => T
export function deepClone(baseSchema: v.BaseSchema<unknown, unknown, never>) {
  const $ = defaultIndex({ stripTypes: true })
  const { unions, schema } = extractUnions(baseSchema)
  const predicates = getPredicates(unions, $.stripTypes)
  const compiled = fold(schema as F.V.Hole<Builder>)(['prev'], ['prev'], $)
  const BODY = compiled.length === 0 ? null : compiled
  return globalThis.Function('prev', [
    ...predicates,
    BODY,
  ].join('\n'))
}

/**
 * ## {@link deepClone_writeable `vx.deepClone.writeable`}
 *
 * Derive a "writeable" (stringified) _"deep clone"_ function from a valibot schema.
 *
 * The generated cloning function is significantly faster than JavaScript's built-in
 * {@link structuredClone `structuredClone`}:
 *
 * - __~3x__ faster with shallow schemas
 * - __~10x__ faster with large schemas
 *
 * It's even faster when compared with Lodash's `deepCloneDeep`:
 *
 * - __~9x__ faster with shallow schemas
 * - __~25x__ faster with large schemas
 *
 * This is possible because the cloning function knows the shape of your data ahead
 * of time, and will do the minimum amount of work necessary to create a new copy
 * of your data.
 *
 * Note that the deep clone function generated by
 * {@link deepClone_writeable `vx.deepClone.writeable`}
 * **assumes that both values have already been validated**. Passing
 * invalid data to the deepClone function will result in undefined behavior.
 * You don't have to worry about this as long as you
 *
 * {@link deepClone_writeable `vx.deepClone.writeable`} accepts an optional
 * configuration object as its second argument; documentation for those
 * options are available via hover on autocompletion.
 *
 * See also:
 * - {@link deepClone `vx.deepClone`}
 *
 * @example
 * import * as v from 'valibot'
 * import { vx } from '@traversable/valibot'
 *
 * const deepClone = vx.deepClone.writeable(
 *   v.object({
 *     street1: v.string(),
 *     street2: v.optional(v.string()),
 *     city: v.string(),
 *   }), { typeName: 'Address' }
 * )
 *
 * console.log(deepClone)
 * // =>
 * // type Address = { street1: string; street2?: string; city: string; }
 * // function deepClone(prev: Address) {
 * //   return {
 * //     street1: prev.street1,
 * //     ...prev.street2 !== undefined && { street2: prev.street2 },
 * //     city: prev.city
 * //   }
 * // }
 */

function deepClone_writeable<S extends v.BaseSchema<unknown, unknown, any>>(baseSchema: S, options?: deepClone.Options): string
function deepClone_writeable(baseSchema: v.BaseSchema<unknown, unknown, never>, options?: deepClone.Options): string {
  const $ = defaultIndex(options)
  const FUNCTION_NAME = options?.functionName ?? 'deepClone'
  const { unions, schema } = extractUnions(baseSchema)
  const predicates = getPredicates(unions, $.stripTypes)
  const compiled = fold(schema as F.V.Hole<Builder>)(['prev'], ['prev'], $)
  const inputType = toType(schema, options)
  const TYPE = $.stripTypes ? '' : `: ${options?.typeName ?? inputType}`
  const BODY = compiled.length === 0 ? null : compiled
  return [
    options?.typeName === undefined ? null : inputType,
    `function ${FUNCTION_NAME} (prev${TYPE}) {`,
    ...predicates,
    BODY,
    `}`,
  ].filter((_) => _ !== null).join('\n')
}
