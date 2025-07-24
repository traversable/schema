import { z } from 'zod'
import { ident, joinPath, Object_keys, stringifyKey, stringifyLiteral } from '@traversable/registry'
import type { AnyTypeName, Discriminated, PathSpec } from '@traversable/zod-types'
import {
  F,
  hasTypeName,
  tagged,
  TypeName,
  areAllObjects,
  defaultNextSpec,
  defaultPrevSpec,
  getTags,
  inlinePrimitiveCheck,
  isOptional,
  isPrimitive,
  schemaOrdering,
} from '@traversable/zod-types'

import { check } from './check.js'
import { toType } from './to-type.js'

export type Builder = (prev: PathSpec, next: PathSpec, ix: Scope) => string

export interface Scope extends F.CompilerIndex {
  bindings: Map<string, string>
  isRoot: boolean
  isProperty: boolean
  mutateDontAssign: boolean
  useGlobalThis: clone.Options['useGlobalThis']
}

const defaultIndex = () => ({
  ...F.defaultIndex,
  bindings: new Map(),
  isRoot: true,
  mutateDontAssign: false,
  useGlobalThis: false,
}) satisfies Scope

type UnsupportedSchema = F.Z.Catalog[typeof clone_unsupported[number]]
const clone_unsupported = [
  'success',
  'transform',
  'promise',
  'custom',
] satisfies AnyTypeName[]

function isUnsupported(x: unknown): x is UnsupportedSchema {
  return hasTypeName(x) && clone_unsupported.includes(x._zod.def.type as never)
}

function isVoidOrUndefined(x: z.core.$ZodType): boolean {
  switch (true) {
    default: return false
    case tagged('void', x):
    case tagged('undefined', x): return true
    case tagged('optional', x):
    case tagged('nullable', x):
    case tagged('readonly', x):
    case tagged('nonoptional', x): return isVoidOrUndefined(x._zod.def.innerType)
    case tagged('literal', x): return x._zod.def.values.includes(undefined)
    case tagged('union', x): return x._zod.def.options.some(isVoidOrUndefined)
  }
}

function isAtomic(x: z.core.$ZodType): boolean {
  switch (true) {
    default: return false
    case tagged('void', x):
    case tagged('null', x):
    case tagged('undefined', x):
    case tagged('symbol', x):
    case tagged('boolean', x):
    case tagged('nan', x):
    case tagged('int', x):
    case tagged('bigint', x):
    case tagged('number', x):
    case tagged('string', x):
    case tagged('enum', x):
    case tagged('literal', x):
    case tagged('template_literal', x): return true
    case tagged('optional', x):
    case tagged('nullable', x):
    case tagged('readonly', x):
    case tagged('nonoptional', x): return isAtomic(x._zod.def.innerType)
  }
}

function flattenUnion(options: readonly unknown[], out: unknown[] = []): unknown[] {
  for (let ix = 0; ix < options.length; ix++) {
    const option = options[ix]
    if (tagged('union', option)) out = flattenUnion(option._zod.def.options, out)
    else out.push(option)
  }
  return out
}

const preprocess = F.fold<z.core.$ZodType>(
  (x) => tagged('union')(x) ? z.union(flattenUnion(x._zod.def.options) as z.core.$ZodType[]) : F.out(x)
)

