import { intersection, templateLiteral, z } from 'zod'
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

export type Builder = (prev: string[], next: string[], ix: Scope) => string

export interface Scope extends F.CompilerIndex {
  identifiers: Map<string, string>
  useGlobalThis: clone.Options['useGlobalThis']
}

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

const defaultWriteable = {
  [TypeName.any]: function cloneAny([VAR]) { return VAR },
  [TypeName.unknown]: function cloneUnknown([VAR]) { return VAR },
  [TypeName.never]: function cloneNever([VAR]) { return VAR },
  [TypeName.void]: function cloneVoid([VAR]) { return VAR },
  [TypeName.undefined]: function cloneUndefined([VAR]) { return VAR },
  [TypeName.null]: function cloneNull([VAR]) { return VAR },
  [TypeName.nan]: function cloneNaN([VAR]) { return VAR },
  [TypeName.boolean]: function cloneBoolean([VAR]) { return VAR },
  [TypeName.symbol]: function cloneSymbol([VAR]) { return VAR },
  [TypeName.int]: function cloneInt([VAR]) { return VAR },
  [TypeName.bigint]: function cloneBigInt([VAR]) { return VAR },
  [TypeName.number]: function cloneNumber([VAR]) { return VAR },
  [TypeName.string]: function cloneString([VAR]) { return VAR },
  [TypeName.literal]: function cloneLiteral([VAR]) { return VAR },
  [TypeName.template_literal]: function cloneTemplateLiteral([VAR]) { return VAR },
  [TypeName.date]: function cloneDate([VAR]) { return VAR },
  [TypeName.file]: function cloneFile([VAR]) { return VAR },
  [TypeName.enum]: function cloneEnum([VAR]) { return VAR },
} satisfies Record<string, Builder>

const interpret = F.fold<Builder>((x, ix, input) => {
  switch (true) {
    default: return (void (x satisfies never), () => '')
    case tagged('enum')(x):
    case F.isNullary(x): return defaultWriteable[x._zod.def.type]
    case tagged('lazy')(x): return x._zod.def.getter()
    case tagged('pipe')(x): return x._zod.def.out
    case tagged('readonly')(x): return x._zod.def.innerType
    case tagged('array')(x): return arrayWriteable(x)
    case tagged('optional')(x): return optionalWriteable(x)
    case tagged('nullable')(x): return nullableWriteable(x)
    case tagged('nonoptional')(x): return nonOptionalWriteable(x)
    case tagged('set')(x): return setWriteable(x)
    case tagged('map')(x): return mapWriteable(x)
    case tagged('record')(x): return recordWriteable(x)
    case tagged('union')(x): return unionWriteable(x)
    case tagged('intersection')(x): return intersectionWriteable(x)
    case tagged('tuple')(x): return tupleWriteable(x)
    case tagged('object')(x): return objectWriteable(x, input as z.core.$ZodObject)
    case isUnsupported(x): return import('./utils.js').then(({ Invariant }) =>
      Invariant.Unimplemented(x._zod.def.type, 'zx.equals')) as never
  }
})

function optionalWriteable(x: F.Z.Optional<Builder>): Builder {
  return function cloneOptional(PATH) {
    /**
     * @example
     * function clone(x) {}
     */
    return [].join('\n')
  }
}

function nonOptionalWriteable(x: F.Z.NonOptional<Builder>): Builder {
  return function cloneNonOptional(PATH) {
    /**
     * @example
     * function clone(x) {}
     */
    return [].join('\n')
  }
}


function nullableWriteable(x: F.Z.Nullable<Builder>): Builder {
  return function cloneNullable(PATH) {
    /**
     * @example
     * function clone(x) {}
     */
    return [].join('\n')
  }
}


