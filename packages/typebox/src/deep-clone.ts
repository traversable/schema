import type * as T from '@sinclair/typebox'
import { Array_from, fn, ident, joinPath, Object_entries, stringifyLiteral } from '@traversable/registry'
import type { Discriminated, PathSpec } from '@traversable/typebox-types'
import {
  F,
  Type,
  flattenUnion,
  check,
  areAllObjects,
  defaultNextSpec,
  defaultPrevSpec,
  getTags,
  inlinePrimitiveCheck,
  isPrimitive,
  isOptional,
  schemaOrdering,
  tagged,
  toType,
} from '@traversable/typebox-types'

export type Builder = (prev: PathSpec, next: PathSpec, ix: Scope) => string

export interface Scope extends F.CompilerIndex {
  bindings: Map<string, string>
  isRoot: boolean
  isProperty: boolean
  mutateDontAssign: boolean
  useGlobalThis: deepClone.Options['useGlobalThis']
}

// TODO: movie to typebox-types/utils.ts
function invariant(functionName: string, expected: string, got: unknown): never {
  throw Error(`Illegal state (box.${functionName}): ${expected}, got: ${JSON.stringify(got, null, 2)}`)
}

function isVoidOrUndefined<T>(x: Type.F<T> | T): boolean {
  switch (true) {
    default: return false
    case tagged('void')(x):
    case tagged('undefined')(x): return true
    case tagged('optional')(x): return isVoidOrUndefined(x.schema)
    case tagged('anyOf')(x): return x.anyOf.some(isVoidOrUndefined)
  }
}

const defaultIndex = () => ({
  ...F.defaultIndex,
  bindings: new Map(),
  dataPath: [],
  isOptional: false,
  isProperty: false,
  isRoot: true,
  mutateDontAssign: false,
  schemaPath: [],
  useGlobalThis: false,
  varName: 'value',
}) satisfies Scope

function isAtomic(x: unknown): boolean {
  switch (true) {
    default: return false
    case tagged('null')(x):
    case tagged('boolean')(x):
    case tagged('integer')(x):
    case tagged('number')(x):
    case tagged('string')(x):
    case tagged('never')(x): return true
    case tagged('anyOf')(x): return x.anyOf.some(isAtomic)
  }
}

const preprocess
  : <T>(src: Type.F<T>, ix?: F.Index) => Type.F<T>
  = F.fold<any>((x) => tagged('anyOf')(x) ? { anyOf: flattenUnion(x.anyOf) } : x)