function assign(PREV_SPEC: PathSpec, NEXT_SPEC: PathSpec, IX: Scope) {
  return `${IX.mutateDontAssign ? '' : `const `}${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
}

const defaultWriteable = {
  [TypeName.any]: function cloneAny(...args) { return assign(...args) },
  [TypeName.unknown]: function cloneUnknown(...args) { return assign(...args) },
  [TypeName.never]: function cloneNever(...args) { return assign(...args) },
  [TypeName.void]: function cloneVoid(...args) { return assign(...args) },
  [TypeName.undefined]: function cloneUndefined(...args) { return assign(...args) },
  [TypeName.null]: function cloneNull(...args) { return assign(...args) },
  [TypeName.nan]: function cloneNaN(...args) { return assign(...args) },
  [TypeName.boolean]: function cloneBoolean(...args) { return assign(...args) },
  [TypeName.symbol]: function cloneSymbol(...args) { return assign(...args) },
  [TypeName.int]: function cloneInt(...args) { return assign(...args) },
  [TypeName.bigint]: function cloneBigInt(...args) { return assign(...args) },
  [TypeName.number]: function cloneNumber(...args) { return assign(...args) },
  [TypeName.string]: function cloneString(...args) { return assign(...args) },
  [TypeName.file]: function cloneFile(...args) { return assign(...args) },
  [TypeName.enum]: function cloneEnum(...args) { return assign(...args) },
  [TypeName.literal]: function cloneLiteral(...args) { return assign(...args) },
  [TypeName.template_literal]: function cloneTemplateLiteral(...args) { return assign(...args) },
  [TypeName.date]: function cloneDate(PREV_SPEC, NEXT_SPEC, IX) {
    const KEYWORD = IX.mutateDontAssign ? '' : `const `
    return `${KEYWORD}${NEXT_SPEC.ident} = new ${IX.useGlobalThis ? 'globalThis.' : ''}Date(${PREV_SPEC.ident}?.getTime())`
  },
} satisfies Record<string, Builder>

function nullableWriteable(x: F.Z.Nullable<Builder>, input: z.ZodNullable): Builder {
  return buildUnionCloner(
    [x._zod.def.innerType, defaultWriteable.null],
    [input._zod.def.innerType, z.null()]
  )
}

function optionalWriteable(x: F.Z.Optional<Builder>, input: z.core.$ZodOptional): Builder {
  if (tagged('optional', input._zod.def.innerType)) {
    return x._zod.def.innerType
  } else {
    return function cloneOptional(PREV_SPEC, NEXT_SPEC, IX) {
      const NEXT_BINDING = IX.bindings.get(NEXT_SPEC.ident)
      const childIsVoidOrUndefined = isVoidOrUndefined(input._zod.def.innerType)
      if (IX.isProperty) {
        return [
          `let ${NEXT_SPEC.ident};`,
          childIsVoidOrUndefined ? null : `if (${PREV_SPEC.ident} !== undefined) {`,
          x._zod.def.innerType(PREV_SPEC, NEXT_SPEC, { ...IX, mutateDontAssign: true }),
          `${NEXT_BINDING} = ${NEXT_SPEC.ident}`,
          childIsVoidOrUndefined ? null : `}`,
        ].filter((_) => _ !== null).join('\n')
      } else {
        const HAS_ALREADY_BEEN_DECLARED = NEXT_BINDING !== undefined
        const CONDITIONAL_NEXT_IDENT = HAS_ALREADY_BEEN_DECLARED ? null : ident(NEXT_SPEC.ident, IX.bindings)
        const CONDITIONAL_LET_BINDING = CONDITIONAL_NEXT_IDENT === null ? null : `let ${NEXT_SPEC.ident}`
        return [
          CONDITIONAL_LET_BINDING,
          `if (${PREV_SPEC.ident} === undefined) {`,
          `${NEXT_SPEC.ident} = undefined`,
          `} else {`,
          x._zod.def.innerType(PREV_SPEC, NEXT_SPEC, { ...IX, mutateDontAssign: true }),
          `}`,
        ].filter((_) => _ !== null).join('\n')
      }
    }
  }
}

function arrayWriteable(x: F.Z.Array<Builder>): Builder {
  return function cloneArray(PREV_SPEC, NEXT_SPEC, IX) {
    const LENGTH = ident('length', IX.bindings)
    const BINDING = `${IX.mutateDontAssign ? '' : `const `}${NEXT_SPEC.ident} = new ${IX.useGlobalThis ? 'globalThis.' : ''}Array(${LENGTH});`
    const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, 'item'], IX.isOptional)
    const PREV_CHILD_ACCESSOR = joinPath([PREV_SPEC.ident, 'item'], IX.isOptional)
    const PREV_CHILD_IDENT = ident(PREV_CHILD_ACCESSOR, IX.bindings)
    const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings, 'dontBind')
    const INDEX = ident('ix', IX.bindings)
    return [
      `const ${LENGTH} = ${PREV_SPEC.ident}.length;`,
      BINDING,
      `for (let ${INDEX} = ${LENGTH}; ${INDEX}-- !== 0; ) {`,
      `const ${PREV_CHILD_IDENT} = ${PREV_SPEC.ident}[${INDEX}]`,
      x._zod.def.element(
        { path: [...PREV_SPEC.path, 'item'], ident: PREV_CHILD_IDENT },
        { path: [...NEXT_SPEC.path, 'item'], ident: NEXT_CHILD_IDENT },
        { ...IX, mutateDontAssign: false, isProperty: false },
      ),
      `${NEXT_SPEC.ident}[${INDEX}] = ${NEXT_CHILD_IDENT}`,
      `}`,
    ].filter((_) => _ !== null).join('\n')
  }
}

function setWriteable(x: F.Z.Set<Builder>): Builder {
  return function cloneSet(PREV_SPEC, NEXT_SPEC, IX) {
    const VALUE = ident('value', IX.bindings)
    const NEXT_VALUE = `${NEXT_SPEC.ident}_value`
    return [
      `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = new ${IX.useGlobalThis ? 'globalThis.' : ''}Set();`,
      `for (let ${VALUE} of ${PREV_SPEC.ident}) {`,
      x._zod.def.valueType(
        { path: [...PREV_SPEC.path, VALUE], ident: VALUE },
        { path: [...NEXT_SPEC.path, VALUE], ident: NEXT_VALUE },
        { ...IX, mutateDontAssign: false, isProperty: false },
      ),
      `${NEXT_SPEC.ident}.add(${NEXT_VALUE});`,
      `}`,
    ].join('\n')
  }
}

function mapWriteable(x: F.Z.Map<Builder>): Builder {
  return function cloneMap(PREV_SPEC, NEXT_SPEC, IX) {
    const KEY = ident('key', IX.bindings)
    const VALUE = ident('value', IX.bindings)
    const NEXT_KEY = `${NEXT_SPEC.ident}_key`
    const NEXT_VALUE = `${NEXT_SPEC.ident}_value`
    return [
      `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = new ${IX.useGlobalThis ? 'globalThis.' : ''}Map();`,
      `for (let [${KEY}, ${VALUE}] of ${PREV_SPEC.ident}) {`,
      x._zod.def.keyType(
        { path: PREV_SPEC.path, ident: KEY },
        { path: [...NEXT_SPEC.path, KEY], ident: NEXT_KEY },
        { ...IX, mutateDontAssign: false, isProperty: false },
      ),
      x._zod.def.valueType(
        { path: PREV_SPEC.path, ident: VALUE },
        { path: [...NEXT_SPEC.path, VALUE], ident: NEXT_VALUE },
        { ...IX, mutateDontAssign: false, isProperty: false },
      ),
      `${NEXT_SPEC.ident}.set(${NEXT_KEY}, ${NEXT_VALUE});`,
      `}`,
    ].join('\n')
  }
}

function intersectionWriteable(x: F.Z.Intersection<Builder>): Builder {
  return function cloneIntersection(PREV_SPEC, NEXT_SPEC, IX) {
    const PATTERN = `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = Object.create(null);\n`
    const LEFT = x._zod.def.left(PREV_SPEC, NEXT_SPEC, IX)
    const RIGHT = x._zod.def.right(PREV_SPEC, NEXT_SPEC, IX)
    if (LEFT.startsWith(PATTERN) && RIGHT.startsWith(PATTERN)) {
      return [LEFT, RIGHT.slice(PATTERN.length)].join('\n')
    } else {
      return [LEFT, RIGHT].join('\n')
    }
  }
}

// const lastRequiredIndex = 1 + input._zod.def.items.findLastIndex((v) => !isOptional(v))
// const ASSIGNMENTS = Array.from({ length: lastRequiredIndex }).map(

function tupleWriteable(x: F.Z.Tuple<Builder>, input: z.core.$ZodTuple): Builder {
  return function cloneTuple(PREV_SPEC, NEXT_SPEC, IX) {
    let REST: string | null = null
    if (x._zod.def.rest !== undefined) {
      const LENGTH = ident('length', IX.bindings)
      const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, 'item'], IX.isOptional)
      const PREV_CHILD_ACCESSOR = joinPath([PREV_SPEC.ident, 'item'], IX.isOptional)
      const PREV_CHILD_IDENT = ident(PREV_CHILD_ACCESSOR, IX.bindings)
      const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings, 'dontBind')
      const INDEX = ident('ix', IX.bindings)
      REST = [
        `const ${LENGTH} = ${PREV_SPEC.ident}.length;`,
        `for (let ${INDEX} = ${x._zod.def.items.length}; ${INDEX} < ${LENGTH}; ${INDEX}++) {`,
        `const ${PREV_CHILD_IDENT} = ${PREV_SPEC.ident}[${INDEX}]`,
        x._zod.def.rest(
          { path: [...PREV_SPEC.path, 'item'], ident: PREV_CHILD_IDENT },
          { path: [...NEXT_SPEC.path, 'item'], ident: NEXT_CHILD_IDENT },
          { ...IX, mutateDontAssign: false, isProperty: false },
        ),
        `${NEXT_SPEC.ident}[${INDEX}] = ${NEXT_CHILD_IDENT}`,
        `}`
      ].join('\n')
    }
    if (x._zod.def.items.length === 0) {
      return [
        `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = new ${IX.useGlobalThis ? 'globalThis.' : ''}Array();`,
        REST,
      ].filter((_) => _ !== null).join('\n')
    } else {
      const CHILDREN = x._zod.def.items.map((continuation, I) => {
        const PREV_PATH_ACCESSOR = joinPath([PREV_SPEC.ident, I], IX.isOptional)
        const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, I], IX.isOptional)
        const PREV_CHILD_IDENT = ident(PREV_PATH_ACCESSOR, IX.bindings)
        const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings)
        return [
          `const ${PREV_CHILD_IDENT} = ${joinPath([PREV_SPEC.ident, I], IX.isOptional)};`,
          continuation(
            { path: [...PREV_SPEC.path, I], ident: PREV_CHILD_IDENT },
            { path: [...NEXT_SPEC.path, I], ident: NEXT_CHILD_IDENT },
            { ...IX, mutateDontAssign: false, isProperty: true },
          ),
        ].join('\n')
      })
      const ASSIGNMENTS = Array.from({ length: x._zod.def.items.length }).map(
        (_, I) => `${NEXT_SPEC.ident}[${I}] = ${IX.bindings.get(`${NEXT_SPEC.ident}[${I}]`)}`
      )
      return [
        `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = new ${IX.useGlobalThis ? 'globalThis.' : ''}Array(${PREV_SPEC.ident}.length);`,
        ...CHILDREN,
        ...ASSIGNMENTS,
        REST,
      ].filter((_) => _ !== null).join('\n')
    }
  }
}

function recordWriteable(x: F.Z.Record<Builder>): Builder {
  return function cloneRecord(PREV_SPEC, NEXT_SPEC, IX) {
    const BINDING = `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = Object.create(null);`
    const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, 'value'], IX.isOptional)
    const PREV_CHILD_ACCESSOR = joinPath([PREV_SPEC.ident, 'value'], IX.isOptional)
    const PREV_CHILD_IDENT = ident(PREV_CHILD_ACCESSOR, IX.bindings)
    const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings)
    const KEY = ident('key', IX.bindings)
    return [
      BINDING,
      `for (let ${KEY} in ${PREV_SPEC.ident}) {`,
      `const ${PREV_CHILD_IDENT} = ${PREV_SPEC.ident}[${KEY}]`,
      x._zod.def.valueType(
        { path: [...PREV_SPEC.path, 'value'], ident: PREV_CHILD_IDENT },
        { path: [...NEXT_SPEC.path, 'value'], ident: NEXT_CHILD_IDENT },
        { ...IX, mutateDontAssign: false, isProperty: false },
      ),
      `${NEXT_SPEC.ident}[${KEY}] = ${NEXT_CHILD_IDENT}`,
      `}`,
    ].join('\n')
  }
}

function objectWriteable(x: F.Z.Object<Builder>, input: z.ZodObject): Builder {
  return function cloneObject(PREV_SPEC, NEXT_SPEC, IX) {
    const ASSIGN = `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = Object.create(null);`
    const optional = Object.entries(input._zod.def.shape).filter(([, v]) => isOptional(v)).map(([k]) => k)
    let CATCHALL: string | null = null
    if (x._zod.def.catchall !== undefined) {
      const keys = Object_keys(x._zod.def.shape)
      const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, 'value'], IX.isOptional)
      const PREV_CHILD_ACCESSOR = joinPath([PREV_SPEC.ident, 'value'], IX.isOptional)
      const PREV_CHILD_IDENT = ident(PREV_CHILD_ACCESSOR, IX.bindings)
      const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings)
      const INDEX = ident('key', IX.bindings)
      const KNOWN_KEY_CHECK = keys.map((k) => `${INDEX} === ${stringifyKey(k)}`).join(' || ')
      CATCHALL = [
        `for (let ${INDEX} in ${PREV_SPEC.ident}) {`,
        `const ${PREV_CHILD_IDENT} = ${PREV_SPEC.ident}[${INDEX}];`,
        keys.length === 0 ? null : `if (${KNOWN_KEY_CHECK}) continue;`,
        x._zod.def.catchall(
          { path: [...PREV_SPEC.path, 'value'], ident: PREV_CHILD_IDENT },
          { path: [...NEXT_SPEC.path, 'value'], ident: NEXT_CHILD_IDENT },
          { ...IX, mutateDontAssign: false, isProperty: false },
        ),
        `${NEXT_SPEC.ident}[${INDEX}] = ${NEXT_CHILD_IDENT}`,
        `}`,
      ].filter((_) => _ !== null).join('\n')
    }
    return [
      ASSIGN,
      CATCHALL,
      ...Object.entries(x._zod.def.shape).map(([key, continuation]) => {
        const PREV_PATH_ACCESSOR = joinPath([PREV_SPEC.ident, key], IX.isOptional)
        const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, key], IX.isOptional)
        const PREV_CHILD_IDENT = ident(PREV_PATH_ACCESSOR, IX.bindings)
        const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings)
        const CHILD_ASSIGN = optional.includes(key) ? null : `${NEXT_CHILD_ACCESSOR} = ${NEXT_CHILD_IDENT}`
        return [
          `const ${PREV_CHILD_IDENT} = ${joinPath([PREV_SPEC.ident, key], IX.isOptional)};`,
          continuation(
            { path: [...PREV_SPEC.path, key], ident: PREV_CHILD_IDENT },
            { path: [...NEXT_SPEC.path, key], ident: NEXT_CHILD_IDENT },
            { ...IX, mutateDontAssign: false, isProperty: true },
          ),
          CHILD_ASSIGN,
        ].filter((_) => _ !== null).join('\n')
      }),
    ].filter((_) => _ !== null).join('\n')
  }
}

function unionWriteable(x: F.Z.Union<Builder>, input: z.ZodUnion): Builder {
  const xs = x._zod.def.options
  const inputs = input._zod.def.options
  if (!areAllObjects(inputs)) {
    return buildUnionCloner(xs, inputs)
  } else {
    const withTags = getTags(inputs)
    return withTags === null
      ? buildUnionCloner(xs, inputs)
      : buildDisjointUnionCloner(xs, withTags)
  }
}

function buildUnionCloner(
  xs: readonly Builder[],
  options: readonly z.core.$ZodType[]
): Builder {
  if (xs.length === 1) return xs[0]
  return function cloneUnion(PREV_SPEC, NEXT_SPEC, IX) {
    if (xs.length === 0) return `const ${NEXT_SPEC.ident} = undefined`
    else if (options.every(isAtomic)) {
      return assign(PREV_SPEC, NEXT_SPEC, IX)
    } else {
      const NEXT_IDENT = IX.bindings.get(NEXT_SPEC.ident) === undefined ? ident(NEXT_SPEC.ident, IX.bindings) : null
      const NEXT = NEXT_IDENT === null ? null : `let ${NEXT_SPEC.ident};`
      return [
        NEXT,
        ...options
          .map((option, i) => [option, i] satisfies [any, any])
          .toSorted(schemaOrdering).map(([option, I]) => {
            const continuation = xs[I]
            if (isPrimitive(option)) {
              const CHECK = inlinePrimitiveCheck(option, PREV_SPEC, undefined, IX.useGlobalThis)
              return [
                `if (${CHECK}) {`,
                continuation(PREV_SPEC, NEXT_SPEC, { ...IX, mutateDontAssign: true }),
                `}`,
              ].join('\n')
            } else {
              const FUNCTION_NAME = ident('check', IX.bindings)
              return [
                check.writeable(option, { functionName: FUNCTION_NAME }),
                `if (${FUNCTION_NAME}(${PREV_SPEC.ident})) {`,
                continuation(PREV_SPEC, NEXT_SPEC, { ...IX, mutateDontAssign: true }),
                `}`,
              ].join('\n')
            }
          })
      ].filter((_) => _ !== null).join('\n')
    }
  }
}

function buildDisjointUnionCloner(
  xs: readonly Builder[],
  [discriminant, TAGGED]: Discriminated
): Builder {
  return function cloneDisjointUnion(PREV_SPEC, NEXT_SPEC, IX) {
    return [
      `let ${NEXT_SPEC.ident};`,
      ...TAGGED.map(({ tag }, I) => {
        const TAG = stringifyLiteral(tag)
        const continuation = xs[I]
        const PREV_ACCESSOR = joinPath([...PREV_SPEC.path, discriminant], IX.isOptional)
        return [
          `if (${PREV_ACCESSOR} === ${TAG}) {`,
          continuation(PREV_SPEC, NEXT_SPEC, { ...IX, mutateDontAssign: true }),
          `}`,
        ].join('\n')
      }),
    ].join('\n')
  }
}

const interpret = F.fold<Builder>((x, _, input) => {
  switch (true) {
    default: return (void (x satisfies never), () => '')
    case tagged('enum')(x):
    case F.isNullary(x): return defaultWriteable[x._zod.def.type]
    case tagged('lazy')(x): return x._zod.def.getter()
    case tagged('catch')(x): return x._zod.def.innerType
    case tagged('default')(x): return x._zod.def.innerType
    case tagged('prefault')(x): return x._zod.def.innerType
    case tagged('pipe')(x): return x._zod.def.out
    case tagged('nonoptional')(x): return x._zod.def.innerType
    case tagged('readonly')(x): return x._zod.def.innerType
    case tagged('array')(x): return arrayWriteable(x)
    case tagged('optional')(x): return optionalWriteable(x, input as z.ZodOptional)
    case tagged('nullable')(x): return nullableWriteable(x, input as z.ZodNullable)
    case tagged('set')(x): return setWriteable(x)
    case tagged('map')(x): return mapWriteable(x)
    case tagged('record')(x): return recordWriteable(x)
    case tagged('union')(x): return unionWriteable(x, input as z.ZodUnion<never>)
    case tagged('intersection')(x): return intersectionWriteable(x)
    case tagged('tuple')(x): return tupleWriteable(x, input as z.ZodTuple<never>)
    case tagged('object')(x): return objectWriteable(x, input as z.ZodObject)
    case isUnsupported(x): return import('@traversable/zod-types').then(({ Invariant }) =>
      Invariant.Unimplemented(x._zod.def.type, 'zx.clone')) as never
  }
})

export declare namespace clone {
  type Options = toType.Options & {
    /**
     * Configure the name of the generated clone function
     * @default "clone"
     */
    functionName?: string
    /**
     * Whether to access global identifiers like `Date` from the `globalThis` namespace
     * @default false
     */
    useGlobalThis?: boolean
  }
}

/**
 * ## {@link clone `zx.clone`}
 *
 * Derive a _deep clone function_ from a zod schema (v4, classic).
 * 
 * The generated cloning function is significantly faster than JavaScript's built-in
 * {@link structuredClone `structuredClone`}: 
 * 
 * - __~3x__ faster with shallow schemas
 * - __~10x__ faster with large schemas
 * 
 * It's even faster when compared with Lodash's `cloneDeep`:
 * 
 * - __~9x__ faster with shallow schemas
 * - __~25x__ faster with large schemas
 * 
 * This is possible because the cloning function knows the shape of your data ahead
 * of time, and will do the minimum amount of work necessary to create a new copy
 * of your data.
 *
 * Note that the "deep clone function" generated by {@link clone `zx.clone`}
 * **assumes that both values have already been validated**. Passing
 * invalid data to the clone function will result in undefined behavior.
 * 
 * Note that {@link clone `zx.clone`} works in any environment that 
 * supports defining functions using the `Function` constructor. If your
 * environment does not support the `Function` constructor, use 
 * {@link clone_writeable `zx.clone_writeable`}.
 * 
 * See also:
 * - {@link clone_writeable `zx.clone.writeable`}
 *
 * @example
 * import { assert } from 'vitest'
 * import { z } from 'zod'
 * import { zx } from '@traversable/zod'
 * 
 * const Address = z.object({
 *   street1: z.string(),
 *   strret2: z.optional(z.string()),
 *   city: z.string(),
 * })
 * 
 * const clone = zx.clone(Address)
 * 
 * const sherlock = { street1: '221 Baker St', street2: '#B', city: 'London' }
 * const harry = { street1: '4 Privet Dr', city: 'Little Whinging' }
 * 
 * const sherlockCloned = clone(sherlock)
 * const harryCloned = clone(harry)
 * 
 * // values are deeply equal:
 * assert.deepEqual(sherlockCloned, sherlock) // ✅
 * assert.deepEqual(harryCloned, harry)       // ✅
 * 
 * // values are fresh copies:
 * assert.notEqual(sherlockCloned, sherlock)  // ✅
 * assert.notEqual(harryCloned, harry)        // ✅
 */

export function clone<T extends z.core.$ZodType>(type: T): (cloneMe: z.infer<T>) => z.infer<T>
export function clone(type: z.core.$ZodType) {
  const processed = preprocess(z.clone(type) as never)
  const BODY = interpret(processed as F.Z.Hole<Builder>)(defaultPrevSpec, defaultNextSpec, defaultIndex())
  return globalThis.Function('prev', [
    BODY,
    `return next`
  ].join('\n'))
}

clone.writeable = clone_writeable
clone.unsupported = clone_unsupported

/**
 * ## {@link clone_writeable `zx.clone.writeable`}
 *
 * Derive a "writeable" (stringified) _deep clone function_ 
 * from a zod schema (v4, classic).
 * 
 * The generated cloning function is significantly faster than JavaScript's built-in
 * {@link structuredClone `structuredClone`}: 
 * 
 * - __~3x__ faster with shallow schemas
 * - __~10x__ faster with large schemas
 * 
 * It's even faster when compared with Lodash's `cloneDeep`:
 * 
 * - __~9x__ faster with shallow schemas
 * - __~25x__ faster with large schemas
 * 
 * This is possible because the cloning function knows the shape of your data ahead
 * of time, and will do the minimum amount of work necessary to create a new copy
 * of your data.
 *
 * Note that the "deep clone function" generated by 
 * {@link clone_writeable `zx.clone.writeable`}
 * **assumes that both values have already been validated**. Passing
 * invalid data to the clone function will result in undefined behavior.
 * You don't have to worry about this as long as you
 * 
 * {@link clone_writeable `zx.clone.writeable`} accepts an optional
 * configuration object as its second argument; documentation for those
 * options are available via hover on autocompletion.
 * 
 * See also:
 * - {@link clone `zx.clone`}
 *
 * @example
 * import { z } from 'zod'
 * import { zx } from '@traversable/zod'
 * 
 * const Address = z.object({
 *   street1: z.string(),
 *   strret2: z.optional(z.string()),
 *   city: z.string(),
 * })
 * 
 * const clone = zx.clone.writeable(Address, {
 *   typeName: 'Address',
 *   functionName: 'cloneAddress',
 * })
 * 
 * console.log(clone) 
 * // =>
 * // type Address = {
 * //   street1: string;
 * //   street2?: string;
 * //   city: string;
 * // }
 * // function cloneAddress(prev: Address): Address {
 * //   const next = Object.create(null)
 * //   const prev_street1 = prev.street1
 * //   const next_street1 = prev_street1
 * //   next.street1 = next_street1
 * //   const prev_street2 = prev.street2
 * //   let next_street2
 * //   if (prev_street2 !== undefined) {
 * //     next_street2 = prev_street2
 * //     next.street2 = next_street2
 * //   }
 * //   const prev_city = prev.city
 * //   const next_city = prev_city
 * //   next.city = next_city
 * //   return next
 * // }
 */

function clone_writeable<T extends z.core.$ZodType>(type: T, options?: clone.Options): string {
  const index = { ...defaultIndex(), useGlobalThis: options?.useGlobalThis } satisfies Scope
  const processed = preprocess(z.clone(type) as never)
  const compiled = interpret(processed as F.Z.Hole<Builder>)(defaultPrevSpec, defaultNextSpec, index)
  const inputType = toType(type, options)
  const TYPE = options?.typeName ?? inputType
  const FUNCTION_NAME = options?.functionName ?? 'clone'
  const BODY = compiled.length === 0 ? null : compiled
  return [
    options?.typeName === undefined ? null : inputType,
    `function ${FUNCTION_NAME} (prev: ${TYPE}) {`,
    BODY,
    `return next`,
    `}`,
  ].filter((_) => _ !== null).join('\n')
}
