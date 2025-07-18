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

function propertyAccessor(path: (string | number)[], IX: Scope) {
  if (path.length === 1) return null
  else if (path.length === 2) return `${path[0]}${accessor(path[1], IX.isOptional)}`
  else {
    const lead = path.slice(0, -1)
    const last = path[path.length - 1]
    const binding = IX.bindings.get(joinPath(lead, IX.isOptional))
    if (!binding)
      return `${createIdentifier(joinPath(lead, IX.isOptional))}${accessor(last, IX.isOptional)}`
    else {
      const parent = createIdentifier(binding)
      return `${parent}${accessor(last, IX.isOptional)}`
    }
  }
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

function nullableWriteable(x: F.Z.Nullable<Builder>, input: z.ZodNullable): Builder {
  return buildUnionCloner(
    { _zod: { def: { type: 'union', options: [x._zod.def.innerType, defaultWriteable.null] } } },
    [input._zod.def.innerType, z.null()]
  )
}

function arrayWriteable(x: F.Z.Array<Builder>): Builder {
  return function cloneArray(PREV_SPEC, NEXT_SPEC, IX) {
    const LENGTH = ident('length', IX.bindings)
    const ASSIGN = `${IX.mutateDontAssign ? '' : `const `}${NEXT_SPEC.ident} = new Array(${LENGTH});`
    const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, 'item'], IX.isOptional)
    const PREV_CHILD_ACCESSOR = joinPath([PREV_SPEC.ident, 'item'], IX.isOptional)
    const PREV_CHILD_IDENT = ident(PREV_CHILD_ACCESSOR, IX.bindings)
    const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings, 'dontBind')
    const INDEX = ident('ix', IX.bindings)
    const ELEMENT = x._zod.def.element(
      { path: [...PREV_SPEC.path, 'item'], ident: PREV_CHILD_IDENT },
      { path: [...NEXT_SPEC.path, 'item'], ident: NEXT_CHILD_IDENT },
      { ...IX, mutateDontAssign: false, isProperty: false },
    )
    return [
      `const ${LENGTH} = ${PREV_SPEC.ident}.length;`,
      ASSIGN,
      `for (let ${INDEX} = ${LENGTH}; ${INDEX}-- !== 0; ) {`,
      `const ${PREV_CHILD_IDENT} = ${PREV_SPEC.ident}[${INDEX}]`,
      ELEMENT,
      `${NEXT_SPEC.ident}[${INDEX}] = ${NEXT_CHILD_IDENT}`,
      `}`,
    ].filter((_) => _ !== null).join('\n')
  }
}

