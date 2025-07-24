import { fn, ident, joinPath, Object_keys, stringifyKey, stringifyLiteral } from '@traversable/registry'
import type { Discriminated, PathSpec } from '@traversable/json-schema-types'
import {
  F,
  check,
  flattenUnion,
  JsonSchema,
  areAllObjects,
  defaultNextSpec,
  defaultPrevSpec,
  getTags,
  inlinePrimitiveCheck,
  isPrimitive,
  schemaOrdering,
  toType,
} from '@traversable/json-schema-types'

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
  isProperty: false,
  varName: 'value',
}) satisfies Scope

function isAtomic(x: JsonSchema): boolean {
  switch (true) {
    default: return false
    case JsonSchema.isNull(x):
    case JsonSchema.isBoolean(x):
    case JsonSchema.isInteger(x):
    case JsonSchema.isNumber(x):
    case JsonSchema.isString(x):
    case JsonSchema.isNever(x): return true
    case JsonSchema.isUnion(x): return x.anyOf.some(isAtomic)
  }
}

const preprocess = F.fold<JsonSchema>((x) => JsonSchema.isUnion(x) ? { anyOf: flattenUnion(x.anyOf) } : x)

function assign(PREV_SPEC: PathSpec, NEXT_SPEC: PathSpec, IX: Scope) {
  return `${IX.mutateDontAssign ? '' : `const `}${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
}

function arrayWriteable(x: JsonSchema.Array<Builder>): Builder {
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

function intersectionWriteable(x: JsonSchema.Intersection<Builder>): Builder {
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
// const ASSIGNMENTS = Array.from({ length: lastRequiredIndex }).map(

function tupleWriteable(x: JsonSchema.Tuple<Builder>, input: JsonSchema.Tuple<JsonSchema>): Builder {
  return function cloneTuple(PREV_SPEC, NEXT_SPEC, IX) {
    let REST: string | null = null
    if (x.items) {
      const LENGTH = ident('length', IX.bindings)
      const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, 'item'], IX.isOptional)
      const PREV_CHILD_ACCESSOR = joinPath([PREV_SPEC.ident, 'item'], IX.isOptional)
      const PREV_CHILD_IDENT = ident(PREV_CHILD_ACCESSOR, IX.bindings)
      const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings, 'dontBind')
      const INDEX = ident('ix', IX.bindings)
      REST = [
        `const ${LENGTH} = ${PREV_SPEC.ident}.length;`,
        `for (let ${INDEX} = ${x.prefixItems.length}; ${INDEX} < ${LENGTH}; ${INDEX}++) {`,
        `const ${PREV_CHILD_IDENT} = ${PREV_SPEC.ident}[${INDEX}]`,
        x.items(
          { path: [...PREV_SPEC.path, 'item'], ident: PREV_CHILD_IDENT },
          { path: [...NEXT_SPEC.path, 'item'], ident: NEXT_CHILD_IDENT },
          { ...IX, mutateDontAssign: false, isProperty: false },
        ),
        `${NEXT_SPEC.ident}[${INDEX}] = ${NEXT_CHILD_IDENT}`,
        `}`
      ].join('\n')
    }
    if (x.prefixItems.length === 0) {
      return [
        `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = new ${IX.useGlobalThis ? 'globalThis.' : ''}Array();`,
        REST,
      ].filter((_) => _ !== null).join('\n')
    } else {
      const CHILDREN = x.prefixItems.map((continuation, I) => {
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
      const ASSIGNMENTS = Array.from({ length: x.prefixItems.length }).map(
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

/**
 * @example
 * let CATCHALL: string | null = null
 * if (x._zod.def.catchall !== undefined) {
 *   const keys = Object_keys(x._zod.def.shape)
 *   const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, 'value'], IX.isOptional)
 *   const PREV_CHILD_ACCESSOR = joinPath([PREV_SPEC.ident, 'value'], IX.isOptional)
 *   const PREV_CHILD_IDENT = ident(PREV_CHILD_ACCESSOR, IX.bindings)
 *   const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings)
 *   const INDEX = ident('key', IX.bindings)
 *   const KNOWN_KEY_CHECK = keys.map((k) => `${INDEX} === ${stringifyKey(k)}`).join(' || ')
 *   CATCHALL = [
 *     `for (let ${INDEX} in ${PREV_SPEC.ident}) {`,
 *     `const ${PREV_CHILD_IDENT} = ${PREV_SPEC.ident}[${INDEX}];`,
 *     keys.length === 0 ? null : `if (${KNOWN_KEY_CHECK}) continue;`,
 *     x._zod.def.catchall(
 *       { path: [...PREV_SPEC.path, 'value'], ident: PREV_CHILD_IDENT },
 *       { path: [...NEXT_SPEC.path, 'value'], ident: NEXT_CHILD_IDENT },
 *       { ...IX, mutateDontAssign: false, isProperty: false },
 *     ),
 *     `${NEXT_SPEC.ident}[${INDEX}] = ${NEXT_CHILD_IDENT}`,
 *     `}`,
 *   ].filter((_) => _ !== null).join('\n')
 * }
 */
function recordWriteable(x: JsonSchema.Record<Builder>): Builder {
  return function cloneRecord(PREV_SPEC, NEXT_SPEC, IX) {
    return '// TODO'
    // const BINDING = `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = Object.create(null);`
    // const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, 'value'], IX.isOptional)
    // const PREV_CHILD_ACCESSOR = joinPath([PREV_SPEC.ident, 'value'], IX.isOptional)
    // const PREV_CHILD_IDENT = ident(PREV_CHILD_ACCESSOR, IX.bindings)
    // const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings)
    // const KEY = ident('key', IX.bindings)
    // return [
    //   BINDING,
    //   `for (let ${KEY} in ${PREV_SPEC.ident}) {`,
    //   `const ${PREV_CHILD_IDENT} = ${PREV_SPEC.ident}[${KEY}]`,
    //   x._zod.def.valueType(
    //     { path: [...PREV_SPEC.path, 'value'], ident: PREV_CHILD_IDENT },
    //     { path: [...NEXT_SPEC.path, 'value'], ident: NEXT_CHILD_IDENT },
    //     { ...IX, mutateDontAssign: false, isProperty: false },
    //   ),
    //   `${NEXT_SPEC.ident}[${KEY}] = ${NEXT_CHILD_IDENT}`,
    //   `}`,
    // ].join('\n')
  }
}

function optionalWriteable(continuation: Builder): Builder {
  return function cloneOptional(PREV_SPEC, NEXT_SPEC, IX) {
    const NEXT_BINDING = IX.bindings.get(NEXT_SPEC.ident)
    // if (IX.isProperty) {
    return [
      `let ${NEXT_SPEC.ident};`,
      `if (${PREV_SPEC.ident} !== undefined) {`,
      continuation(PREV_SPEC, NEXT_SPEC, { ...IX, mutateDontAssign: true }),
      `${NEXT_BINDING} = ${NEXT_SPEC.ident}`,
      `}`,
    ].filter((_) => _ !== null).join('\n')
    // } 
    // else {
    //   const HAS_ALREADY_BEEN_DECLARED = NEXT_BINDING !== undefined
    //   const CONDITIONAL_NEXT_IDENT = HAS_ALREADY_BEEN_DECLARED ? null : ident(NEXT_SPEC.ident, IX.bindings)
    //   const CONDITIONAL_LET_BINDING = CONDITIONAL_NEXT_IDENT === null ? null : `let ${NEXT_SPEC.ident}`
    //   return [
    //     CONDITIONAL_LET_BINDING,
    //     `if (${PREV_SPEC.ident} === undefined) {`,
    //     `${NEXT_SPEC.ident} = undefined`,
    //     `} else {`,
    //     x._zod.def.innerType(PREV_SPEC, NEXT_SPEC, { ...IX, mutateDontAssign: true }),
    //     `}`,
    //   ].filter((_) => _ !== null).join('\n')
    // }
  }
}


function objectWriteable(x: JsonSchema.Object<Builder>, input: JsonSchema.Object<JsonSchema>): Builder {
  return function cloneObject(PREV_SPEC, NEXT_SPEC, IX) {
    const ASSIGN = `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = Object.create(null);`
    const optional = Object.entries(input.properties).filter(([k]) => !x.required.includes(k)).map(([k]) => k)
    return [
      ASSIGN,
      ...Object.entries(x.properties).map(([key, continuation]) => {
        const PREV_PATH_ACCESSOR = joinPath([PREV_SPEC.ident, key], IX.isOptional)
        const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, key], IX.isOptional)
        const PREV_CHILD_IDENT = ident(PREV_PATH_ACCESSOR, IX.bindings)
        const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings)
        const CHILD_ASSIGN = optional.includes(key) ? null : `${NEXT_CHILD_ACCESSOR} = ${NEXT_CHILD_IDENT}`
        const CONTINUATION = optional.includes(key) ? optionalWriteable(continuation) : continuation
        return [
          `const ${PREV_CHILD_IDENT} = ${joinPath([PREV_SPEC.ident, key], IX.isOptional)};`,
          CONTINUATION(
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

function unionWriteable(x: JsonSchema.Union<Builder>, input: JsonSchema.Union<JsonSchema>): Builder {
  const xs = x.anyOf
  const inputs = input.anyOf
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
  options: readonly JsonSchema[]
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
    case JsonSchema.isEnum(x): return function cloneEnum(...args) { return assign(...args) }
    case JsonSchema.isNever(x): return function cloneNever(...args) { return assign(...args) }
    case JsonSchema.isNull(x): return function cloneNull(...args) { return assign(...args) }
    case JsonSchema.isBoolean(x): return function cloneBoolean(...args) { return assign(...args) }
    case JsonSchema.isInteger(x): return function cloneInteger(...args) { return assign(...args) }
    case JsonSchema.isNumber(x): return function cloneNumber(...args) { return assign(...args) }
    case JsonSchema.isString(x): return function cloneString(...args) { return assign(...args) }
    case JsonSchema.isConst(x): return function cloneConst(...args) { return assign(...args) }
    case JsonSchema.isArray(x): return arrayWriteable(x)
    case JsonSchema.isRecord(x): return recordWriteable(x)
    case JsonSchema.isIntersection(x): return intersectionWriteable(x)
    case JsonSchema.isUnion(x): return unionWriteable(x, input as JsonSchema.Union<JsonSchema>)
    case JsonSchema.isTuple(x): return tupleWriteable(x, input as JsonSchema.Tuple<JsonSchema>)
    case JsonSchema.isObject(x): return objectWriteable(x, input as JsonSchema.Object<JsonSchema>)
    case JsonSchema.isUnknown(x): return function cloneUnknown(...args) { return assign(...args) }
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
 * ## {@link clone `JsonSchema.clone`}
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
 * Note that the "deep clone function" generated by {@link clone `JsonSchema.clone`}
 * **assumes that both values have already been validated**. Passing
 * invalid data to the clone function will result in undefined behavior.
 * 
 * Note that {@link clone `JsonSchema.clone`} works in any environment that 
 * supports defining functions using the `Function` constructor. If your
 * environment does not support the `Function` constructor, use 
 * {@link clone_writeable `JsonSchema.clone_writeable`}.
 * 
 * See also:
 * - {@link clone_writeable `JsonSchema.clone.writeable`}
 *
 * @example
 * import { assert } from 'vitest'
 * import { z } from 'zod'
 * import { JsonSchema } from '@traversable/json-schema'
 * 
 * const Address = z.object({
 *   street1: z.string(),
 *   strret2: z.optional(z.string()),
 *   city: z.string(),
 * })
 * 
 * const clone = JsonSchema.clone(Address)
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

export function clone<const S extends JsonSchema, T = toType<S>>(schema: S): (cloneMe: T) => T
export function clone(schema: JsonSchema) {
  const processed = preprocess(schema)
  const BODY = interpret(processed)(defaultPrevSpec, defaultNextSpec, defaultIndex())
  return globalThis.Function('prev', [
    BODY,
    `return next`
  ].join('\n'))
}

clone.writeable = clone_writeable

/**
 * ## {@link clone_writeable `JsonSchema.clone.writeable`}
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
 * {@link clone_writeable `JsonSchema.clone.writeable`}
 * **assumes that both values have already been validated**. Passing
 * invalid data to the clone function will result in undefined behavior.
 * You don't have to worry about this as long as you
 * 
 * {@link clone_writeable `JsonSchema.clone.writeable`} accepts an optional
 * configuration object as its second argument; documentation for those
 * options are available via hover on autocompletion.
 * 
 * See also:
 * - {@link clone `JsonSchema.clone`}
 *
 * @example
 * import { JsonSchema } from '@traversable/json-schema'
 * 
 * const Address = z.object({
 *   street1: z.string(),
 *   strret2: z.optional(z.string()),
 *   city: z.string(),
 * })
 * 
 * const clone = JsonSchema.clone.writeable(Address, {
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

function clone_writeable(schema: JsonSchema, options?: clone.Options): string {
  const index = { ...defaultIndex(), useGlobalThis: options?.useGlobalThis } satisfies Scope
  const processed = preprocess(schema)
  const compiled = interpret(processed)(defaultPrevSpec, defaultNextSpec, index)
  const inputType = toType(schema, options)
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

