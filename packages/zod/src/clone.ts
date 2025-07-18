import { z } from 'zod'
import { createIdentifier, ident, joinPath, accessor, stringifyLiteral } from '@traversable/registry'

import * as F from './functor.js'
import { check } from './check.js'
import { toType } from './to-type.js'
import { AnyTypeName, hasTypeName, tagged, TypeName } from './typename.js'
import type { Discriminated, PathSpec } from './utils.js'
import {
  areAllObjects,
  defaultNextSpec,
  defaultPrevSpec,
  getTags,
  inlinePrimitiveCheck,
  isOptional,
  isPrimitive,
  schemaOrdering,
} from './utils.js'

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

type UnsupportedSchema = F.Z.Catalog[typeof clone_unsupported[number]]
const clone_unsupported = [
  'catch',
  'default',
  'prefault',
  'success',
  'transform',
  'promise',
] satisfies AnyTypeName[]

function isUnsupported(x: unknown): x is UnsupportedSchema {
  return hasTypeName(x) && clone_unsupported.includes(x._zod.def.type as never)
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
  [TypeName.file]: function cloneFile(...args) { return assignOrMutate(...args) },
  [TypeName.enum]: function cloneEnum(...args) { return assignOrMutate(...args) },
  [TypeName.literal]: function cloneLiteral(...args) { return assignOrMutate(...args) },
  [TypeName.template_literal]: function cloneTemplateLiteral(...args) { return assignOrMutate(...args) },
  [TypeName.date]: function cloneDate(PREV_SPEC, NEXT_SPEC, IX) {
    const KEYWORD = IX.mutateDontAssign ? '' : `const `
    return `${KEYWORD}${NEXT_SPEC.ident} = new Date(${PREV_SPEC.ident}?.getTime())`
  },
} satisfies Record<string, Builder>

function optionalWriteable(x: F.Z.Optional<Builder>): Builder {
  return function cloneOptional(PREV_SPEC, NEXT_SPEC, IX) {
    const lead = NEXT_SPEC.path.slice(0, -1)
    const leadIdent = createIdentifier(lead[0] + lead.slice(1).map((v) => accessor(v, false)).join(''))
    const last = NEXT_SPEC.path[NEXT_SPEC.path.length - 1]
    const LEAD = IX.bindings.get(joinPath(lead, false))
    const NEXT_ACCESSOR = LEAD === undefined
      ? `${leadIdent}${accessor(last, false)}`
      : joinPath([`${LEAD}`, last], IX.isOptional)
    const ASSIGN = lead.length === 0 ? null : NEXT_ACCESSOR === null
      ? `${joinPath(NEXT_SPEC.path, IX.isOptional)} = ${NEXT_SPEC.ident};`
      : `${NEXT_ACCESSOR} = ${NEXT_SPEC.ident};`

    if (lead.length === 0) {
      return [
        `let ${NEXT_SPEC.ident};`,
        `if (${PREV_SPEC.ident} !== undefined) {`,
        x._zod.def.innerType(PREV_SPEC, NEXT_SPEC, { ...IX, mutateDontAssign: true }),
        ASSIGN,
        `}`,
      ].filter((_) => _ !== null).join('\n')
    } else {
      return [
        `if (${PREV_SPEC.ident} !== undefined) {`,
        x._zod.def.innerType(PREV_SPEC, NEXT_SPEC, IX),
        ASSIGN,
        `}`,
      ].filter((_) => _ !== null).join('\n')
    }
  }
}

function nullableWriteable(x: F.Z.Nullable<Builder>, input: z.ZodNullable): Builder {
  return buildUnionCloner(
    { _zod: { def: { type: 'union', options: [x._zod.def.innerType, defaultWriteable.null] } } },
    [input._zod.def.innerType, z.null()]
  )
}