function setWriteable(x: F.Z.Set<Builder>): Builder {
  return function cloneSet(PREV_SPEC, NEXT_SPEC, IX) {
    const VALUE = ident('value', IX.bindings)
    const NEXT_VALUE = `${NEXT_SPEC.ident}_value`
    // const NEXT_VALUE = ident(`${NEXT_SPEC.ident}_value`, IX.bindings)
    const CHILD = x._zod.def.valueType(
      { path: [...PREV_SPEC.path, VALUE], ident: VALUE },
      { path: [...NEXT_SPEC.path, VALUE], ident: NEXT_VALUE },
      { ...IX, mutateDontAssign: false, isProperty: false },
    )
    return [
      `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = new Set();`,
      `for (let ${VALUE} of ${PREV_SPEC.ident}) {`,
      CHILD,
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
    // const NEXT_KEY = ident(`${NEXT_SPEC.ident}_key`, IX.bindings)
    // const NEXT_VALUE = ident(`${NEXT_SPEC.ident}_value`, IX.bindings)
    const KEY_TYPE = x._zod.def.keyType(
      { path: PREV_SPEC.path, ident: KEY },
      { path: [...NEXT_SPEC.path, KEY], ident: NEXT_KEY },
      { ...IX, mutateDontAssign: false, isProperty: false },
    )
    const VALUE_TYPE = x._zod.def.valueType(
      { path: PREV_SPEC.path, ident: VALUE },
      { path: [...NEXT_SPEC.path, VALUE], ident: NEXT_VALUE },
      { ...IX, mutateDontAssign: false, isProperty: false },
    )
    return [
      `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = new Map();`,
      `for (let [${KEY}, ${VALUE}] of ${PREV_SPEC.ident}) {`,
      KEY_TYPE,
      VALUE_TYPE,
      `${NEXT_SPEC.ident}.set(${NEXT_KEY}, ${NEXT_VALUE});`,
      `}`,
    ].join('\n')
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
        { path: [...PREV_SPEC.path, 'value'], ident: PREV_CHILD_IDENT },
        { path: [...NEXT_SPEC.path, 'value'], ident: NEXT_CHILD_IDENT },
        // TODO: should `isProperty` be true?
        // { ...IX, mutateDontAssign: false, isProperty: false },
        { ...IX, mutateDontAssign: false, isProperty: false },
      ),
      `${NEXT_SPEC.ident}[${KEY}] = ${NEXT_CHILD_IDENT}`,
      `}`,
    ].join('\n')
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

// const lastRequiredIndex = 1 + input._zod.def.items.findLastIndex((v) => !isOptional(v))
// const ASSIGNMENTS = Array.from({ length: lastRequiredIndex }).map(

function tupleWriteable(x: F.Z.Tuple<Builder>, input: z.core.$ZodTuple): Builder {
  return function cloneTuple(PREV_SPEC, NEXT_SPEC, IX) {
    if (x._zod.def.items.length === 0) {
      return `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = new Array();`
    } else {
      const CHILDREN = x._zod.def.items.map((continuation, I) => {
        const PREV_PATH_ACCESSOR = joinPath([PREV_SPEC.ident, I], IX.isOptional)
        const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, I], IX.isOptional)
        const PREV_CHILD_IDENT = ident(PREV_PATH_ACCESSOR, IX.bindings)
        const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings)
        const ITEMS = continuation(
          { path: [...PREV_SPEC.path, I], ident: PREV_CHILD_IDENT },
          { path: [...NEXT_SPEC.path, I], ident: NEXT_CHILD_IDENT },
          { ...IX, mutateDontAssign: false, isProperty: true },
        )

        console.group('\n\nTUPLE\n\n')
        console.debug('PREV_CHILD_IDENT', PREV_CHILD_IDENT)
        console.debug('NEXT_CHILD_IDENT', NEXT_CHILD_IDENT)
        console.groupEnd()

        return [
          `const ${PREV_CHILD_IDENT} = ${joinPath([PREV_SPEC.ident, I], IX.isOptional)};`,
          ITEMS,
        ].join('\n')
      })
      const ASSIGNMENTS = Array.from({ length: x._zod.def.items.length }).map(
        (_, I) => `${NEXT_SPEC.ident}[${I}] = ${IX.bindings.get(`${NEXT_SPEC.ident}[${I}]`)}`
      )
      return [
        `${IX.mutateDontAssign ? '' : 'const '}${NEXT_SPEC.ident} = new Array(${PREV_SPEC.ident}.length);`,
        ...CHILDREN,
        ...ASSIGNMENTS
      ].join('\n')
    }
  }
}