function recordWriteable(
  x: F.Z.Record<Builder>
): Builder {
  return function cloneRecord(PREV_PATH, NEXT_PATH, IX) {
    const PREV = joinPath(PREV_PATH, IX.isOptional)
    const NEXT = joinPath(NEXT_PATH, IX.isOptional)
    /**
     * @example
     * function clone(x: AddressRecord): AddressRecord {
     *   const out: AddressRecord = Object.create(null)
     *   for (let key in x) {
     *     const value = x[key]
     *     const newValue = Object.create(null)
     *     newValue.street1 = value.street1
     *     if (value.street2 !== undefined) newValue.street2 = value.street2
     *     newValue.city = value.city
     *     out[key] = newValue
     *   }
     *   return out
     * }
     */
    return [].join('\n')
  }
}

function setWriteable(
  x: F.Z.Set<Builder>
): Builder {
  return function cloneSet(PREV_PATH, NEXT_PATH, IX) {
    const PREV = joinPath(PREV_PATH, IX.isOptional)
    const NEXT = joinPath(NEXT_PATH, IX.isOptional)
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

function mapWriteable(
  x: F.Z.Map<Builder>
): Builder {
  return function cloneMap(PREV_PATH, NEXT_PATH, IX) {
    const PREV = joinPath(PREV_PATH, IX.isOptional)
    const NEXT = joinPath(NEXT_PATH, IX.isOptional)
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

function intersectionWriteable(
  x: F.Z.Intersection<Builder>
): Builder {
  return function cloneIntersection(PREV_PATH, NEXT_PATH, IX) {
    const PREV = joinPath(PREV_PATH, IX.isOptional)
    const NEXT = joinPath(NEXT_PATH, IX.isOptional)
    /**
     * @example
     * function clone(x: AddressIntersection) {
     *   const out: AddressIntersection = Object.create(null)
     *   out.street1 = x.street1
     *   if (x.street2 !== undefined) out.street2 = x.street2
     *   out.city = x.city
     *   if (x.postalCode !== undefined) out.postalCode = x.postalCode
     *   return out
     * }
     */
    return [].join('\n')
  }
}

function unionWriteable(
  x: F.Z.Union<Builder>
): Builder {
  return function cloneUnion(PREV_PATH, NEXT_PATH, IX) {
    const PREV = joinPath(PREV_PATH, IX.isOptional)
    const NEXT = joinPath(NEXT_PATH, IX.isOptional)
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

function tupleWriteable(
  x: F.Z.Tuple<Builder>
): Builder {
  return function cloneTuple(PREV_PATH, NEXT_PATH, IX) {
    const PREV = joinPath(PREV_PATH, IX.isOptional)
    const NEXT = joinPath(NEXT_PATH, IX.isOptional)
    /**
     * @example
     * function clone([$1, $2]: AddressTuple) {
     *   const out: Address[] = []
     *   const _1: Address = Object.create(null)
     *   _1.street1 = $1.street1
     *   if ($1.street2 !== undefined) _1.street2 = $1.street2
     *   _1.city = $1.city
     *   out.push(_1)
     *   const _2: Address = Object.create(null)
     *   _2.street1 = $2.street1
     *   if ($2.street2 !== undefined) _2.street2 = $2.street2
     *   _2.city = $2.city
     *   out.push(_2)
     *   return out as AddressTuple
     * }
     */
    return [].join('\n')
  }
}

function arrayWriteable(
  x: F.Z.Array<Builder>
): Builder {
  return function cloneArray(PREV_PATH, NEXT_PATH, IX) {
    const PREV = joinPath(PREV_PATH, IX.isOptional)
    const NEXT = joinPath(NEXT_PATH, IX.isOptional)
    // const PREV_IDENT = ident(PREV, IX.identifiers)
    const NEXT_IDENT = ident(NEXT, IX.identifiers)
    const PREV_ITEM = ident(`${PREV}_item`, IX.identifiers)
    const NEXT_ITEM = ident(`${NEXT}_item`, IX.identifiers)
    const PREV_INDEX = `${PREV}[ix]`

    // const 
    const OUT = ident('out', IX.identifiers)
    // const PREV = `${VAR}[ix];`
    const LENGTH = ident('length', IX.identifiers)
    /**
     * @example
     * function clone(prev: Addresses): Addresses {
     *   const length = prev.length
     *   const next = new Array(length)
     *   for (let ix = length; ix-- !== 0) {
     *     const prev_item = prev[ix]
     *     const next_item = Object.create(null)
     *     next_item.street1 = prev_item.street1
     *     if (prev_item.street2 !== undefined) next_item.street2 = prev_item.street2
     *     next_item.city = prev_item.city
     *     next[ix] = next_item
     *   }
     *   return out
     * }
     */
    return [
      `const ${LENGTH} = ${PREV}.length;`,
      `const ${NEXT_IDENT} = new Array(${LENGTH});`,
      `for (let ix = ${LENGTH}; ix-- !== 0;) {`,
      `const ${PREV_ITEM} = ${PREV_INDEX};`,
      x._zod.def.element([PREV_ITEM], [NEXT_ITEM], IX),
      `${NEXT_IDENT}[ix] = ${NEXT_ITEM}`,
      `}`,
    ].join('\n')
  }
}

function objectWriteable(
  x: F.Z.Object<Builder>,
  input: z.core.$ZodObject
): Builder {
  return function cloneObject(PREV_PATH, NEXT_PATH, IX) {
    const PREV = joinPath(PREV_PATH, IX.isOptional)
    const NEXT = joinPath(NEXT_PATH, IX.isOptional)
    const PREV_IDENT = ident(PREV, IX.identifiers)
    const NEXT_IDENT = ident(NEXT, IX.identifiers)

    console.log({
      PREV,
      NEXT,
      PREV_IDENT,
      NEXT_IDENT,
    })

    return [
      `const ${NEXT_IDENT} = Object.create(null);`,
      PREV_PATH.length === 1 && PREV_PATH[0] === 'prev' ? null : `const ${PREV_IDENT} = ${PREV};`,
      ...Object.entries(x._zod.def.shape).map(([key, continuation]) => {
        const valueSchema = input._zod.def.shape[key]
        const PREV_ACCESSOR = joinPath([PREV_IDENT, key], IX.isOptional)
        const NEXT_ACCESSOR = joinPath([NEXT_IDENT, key], IX.isOptional)
        if (tagged('optional', valueSchema)) {
          if (F.isNullary(valueSchema._zod.def.innerType)) {
            return [
              `if (${PREV_ACCESSOR} !== undefined) ${NEXT_ACCESSOR} = ${PREV_ACCESSOR};`
            ].join('\n')
          } else {
            return [
              continuation([PREV_IDENT, key], [NEXT_IDENT, key], IX),
            ].join('\n')
          }
        }

        else if (F.isNullary(valueSchema)) {
          return [
            `${NEXT_ACCESSOR} = ${PREV_ACCESSOR};`
          ].join('\n')
        }

        else {
          // **Note:** here we call the continuation BEFORE assigning CHILD_IDENT so 
          // that IX.identifiers has record of the child's identifier, 
          // and the lookup succeeds 🎉
          const BODY = continuation([PREV_IDENT, key], [NEXT_IDENT, key], IX)
          const CHILD_IDENT = IX.identifiers.get(NEXT_ACCESSOR)
          return [
            BODY,
            `${NEXT_ACCESSOR} = ${CHILD_IDENT};`,
          ].join('\n')
        }
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
  const index = { useGlobalThis: false, ...F.defaultIndex, identifiers: new Map() }
  const BODY = interpret(type as F.Z.Hole<Builder>)(['prev'], ['next'], index)
  return globalThis.Function('prev', [
    BODY,
    `return next`
  ].join('\n'))
}

clone.writeable = writeableClone

function writeableClone<T extends z.core.$ZodType>(type: T, options?: clone.Options): string
function writeableClone<T extends z.core.$ZodType>(type: T, options?: clone.Options) {
  const index = { useGlobalThis: options?.useGlobalThis, ...F.defaultIndex, identifiers: new Map() }
  const compiled = interpret(type as F.Z.Hole<Builder>)(['prev'], ['next'], index)
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