function setWriteable(x: F.Z.Set<Builder>): Builder {
  return function cloneSet(PREV_SPEC, NEXT_SPEC, IX) {
    const VALUE = ident('value', IX.bindings)
    const NEXT_VALUE = ident(`${NEXT_SPEC.ident}_value`, IX.bindings)
    return [
      `const ${NEXT_SPEC.ident} = new Set();`,
      `for (let ${VALUE} of ${PREV_SPEC.ident}) {`,
      x._zod.def.valueType(
        { path: PREV_SPEC.path, ident: VALUE },
        { path: [...NEXT_SPEC.path, VALUE], ident: NEXT_VALUE },
        { ...IX, mutateDontAssign: false },
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
    const NEXT_KEY = ident(`${NEXT_SPEC.ident}_key`, IX.bindings)
    const NEXT_VALUE = ident(`${NEXT_SPEC.ident}_value`, IX.bindings)
    return [
      `const ${NEXT_SPEC.ident} = new Map();`,
      `for (let [${KEY}, ${VALUE}] of ${PREV_SPEC.ident}) {`,
      x._zod.def.keyType(
        { path: PREV_SPEC.path, ident: KEY },
        { path: [...NEXT_SPEC.path, KEY], ident: NEXT_KEY },
        { ...IX, mutateDontAssign: false },
      ),
      x._zod.def.valueType(
        { path: PREV_SPEC.path, ident: VALUE },
        { path: [...NEXT_SPEC.path, VALUE], ident: NEXT_VALUE },
        { ...IX, mutateDontAssign: false },
      ),
      `${NEXT_SPEC.ident}.set(${NEXT_KEY}, ${NEXT_VALUE});`,
      `}`,
    ].join('\n')
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

function buildUnionCloner(
  x: F.Z.Union<Builder>,
  options: readonly z.core.$ZodType[]
): Builder {
  return function cloneUnion(PREV_SPEC, NEXT_SPEC, IX) {
    if (x._zod.def.options.length === 0) return `const ${NEXT_SPEC.ident} = undefined`
    else {
      return [
        `let ${NEXT_SPEC.ident};`,
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
      `let ${NEXT_SPEC.ident};`,
      ...TAGGED.map(({ tag }, I) => {
        const TAG = stringifyLiteral(tag)
        const continuation = x._zod.def.options[I]
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
      const ASSIGNMENTS = Array.from({ length: x._zod.def.items.length }).map(
        (_, I) => `${NEXT_SPEC.ident}[${I}] = ${IX.bindings.get(`${NEXT_SPEC.ident}[${I}]`)}`
      )
      return [
        `const ${NEXT_SPEC.ident} = new Array(${PREV_SPEC.ident}.length);`,
        ...CHILDREN,
        ...ASSIGNMENTS
      ].join('\n')
    }
  }
}

function intersectionWriteable(x: F.Z.Intersection<Builder>): Builder {
  return function cloneIntersection(PREV_SPEC, NEXT_SPEC, IX) {
    const PATTERN = `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = Object.create(null);\n`
    const LEFT = x._zod.def.left(PREV_SPEC, NEXT_SPEC, { ...IX, mutateDontAssign: false })
    const RIGHT = x._zod.def.right(PREV_SPEC, NEXT_SPEC, { ...IX, mutateDontAssign: false })
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
    ].join('\n')
  }
}

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
    case tagged('nullable')(x): return nullableWriteable(x, input as z.ZodNullable)
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
  const BODY = interpret(type as F.Z.Hole<Builder>)(defaultPrevSpec, defaultNextSpec, defaultIndex())
  return globalThis.Function('prev', [
    BODY,
    `return next`
  ].join('\n'))
}

clone.writeable = clone_writeable
clone.unsupported = clone_unsupported

function clone_writeable<T extends z.core.$ZodType>(type: T, options?: clone.Options): string {
  const index = { ...defaultIndex(), useGlobalThis: options?.useGlobalThis } satisfies Scope
  const compiled = interpret(type as F.Z.Hole<Builder>)(defaultPrevSpec, defaultNextSpec, index)
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