function assign(PREV_SPEC: PathSpec, NEXT_SPEC: PathSpec, IX: Scope) {
  return `${IX.mutateDontAssign ? '' : `const `}${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
}

function buildArrayCloner(x: Type.Array<Builder>): Builder {
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
      x.items(
        { path: [...PREV_SPEC.path, 'item'], ident: PREV_CHILD_IDENT },
        { path: [...NEXT_SPEC.path, 'item'], ident: NEXT_CHILD_IDENT },
        { ...IX, mutateDontAssign: false, isProperty: false },
      ),
      `${NEXT_SPEC.ident}[${INDEX}] = ${NEXT_CHILD_IDENT}`,
      `}`,
    ].filter((_) => _ !== null).join('\n')
  }
}

function buildIntersectionCloner(x: Type.Intersect<Builder>): Builder {
  return function cloneIntersection(PREV_SPEC, NEXT_SPEC, IX) {
    const PATTERN = `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = Object.create(null);\n`
    return x.allOf.map(
      (continuation, i) => fn.pipe(
        continuation(PREV_SPEC, NEXT_SPEC, IX),
        (CHILD) => i > 0 && CHILD.startsWith(PATTERN) ? CHILD.slice(PATTERN.length) : CHILD
      )
    ).join('\n')
  }
}

// const lastRequiredIndex = 1 + input.prefixItems.findLastIndex((v) => !isOptional(v))
// const ASSIGNMENTS = Array_from({ length: lastRequiredIndex }).map(

function buildTupleCloner(x: Type.Tuple<Builder>, input: Type.F<unknown>): Builder {
  if (!tagged('tuple')(input)) return invariant('cloneTuple', 'expected input to be a tuple schema', input)
  return function cloneTuple(PREV_SPEC, NEXT_SPEC, IX) {
    if (x.items.length === 0) {
      return [
        `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = new ${IX.useGlobalThis ? 'globalThis.' : ''}Array();`,
        // REST,
      ].filter((_) => _ !== null).join('\n')
    } else {
      const CHILDREN = x.items.map((continuation, I) => {
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
      const ASSIGNMENTS = Array_from({ length: x.items.length }).map(
        (_, I) => `${NEXT_SPEC.ident}[${I}] = ${IX.bindings.get(`${NEXT_SPEC.ident}[${I}]`)}`
      )
      return [
        `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = new ${IX.useGlobalThis ? 'globalThis.' : ''}Array(${PREV_SPEC.ident}.length);`,
        ...CHILDREN,
        ...ASSIGNMENTS,
        // REST,
      ].filter((_) => _ !== null).join('\n')
    }
  }
}

function buildRecordCloner(x: Type.Record<Builder>): Builder {
  return function cloneRecord(PREV_SPEC, NEXT_SPEC, IX) {
    const BINDING = `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = Object.create(null);`
    const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, 'value'], IX.isOptional)
    const PREV_CHILD_ACCESSOR = joinPath([PREV_SPEC.ident, 'value'], IX.isOptional)
    const PREV_CHILD_IDENT = ident(PREV_CHILD_ACCESSOR, IX.bindings)
    const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings)
    const KEY_IDENT = ident('key', IX.bindings)
    let mutateDontAssign = x.patternProperties !== undefined
    let PATTERN_PROPERTIES: null | string = null
    if (x.patternProperties) {
      PATTERN_PROPERTIES = Object_entries(x.patternProperties).map(([k, continuation], i) => [
        `${i === 0 ? '' : 'else '}if(/${k.length === 0 ? '^$' : k}/.test(${KEY_IDENT})) {`,
        continuation(
          { path: [...PREV_SPEC.path, 'value'], ident: PREV_CHILD_IDENT },
          { path: [...NEXT_SPEC.path, 'value'], ident: NEXT_CHILD_IDENT },
          { ...IX, mutateDontAssign, isProperty: false },
        ),
        '}',
      ].join('\n')).join('\n')
    }
    return [
      BINDING,
      `for (let ${KEY_IDENT} in ${PREV_SPEC.ident}) {`,
      `const ${PREV_CHILD_IDENT} = ${PREV_SPEC.ident}[${KEY_IDENT}]`,
      mutateDontAssign ? `let ${NEXT_CHILD_IDENT}` : null,
      PATTERN_PROPERTIES,
      `${NEXT_SPEC.ident}[${KEY_IDENT}] = ${NEXT_CHILD_IDENT}`,
      `}`,
    ].filter((_) => _ !== null).join('\n')
  }
}

function buildOptionalCloner(x: Type.Optional<Builder>, input: Type.F<unknown>): Builder {
  if (!tagged('optional')(input)) return invariant('cloneOptional', 'expected input to be an optional schema', input)
  if (tagged('optional')(input.schema)) {
    return x.schema
  } else {
    return function deepCloneOptional(PREV_SPEC, NEXT_SPEC, IX) {
      const NEXT_BINDING = IX.bindings.get(NEXT_SPEC.ident)
      const childIsVoidOrUndefined = isVoidOrUndefined(input.schema)
      if (IX.isProperty) {
        return [
          `let ${NEXT_SPEC.ident};`,
          childIsVoidOrUndefined ? null : `if (${PREV_SPEC.ident} !== undefined) {`,
          x.schema(PREV_SPEC, NEXT_SPEC, { ...IX, mutateDontAssign: true }),
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
          x.schema(PREV_SPEC, NEXT_SPEC, { ...IX, mutateDontAssign: true }),
          `}`,
        ].filter((_) => _ !== null).join('\n')
      }
    }
  }
}

function buildObjectCloner(x: Type.Object<Builder>, input: Type.F<unknown>): Builder {
  if (!tagged('object')(input)) return invariant('cloneObject', 'expected input to be an object schema', input)
  return function cloneObject(PREV_SPEC, NEXT_SPEC, IX) {
    const ASSIGN = `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = Object.create(null);`
    return [
      ASSIGN,
      ...Object.entries(x.properties).map(([key, continuation]) => {
        const PREV_PATH_ACCESSOR = joinPath([PREV_SPEC.ident, key], IX.isOptional)
        const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, key], IX.isOptional)
        const PREV_CHILD_IDENT = ident(PREV_PATH_ACCESSOR, IX.bindings)
        const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings)
        const CHILD_ASSIGN = isOptional(input.properties[key]) ? null : `${NEXT_CHILD_ACCESSOR} = ${NEXT_CHILD_IDENT}`
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
    ].join('\n')
  }
}

function buildUnionCloner(x: Type.Union<Builder>, input: Type.F<unknown>): Builder {
  if (!tagged('anyOf')(input)) return invariant('cloneUnion', 'expected input to be a union schema', input)
  const xs = x.anyOf
  const inputs = input.anyOf
  if (!areAllObjects(inputs)) {
    return buildInclusiveUnionCloner(xs, inputs)
  } else {
    const withTags = getTags(inputs)
    return withTags === null
      ? buildInclusiveUnionCloner(xs, inputs)
      : buildExclusiveUnionCloner(xs, withTags)
  }
}

function buildInclusiveUnionCloner(
  xs: readonly Builder[],
  options: readonly unknown[]
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
              const BODY = continuation(PREV_SPEC, NEXT_SPEC, { ...IX, mutateDontAssign: true })
              const FUNCTION_IDENT = ident(`check`, IX.bindings)
              const CHECK = check.writeable(option as T.TSchema, { functionName: FUNCTION_IDENT })
              return [
                CHECK,
                `if (${FUNCTION_IDENT}(${PREV_SPEC.ident})) {`,
                BODY,
                `}`,
              ].join('\n')
            }
          })
      ].filter((_) => _ !== null).join('\n')
    }
  }
}

function buildExclusiveUnionCloner(
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

function cloneNever(...args: Parameters<Builder>) { return assign(...args) }
function cloneAny(...args: Parameters<Builder>) { return assign(...args) }
function cloneUnknown(...args: Parameters<Builder>) { return assign(...args) }
function cloneVoid(...args: Parameters<Builder>) { return assign(...args) }
function cloneNull(...args: Parameters<Builder>) { return assign(...args) }
function cloneUndefined(...args: Parameters<Builder>) { return assign(...args) }
function cloneBoolean(...args: Parameters<Builder>) { return assign(...args) }
function cloneInteger(...args: Parameters<Builder>) { return assign(...args) }
function cloneBigInt(...args: Parameters<Builder>) { return assign(...args) }
function cloneNumber(...args: Parameters<Builder>) { return assign(...args) }
function cloneString(...args: Parameters<Builder>) { return assign(...args) }
function cloneSymbol(...args: Parameters<Builder>) { return assign(...args) }
function cloneLiteral(...args: Parameters<Builder>) { return assign(...args) }
function cloneDate(PREV_SPEC: PathSpec, NEXT_SPEC: PathSpec, IX: Scope) {
  const KEYWORD = IX.mutateDontAssign ? '' : `const `
  return `${KEYWORD}${NEXT_SPEC.ident} = new ${IX.useGlobalThis ? 'globalThis.' : ''}Date(${PREV_SPEC.ident}?.getTime())`
}

const fold = F.fold<Builder>((x, _, input) => {
  switch (true) {
    default: return (void (x satisfies never), () => '')
    case tagged('never')(x): return cloneNever
    case tagged('any')(x): return cloneAny
    case tagged('unknown')(x): return cloneUnknown
    case tagged('void')(x): return cloneVoid
    case tagged('null')(x): return cloneNull
    case tagged('undefined')(x): return cloneUndefined
    case tagged('boolean')(x): return cloneBoolean
    case tagged('integer')(x): return cloneInteger
    case tagged('bigInt')(x): return cloneBigInt
    case tagged('number')(x): return cloneNumber
    case tagged('string')(x): return cloneString
    case tagged('symbol')(x): return cloneSymbol
    case tagged('date')(x): return cloneDate
    case tagged('literal')(x): return cloneLiteral
    case tagged('array')(x): return buildArrayCloner(x)
    case tagged('record')(x): return buildRecordCloner(x)
    case tagged('optional')(x): return buildOptionalCloner(x, input)
    case tagged('allOf')(x): return buildIntersectionCloner(x)
    case tagged('anyOf')(x): return buildUnionCloner(x, input)
    case tagged('tuple')(x): return buildTupleCloner(x, input)
    case tagged('object')(x): return buildObjectCloner(x, input)
  }
})

export declare namespace deepClone {
  type Options = toType.Options & {
    /**
     * Configure the name of the generated deep clone function
     * @default "deepClone"
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
 * ## {@link deepClone `JsonSchema.deepClone`}
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
 * Note that the "deep clone function" generated by {@link deepClone `JsonSchema.deepClone`}
 * **assumes that both values have already been validated**. Passing
 * invalid data to the clone function will result in undefined behavior.
 * 
 * Note that {@link deepClone `JsonSchema.deepClone`} works in any environment that 
 * supports defining functions using the `Function` constructor. If your
 * environment does not support the `Function` constructor, use 
 * {@link deepClone_writeable `JsonSchema.deepClone.writeable`}.
 * 
 * See also:
 * - {@link deepClone_writeable `JsonSchema.deepClone.writeable`}
 *
 * @example
 * import { assert } from 'vitest'
 * import { JsonSchema } from '@traversable/json-schema'
 * 
 * const deepClone = JsonSchema.deepClone({
 *   type: 'object',
 *   required: ['street1', 'city'],
 *   properties: {
 *     street1: { type: 'string' },
 *     street2: { type: 'string' },
 *     city: { type: 'string' },
 *   }
 * })
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

export function deepClone<const S extends T.TSchema, T = T.Static<S>>(schematic: S): (cloneMe: T) => T
export function deepClone(schematic: T.TSchema) {
  const processed = preprocess(schematic as Type.F<unknown>) as Type.F<Builder>
  const BODY = fold(processed)(defaultPrevSpec, defaultNextSpec, defaultIndex())
  return globalThis.Function('prev', [
    BODY,
    `return next`
  ].join('\n'))
}

deepClone.writeable = deepClone_writeable

/**
 * ## {@link deepClone_writeable `JsonSchema.deepClone.writeable`}
 *
 * Derive a "writeable" (stringified) _deep clone function_ 
 * from a JSON Schema spec.
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
 * {@link deepClone_writeable `JsonSchema.deepClone.writeable`}
 * **assumes that both values have already been validated**. Passing
 * invalid data to the clone function will result in undefined behavior.
 * You don't have to worry about this as long as you
 * 
 * {@link deepClone_writeable `JsonSchema.deepClone.writeable`} accepts an optional
 * configuration object as its second argument; documentation for those
 * options are available via hover on autocompletion.
 * 
 * See also:
 * - {@link deepClone `JsonSchema.deepClone`}
 *
 * @example
 * import { JsonSchema } from '@traversable/json-schema'
 * 
 * const deepClone = JsonSchema.deepClone.writeable({
 *   type: 'object',
 *   required: ['street1', 'city'],
 *   properties: {
 *     street1: { type: 'string' },
 *     street2: { type: 'string' },
 *     city: { type: 'string' },
 *   }
 * }, { typeName: 'Type' })
 * 
 * console.log(deepClone) 
 * // =>
 * // type Address = { street1: string; street2?: string; city: string; }
 * // function clone(prev: Address): Address {
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

function deepClone_writeable(schematic: T.TSchema, options?: deepClone.Options): string {
  const index = { ...defaultIndex(), useGlobalThis: options?.useGlobalThis } satisfies Scope
  const processed = preprocess(schematic as Type.F<Builder>)
  const compiled = fold(processed)(defaultPrevSpec, defaultNextSpec, index)
  const inputType = toType(schematic, options)
  const TYPE = options?.typeName ?? inputType
  const FUNCTION_NAME = options?.functionName ?? 'deepClone'
  const BODY = compiled.length === 0 ? null : compiled
  return [
    options?.typeName === undefined ? null : inputType,
    `function ${FUNCTION_NAME} (prev: ${TYPE}) {`,
    BODY,
    `return next`,
    `}`,
  ].filter((_) => _ !== null).join('\n')
}