function optionalWriteable(x: F.Z.Optional<Builder>, input: z.core.$ZodOptional): Builder {
  if (tagged('optional', input._zod.def.innerType)) {
    return x._zod.def.innerType
  } else {
    return function cloneOptional(PREV_SPEC, NEXT_SPEC, IX) {

      const NEXT_BINDING = IX.bindings.get(NEXT_SPEC.ident)
      const ACCESSOR = propertyAccessor(NEXT_SPEC.path, IX)
      if (IX.isProperty) {
        console.group('\n\nOPTIONAL\n\n')
        console.debug('NEXT_BINDING', NEXT_BINDING)
        console.debug('ACCESSOR', ACCESSOR)
        console.groupEnd()

        return [
          `let ${NEXT_SPEC.ident};`,
          `if (${PREV_SPEC.ident} !== undefined) {`,
          x._zod.def.innerType(PREV_SPEC, NEXT_SPEC, { ...IX, mutateDontAssign: true }),
          // ACCESSOR === null ? null : `${ACCESSOR} = ${NEXT_SPEC.ident}`,
          `${NEXT_BINDING} = ${NEXT_SPEC.ident}`,

          `}`,
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
            { ...IX, mutateDontAssign: false, isProperty: true },
          ),
          CHILD_ASSIGN,
        ].filter((_) => _ !== null).join('\n')
      }),
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
  if (x._zod.def.options.length === 1) return x._zod.def.options[0]
  return function cloneUnion(PREV_SPEC, NEXT_SPEC, IX) {
    const NEXT_IDENT = IX.bindings.get(NEXT_SPEC.ident) === undefined ? ident(NEXT_SPEC.ident, IX.bindings) : null
    const NEXT = NEXT_IDENT === null ? null : `let ${NEXT_SPEC.ident};`
    if (x._zod.def.options.length === 0) return `const ${NEXT_SPEC.ident} = undefined`
    else {
      return [
        NEXT,
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
      ].filter((_) => _ !== null).join('\n')
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

const interpret = F.fold<Builder>((x, ix, input) => {
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

// function optionalWriteable(x: F.Z.Optional<Builder>): Builder {
//   return function cloneOptional(PREV_SPEC, NEXT_SPEC, IX) {
//     const lead = NEXT_SPEC.path.slice(0, -1)
//     const leadIdent = createIdentifier(lead[0] + lead.slice(1).map((v) => accessor(v, false)).join(''))
//     const last = NEXT_SPEC.path[NEXT_SPEC.path.length - 1]
//     const LEAD = IX.bindings.get(joinPath(lead, false))
//     const NEXT_ACCESSOR = LEAD === undefined
//       ? `${leadIdent}${accessor(last, false)}`
//       : joinPath([`${LEAD}`, last], IX.isOptional)
//     const ASSIGN = lead.length === 0 ? null : NEXT_ACCESSOR === null
//       ? `${joinPath(NEXT_SPEC.path, IX.isOptional)} = ${NEXT_SPEC.ident};`
//       : `${NEXT_ACCESSOR} = ${NEXT_SPEC.ident};`
//     const NEXT = IX.bindings.get(NEXT_SPEC.ident) === undefined ? ident(NEXT_SPEC.ident, IX.bindings) : null

//     if (lead.length === 0) {
//       return [
//         NEXT === null ? null : `let ${NEXT_SPEC.ident};`,
//         `if (${PREV_SPEC.ident} !== undefined) {`,
//         x._zod.def.innerType(PREV_SPEC, NEXT_SPEC, { ...IX, mutateDontAssign: true }),
//         // x._zod.def.innerType(PREV_SPEC, NEXT === null ? NEXT_SPEC : { path: NEXT_SPEC.path, ident: NEXT }, { ...IX, mutateDontAssign: true }),
//         ASSIGN,
//         `}`,
//         ...IX.isProperty ? [] : [
//           `else {`,
//           `${NEXT_SPEC.ident} = undefined`,
//           `}`,
//         ]
//       ].filter((_) => _ !== null).join('\n')
//     } else {
//       return [
//         `if (${PREV_SPEC.ident} !== undefined) {`,
//         x._zod.def.innerType(PREV_SPEC, NEXT_SPEC, IX),
//         ASSIGN,
//         `}`,
//         ...IX.isProperty ? [] : [
//           `else {`,
//           `${NEXT_SPEC.ident} = undefined`,
//           `}`,
//         ]
//       ].filter((_) => _ !== null).join('\n')
//     }
//   }
// }