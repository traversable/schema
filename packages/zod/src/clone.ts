import { z } from 'zod'
import type { Target } from '@traversable/registry'
import {
  ident,
  joinPath,
  Object_is,
  Object_hasOwn,
  Object_keys,
  stringifyKey,
  intersectKeys,
} from '@traversable/registry'

import * as F from './functor.js'
import { check } from './check.js'
import { toType } from './to-type.js'
import { AnyTypeName, hasTypeName, tagged, TypeName } from './typename.js'

type PathSpec = {
  path: (string | number)[]
  ident: string
}

export type Builder = (prev: PathSpec, next: PathSpec, ix: Scope) => string

export interface Scope extends F.CompilerIndex {
  bindings: Map<string, string>
  useGlobalThis: clone.Options['useGlobalThis']
  isRoot: boolean
}

const defaultIndex = () => ({
  ...F.defaultIndex,
  useGlobalThis: false,
  bindings: new Map(),
  isRoot: true
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

const areAllObjects = (xs: readonly unknown[]) => xs.every((x) => tagged('object', x))

const defaultWriteable = {
  [TypeName.any]: function cloneAny(PREV_SPEC, NEXT_SPEC, IX) {
    return `const ${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
  },
  [TypeName.unknown]: function cloneUnknown(PREV_SPEC, NEXT_SPEC, IX) {
    return `const ${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
  },
  [TypeName.never]: function cloneNever(PREV_SPEC, NEXT_SPEC, IX) {
    return `const ${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
  },
  [TypeName.void]: function cloneVoid(PREV_SPEC, NEXT_SPEC, IX) {
    return `const ${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
  },
  [TypeName.undefined]: function cloneUndefined(PREV_SPEC, NEXT_SPEC, IX) {
    return `const ${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
  },
  [TypeName.null]: function cloneNull(PREV_SPEC, NEXT_SPEC, IX) {
    return `const ${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
  },
  [TypeName.nan]: function cloneNaN(PREV_SPEC, NEXT_SPEC, IX) {
    return `const ${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
  },
  [TypeName.boolean]: function cloneBoolean(PREV_SPEC, NEXT_SPEC, IX) {
    return `const ${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
  },
  [TypeName.symbol]: function cloneSymbol(PREV_SPEC, NEXT_SPEC, IX) {
    return `const ${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
  },
  [TypeName.int]: function cloneInt(PREV_SPEC, NEXT_SPEC, IX) {
    return `const ${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
  },
  [TypeName.bigint]: function cloneBigInt(PREV_SPEC, NEXT_SPEC, IX) {
    return `const ${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
  },
  [TypeName.number]: function cloneNumber(PREV_SPEC, NEXT_SPEC, IX) {
    return `const ${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
  },
  [TypeName.string]: function cloneString(PREV_SPEC, NEXT_SPEC, IX) {
    return `const ${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
  },
  [TypeName.literal]: function cloneLiteral(PREV_SPEC, NEXT_SPEC, IX) {
    return `const ${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
  },
  [TypeName.template_literal]: function cloneTemplateLiteral(PREV_SPEC, NEXT_SPEC, IX) {
    return `const ${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
  },
  [TypeName.date]: function cloneDate(PREV_SPEC, NEXT_SPEC, IX) {
    return `const ${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
  },
  [TypeName.file]: function cloneFile(PREV_SPEC, NEXT_SPEC, IX) {
    return `const ${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
  },
  [TypeName.enum]: function cloneEnum(PREV_SPEC, NEXT_SPEC, IX) {
    return `const ${NEXT_SPEC.ident} = ${PREV_SPEC.ident}`
  },
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
    case tagged('union')(x): return unionWriteable(x)
    case tagged('intersection')(x): return intersectionWriteable(x)
    case tagged('tuple')(x): return tupleWriteable(x)
    case tagged('object')(x): return objectWriteable(x)
    case isUnsupported(x): return import('./utils.js').then(({ Invariant }) =>
      Invariant.Unimplemented(x._zod.def.type, 'zx.clone')) as never
  }
})

function optionalWriteable(x: F.Z.Optional<Builder>): Builder {
  return function cloneOptional(PREV_SPEC, NEXT_SPEC, IX) {
    return [
      `if (${PREV_SPEC.ident} !== undefined) {`,
      x._zod.def.innerType(PREV_SPEC, NEXT_SPEC, IX),
      `}`,
    ].join('\n')
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

function unionWriteable(x: F.Z.Union<Builder>): Builder {
  return function cloneUnion(PREV_SPEC, NEXT_SPEC, IX) {
    const PREV = joinPath(PREV_SPEC.path, IX.isOptional)
    const NEXT = joinPath(NEXT_SPEC.path, IX.isOptional)
    /**
     * @example
     * function clone(x: AddressUnion) {
     *   if (typeof x === 'number') {
     *     return x
     *   }
     *   const out = Object.create(null)
     *   out.street1 = x.street1
     *   if (x.street2 !== undefined) out.street2 = x.street2
     *   out.city = x.city
     *   return out
     * }
     */
    return [].join('\n')
  }
}

function arrayWriteable(x: F.Z.Array<Builder>): Builder {
  return function cloneArray(PREV_SPEC, NEXT_SPEC, IX) {
    const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, 'item'], IX.isOptional)
    const PREV_CHILD_ACCESSOR = joinPath([PREV_SPEC.ident, 'item'], IX.isOptional)
    const PREV_CHILD_IDENT = ident(PREV_CHILD_ACCESSOR, IX.bindings)
    const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings)
    const LENGTH = ident('length', IX.bindings)
    const INDEX = ident('ix', IX.bindings)
    return [
      `const ${LENGTH} = ${PREV_SPEC.ident}.length;`,
      `const ${NEXT_SPEC.ident} = new Array(${LENGTH});`,
      `for (let ${INDEX} = ${LENGTH}; ${INDEX}-- !== 0; ) {`,
      `const ${PREV_CHILD_IDENT} = ${PREV_SPEC.ident}[${INDEX}]`,
      x._zod.def.element(
        { path: [...PREV_SPEC.path, 'item'], ident: PREV_CHILD_IDENT },
        { path: [...NEXT_SPEC.path, 'item'], ident: NEXT_CHILD_IDENT },
        IX
      ),
      `${NEXT_SPEC.ident}[${INDEX}] = ${NEXT_CHILD_IDENT}`,
      `}`,
    ].filter((_) => _ !== null).join('\n')
  }
}

function recordWriteable(x: F.Z.Record<Builder>): Builder {
  return function cloneRecord(PREV_SPEC, NEXT_SPEC, IX) {
    const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, 'value'], IX.isOptional)
    const PREV_CHILD_ACCESSOR = joinPath([PREV_SPEC.ident, 'value'], IX.isOptional)
    const PREV_CHILD_IDENT = ident(PREV_CHILD_ACCESSOR, IX.bindings)
    const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings)
    const KEY = ident('key', IX.bindings)
    return [
      `const ${NEXT_SPEC.ident} = Object.create(null);`,
      `for (let ${KEY} in ${PREV_SPEC.ident}) {`,
      `const ${PREV_CHILD_IDENT} = ${PREV_SPEC.ident}[${KEY}]`,
      x._zod.def.valueType(
        { path: [...PREV_SPEC.path, 'item'], ident: PREV_CHILD_IDENT },
        { path: [...NEXT_SPEC.path, 'item'], ident: NEXT_CHILD_IDENT },
        IX
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
            IX
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
    const LEFT = x._zod.def.left(PREV_SPEC, NEXT_SPEC, IX)
    const RIGHT = x._zod.def.right(PREV_SPEC, NEXT_SPEC, IX)
    const PATTERN = `const ${NEXT_SPEC.ident} = Object.create(null);\n`
    if (LEFT.startsWith(PATTERN) && RIGHT.startsWith(PATTERN)) {
      return [LEFT, RIGHT.slice(PATTERN.length)].join('\n')
    } else {
      return [LEFT, RIGHT].join('\n')
    }
  }
}

function objectWriteable(x: F.Z.Object<Builder>): Builder {
  return function cloneObject(PREV_SPEC, NEXT_SPEC, IX) {
    return [
      `const ${NEXT_SPEC.ident} = Object.create(null);`,
      ...Object.entries(x._zod.def.shape).map(([key, continuation]) => {
        const PREV_PATH_ACCESSOR = joinPath([PREV_SPEC.ident, key], IX.isOptional)
        const NEXT_CHILD_ACCESSOR = joinPath([NEXT_SPEC.ident, key], IX.isOptional)
        const PREV_CHILD_IDENT = ident(PREV_PATH_ACCESSOR, IX.bindings)
        const NEXT_CHILD_IDENT = ident(NEXT_CHILD_ACCESSOR, IX.bindings)
        return [
          `const ${PREV_CHILD_IDENT} = ${joinPath([PREV_SPEC.ident, key], IX.isOptional)};`,
          continuation(
            { path: [...PREV_SPEC.path, key], ident: PREV_CHILD_IDENT },
            { path: [...NEXT_SPEC.path, key], ident: NEXT_CHILD_IDENT },
            IX
          ),
          `${NEXT_CHILD_ACCESSOR} = ${NEXT_CHILD_IDENT}`,
        ].join('\n')
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
