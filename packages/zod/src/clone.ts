import { z } from 'zod'
import type { Target } from '@traversable/registry'
import {
  createIdentifier,
  ident,
  joinPath,
  Object_is,
  Object_hasOwn,
  Object_keys,
  stringifyKey,
  intersectKeys,
  indexAccessor,
  keyAccessor,
  accessor,
} from '@traversable/registry'

import * as F from './functor.js'
import { check } from './check.js'
import { toType } from './to-type.js'
import { AnyTypeName, hasTypeName, tagged, TypeName } from './typename.js'
import type { Discriminated, PathSpec } from './utils.js'
import { areAllObjects, getTags, inlinePrimitiveCheck, isOptional, isPrimitive, schemaOrdering } from './utils.js'

export type Builder = (prev: PathSpec, next: PathSpec, ix: Scope) => string

export interface Scope extends F.CompilerIndex {
  bindings: Map<string, string>
  isRoot: boolean
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

type UnsupportedSchema = F.Z.Catalog[typeof unsupported[number]]
const unsupported = [
  'catch',
  'default',
  'prefault',
  'success',
  'transform',
  'promise',
] satisfies AnyTypeName[]

function isUnsupported(x: unknown): x is UnsupportedSchema {
  return hasTypeName(x) && unsupported.includes(x._zod.def.type as never)
}

function assignOrMutate(PREV_SPEC: PathSpec, NEXT_SPEC: PathSpec, IX: Scope) {
  return `${IX.mutateDontAssign ? '' : `const `}${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
}

const defaultWriteable = {
  [TypeName.any]: function cloneAny(...args) { return assignOrMutate(...args) },
  [TypeName.unknown]: function cloneUnknown(...args) { return assignOrMutate(...args) },
  [TypeName.never]: function cloneNever(...args) { return assignOrMutate(...args) },
  [TypeName.void]: function cloneVoid(...args) { return assignOrMutate(...args) },
  [TypeName.undefined]: function cloneUndefined(...args) { return assignOrMutate(...args) },
  [TypeName.null]: function cloneNull(...args) { return assignOrMutate(...args) },
  [TypeName.nan]: function cloneNaN(...args) { return assignOrMutate(...args) },
  [TypeName.boolean]: function cloneBoolean(...args) { return assignOrMutate(...args) },
  [TypeName.symbol]: function cloneSymbol(...args) { return assignOrMutate(...args) },
  [TypeName.int]: function cloneInt(...args) { return assignOrMutate(...args) },
  [TypeName.bigint]: function cloneBigInt(...args) { return assignOrMutate(...args) },
  [TypeName.number]: function cloneNumber(...args) { return assignOrMutate(...args) },
  [TypeName.string]: function cloneString(...args) { return assignOrMutate(...args) },
  [TypeName.date]: function cloneDate(...args) { return assignOrMutate(...args) },
  [TypeName.file]: function cloneFile(...args) { return assignOrMutate(...args) },
  [TypeName.enum]: function cloneEnum(...args) { return assignOrMutate(...args) },
  [TypeName.literal]: function cloneLiteral(...args) { return assignOrMutate(...args) },
  [TypeName.template_literal]: function cloneTemplateLiteral(...args) { return assignOrMutate(...args) },
} satisfies Record<string, Builder>

const interpret = F.fold<Builder>((x, ix, input) => {
  switch (true) {
    default: return (void (x satisfies never), () => '')
    case tagged('enum')(x):
    case F.isNullary(x): return defaultWriteable[x._zod.def.type]
    case tagged('lazy')(x): return x._zod.def.getter()
    case tagged('pipe')(x): return x._zod.def.out
    case tagged('nonoptional')(x): return x._zod.def.innerType
    case tagged('readonly')(x): return x._zod.def.innerType
    case tagged('array')(x): return arrayWriteable(x)
    case tagged('optional')(x): return optionalWriteable(x)
    case tagged('nullable')(x): return nullableWriteable(x)
    case tagged('set')(x): return setWriteable(x)
    case tagged('map')(x): return mapWriteable(x)
    case tagged('record')(x): return recordWriteable(x)
    case tagged('union')(x): return unionWriteable(x, input as z.ZodUnion<never>)
    case tagged('intersection')(x): return intersectionWriteable(x)
    case tagged('tuple')(x): return tupleWriteable(x)
    case tagged('object')(x): return objectWriteable(x, input as z.ZodObject)
    case isUnsupported(x): return import('./utils.js').then(({ Invariant }) =>
      Invariant.Unimplemented(x._zod.def.type, 'zx.clone')) as never
  }
})

function optionalWriteable(x: F.Z.Optional<Builder>): Builder {
  return function cloneOptional(PREV_SPEC, NEXT_SPEC, IX) {
    const lead = NEXT_SPEC.path.slice(0, -1)
    const leadIdent = createIdentifier(lead[0] + lead.slice(1).map((v) => accessor(v, false)).join(''))
    const last = NEXT_SPEC.path[NEXT_SPEC.path.length - 1]
    const LEAD = IX.bindings.get(joinPath(lead, false))
    const NEXT_ACCESSOR = LEAD === undefined
      ? `${leadIdent}${accessor(last, false)}`
      : joinPath([`${LEAD}`, last], IX.isOptional)
    const ASSIGN = NEXT_ACCESSOR === null
      ? `${joinPath(NEXT_SPEC.path, IX.isOptional)} = ${NEXT_SPEC.ident}`
      : `${NEXT_ACCESSOR} = ${NEXT_SPEC.ident}`

    console.group('\n\nOPTIONAL')
    console.log('IX.bindings', IX.bindings)
    console.log('PREV_SPEC', PREV_SPEC)
    console.log('NEXT_SPEC', NEXT_SPEC)
    console.log('lead', lead)
    console.log('leadIdent', leadIdent)
    console.log('LEAD', LEAD)
    console.log('last', last)
    console.log('NEXT_ACCESSOR', NEXT_ACCESSOR)
    console.log('IX.bindings.get(joinPath(NEXT_SPEC.path.slice(0, -1), false))', IX.bindings.get(joinPath(NEXT_SPEC.path.slice(0, -1), false)))
    console.log('\n\njoinPath(NEXT_SPEC.path.slice(0, -1), false)', joinPath(NEXT_SPEC.path.slice(0, -1), false))
    console.log('ASSIGN', ASSIGN)
    console.groupEnd()

    return [
      `if (${PREV_SPEC.ident} !== undefined) {`,
      x._zod.def.innerType(PREV_SPEC, NEXT_SPEC, IX),
      ASSIGN,
      `}`,
    ].filter((_) => _ !== null).join('\n')
  }
}

function nullableWriteable(x: F.Z.Nullable<Builder>): Builder {
  return function cloneNullable(PREV_SPEC, NEXT_SPEC, IX) {
    return [
      `if (${PREV_SPEC.ident} !== null) {`,
      x._zod.def.innerType(PREV_SPEC, NEXT_SPEC, IX),
      `}`,
    ].join('\n')
  }
}

function setWriteable(x: F.Z.Set<Builder>): Builder {
  return function cloneSet(PREV_SPEC, NEXT_SPEC, IX) {
    const PREV = joinPath(PREV_SPEC.path, IX.isOptional)
    const NEXT = joinPath(NEXT_SPEC.path, IX.isOptional)
    /**
     * @example
     * function clone(x: AddressSet): AddressSet {
     *   const out: AddressSet = new Set()
     *   for (let value of x) {
     *     const newValue = Object.create(null)
     *     newValue.street1 = value.street1
     *     if (value.street2 !== undefined) newValue.street2 = value.street2
     *     newValue.city = value.city
     *     out.add(newValue)
     *   }
     *   return out
     * }
     */
    return [].join('\n')
  }
}

function mapWriteable(x: F.Z.Map<Builder>): Builder {
  return function cloneMap(PREV_SPEC, NEXT_SPEC, IX) {
    const PREV = joinPath(PREV_SPEC.path, IX.isOptional)
    const NEXT = joinPath(NEXT_SPEC.path, IX.isOptional)
    /**
     * @example
     * function clone(x: AddressMap): AddressMap {
     *   const out: AddressMap = new Map()
     *   for (let [key, value] of x) {
     *     const newKey = Object.create(null)
     *     newKey.street1 = key.street1
     *     if (key.street2 !== undefined) newKey.street2 = key.street2
     *     newKey.city = key.city
     *     const newValue = value
     *     out.set(newKey, newValue)
     *   }
     *   return out
     * }
     */
    return [].join('\n')
  }
}

function unionWriteable(x: F.Z.Union<Builder>, input: z.ZodUnion): Builder {
  if (!areAllObjects(input._zod.def.options)) {
    return buildUnionCloner(x, input._zod.def.options)
  } else {
    const withTags = getTags(input._zod.def.options)
    return withTags === null
      ? buildUnionCloner(x, input._zod.def.options)
      : buildDisjointUnionCloner(x, withTags)
  }
}

/**
 * @example
 * type Type = number | { street1: string, street2?: string, city: string }
 * function clone(prev: Type) {
 *   if (typeof prev === 'number') {
 *     return prev
 *   }
 *   const next = Object.create(null)
 *   next.street1 = prev.street1
 *   if (prev.street2 !== undefined) next.street2 = prev.street2
 *   next.city = prev.city
 *   return next
 * }
 */

function buildUnionCloner(
  x: F.Z.Union<Builder>,
  options: readonly z.core.$ZodType[]
): Builder {
  return function cloneUnion(PREV_SPEC, NEXT_SPEC, IX) {
    if (x._zod.def.options.length === 0) return `const ${NEXT_SPEC.ident} = undefined`
    else {
      return [
        `let ${NEXT_SPEC.ident}`,
        ...options
          .map((option, i) => [option, i] satisfies [any, any])
          .toSorted(schemaOrdering).map(([option, I]) => {
            const continuation = x._zod.def.options[I]
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
      ].join('\n')
    }
  }
}

function buildDisjointUnionCloner(
  x: F.Z.Union<Builder>,
  [discriminant, TAGGED]: Discriminated
): Builder {
  return function cloneDisjointUnion(PREV_SPEC, NEXT_SPEC, IX) {
    return [

    ].join('\n')
  }
}

function arrayWriteable(x: F.Z.Array<Builder>): Builder {
  return function cloneArray(PREV_SPEC, NEXT_SPEC, IX) {
    const LENGTH = ident('length', IX.bindings)
    const ASSIGN = `${IX.mutateDontAssign ? '' : `const `}${NEXT_SPEC.ident} = new Array(${LENGTH});`
    const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, 'item'], IX.isOptional)
    const PREV_CHILD_ACCESSOR = joinPath([PREV_SPEC.ident, 'item'], IX.isOptional)
    const PREV_CHILD_IDENT = ident(PREV_CHILD_ACCESSOR, IX.bindings)
    const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings)
    const INDEX = ident('ix', IX.bindings)
    return [
      `const ${LENGTH} = ${PREV_SPEC.ident}.length;`,
      ASSIGN,
      `for (let ${INDEX} = ${LENGTH}; ${INDEX}-- !== 0; ) {`,
      `const ${PREV_CHILD_IDENT} = ${PREV_SPEC.ident}[${INDEX}]`,
      x._zod.def.element(
        { path: [...PREV_SPEC.path, 'item'], ident: PREV_CHILD_IDENT },
        { path: [...NEXT_SPEC.path, 'item'], ident: NEXT_CHILD_IDENT },
        { ...IX, mutateDontAssign: false },
      ),
      `${NEXT_SPEC.ident}[${INDEX}] = ${NEXT_CHILD_IDENT}`,
      `}`,
    ].filter((_) => _ !== null).join('\n')
  }
}

function recordWriteable(x: F.Z.Record<Builder>): Builder {
  return function cloneRecord(PREV_SPEC, NEXT_SPEC, IX) {
    const ASSIGN = `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = Object.create(null);`
    const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, 'value'], IX.isOptional)
    const PREV_CHILD_ACCESSOR = joinPath([PREV_SPEC.ident, 'value'], IX.isOptional)
    const PREV_CHILD_IDENT = ident(PREV_CHILD_ACCESSOR, IX.bindings)
    const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings)
    const KEY = ident('key', IX.bindings)
    return [
      ASSIGN,
      `for (let ${KEY} in ${PREV_SPEC.ident}) {`,
      `const ${PREV_CHILD_IDENT} = ${PREV_SPEC.ident}[${KEY}]`,
      x._zod.def.valueType(
        { path: [...PREV_SPEC.path, 'item'], ident: PREV_CHILD_IDENT },
        { path: [...NEXT_SPEC.path, 'item'], ident: NEXT_CHILD_IDENT },
        { ...IX, mutateDontAssign: false },
      ),
      `${NEXT_SPEC.ident}[${KEY}] = ${NEXT_CHILD_IDENT}`,
      `}`,
    ].join('\n')
  }
}

function tupleWriteable(x: F.Z.Tuple<Builder>): Builder {
  return function cloneTuple(PREV_SPEC, NEXT_SPEC, IX) {
    if (x._zod.def.items.length === 0) {
      return `const ${NEXT_SPEC.ident} = new Array(${PREV_SPEC.ident});`
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
            { ...IX, mutateDontAssign: false },
          ),
        ].join('\n')
      })
      return [
        `const ${NEXT_SPEC.ident} = new Array(${PREV_SPEC.ident});`,
        ...CHILDREN,
      ].join('\n')
    }
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

function objectWriteable(x: F.Z.Object<Builder>, input: z.ZodObject): Builder {
  return function cloneObject(PREV_SPEC, NEXT_SPEC, IX) {
    const ASSIGN = `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = Object.create(null);`
    const optional = Object.entries(input._zod.def.shape).filter(([, v]) => isOptional(v)).map(([k]) => k)
    return [
      ASSIGN,
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
            { ...IX, mutateDontAssign: false },
          ),
          CHILD_ASSIGN,
        ].filter((_) => _ !== null).join('\n')
      }),
    ].filter((_) => _ !== null).join('\n')
  }
}

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

export function clone<T extends z.core.$ZodType>(type: T): (cloneMe: z.infer<T>) => z.infer<T>
export function clone(type: z.core.$ZodType) {
  const index = defaultIndex()
  const prevSpec = { path: ['prev'], ident: 'prev' } satisfies PathSpec
  const nextSpec = { path: ['next'], ident: 'next' } satisfies PathSpec
  const BODY = interpret(type as F.Z.Hole<Builder>)(prevSpec, nextSpec, index)
  return globalThis.Function('prev', [
    BODY,
    `return next`
  ].join('\n'))
}

clone.writeable = writeableClone

function writeableClone<T extends z.core.$ZodType>(type: T, options?: clone.Options): string
function writeableClone<T extends z.core.$ZodType>(type: T, options?: clone.Options) {
  const index = { ...defaultIndex(), useGlobalThis: options?.useGlobalThis } satisfies Scope
  const prevSpec = { path: ['prev'], ident: 'prev' } satisfies PathSpec
  const nextSpec = { path: ['next'], ident: 'next' } satisfies PathSpec
  const compiled = interpret(type as F.Z.Hole<Builder>)(prevSpec, nextSpec, index)
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
