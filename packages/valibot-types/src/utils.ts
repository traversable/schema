import type { V, AnyValibotSchema, ValibotLookup } from './functor.js'
import { has } from '@traversable/registry'
import { Tag } from './typename.js'

export type Tagged = {
  shape: Record<string, AnyValibotSchema>
  tag: string | number | bigint | boolean | null | undefined
}

export type Discriminated = [
  discriminant: string | number,
  tagged: Tagged[]
]

export const Invariant = {
  CircularSchemaDetected: (schemaName: string, functionName?: string) => {
    if (typeof functionName === 'string') {
      throw Error(
        '\r\n\n[@traversable/valibot]\r\n'
        + `Circular schema detected while executing ${functionName}. Problem schema: ${schemaName}. `
        + 'If the schema is not circular, you may have encountered a bug. Please consider filing an issue: '
        + 'https://github.com/traversable/schema/issues'
      )
    } else {
      throw Error(''
        + '\r\n\n[@traversable/valibot]\r\n'
        + `Circular schema detected. Problem schema: ${schemaName}. `
        + 'If the schema is not circular, you may have encountered a bug. Please consider filing an issue: '
        + 'https://github.com/traversable/schema/issues'
      )
    }
  },
  Unimplemented: (schemaName: string, functionName?: string) => {
    if (typeof functionName === 'string') {
      throw Error(''
        + '\r\n\n[@traversable/valibot]\r\n'
        + functionName
        + ' has not implemented '
        + `v.${schemaName}`
        + '. If you\'d like to see it supported, please file an issue: '
        + 'https://github.com/traversable/schema/issues'
      )
    } else {
      throw Error(''
        + `v.${schemaName} has not been implemented. `
        + `If you think this might be a mistake, consider filing an issue: `
        + 'https://github.com/traversable/schema/issues'
      )
    }
  },
  IllegalState(functionName: string, expected: string, got: unknown): never {
    throw Error(`Illegal state (zx.${functionName}): ${expected}, got: ${JSON.stringify(got, null, 2)}`)
  }
}


export function hasTag<K extends keyof Tag>(tag: K) {
  return (u: unknown) => has('type', (type): type is unknown => type === Tag[tag])(u)
    || has('type', (type): type is unknown => type === tag)(u)
}

export function hasType(x: unknown) {
  return has('type')(x)
}

export function tagged<K extends keyof Tag>(tag: K): <S>(u: unknown) => u is V.lookup<K, S>
export function tagged<K extends keyof Tag, S>(tag: K, u: unknown): u is ValibotLookup<K>
export function tagged<K extends keyof Tag>(tag: K, u?: unknown) {
  return u === undefined ? hasTag(tag) : hasTag(tag)(u)
}

export function areAllObjects(xs: readonly unknown[]) {
  return xs.every((x) => tagged('object', x))
}

export const nullaryTags = [
  'any',
  'bigint',
  'boolean',
  'blob',
  'boolean',
  'custom',
  'date',
  'enum',
  'file',
  'function',
  'instance',
  'literal',
  'nan',
  'never',
  'null',
  'number',
  'picklist',
  'promise',
  'string',
  'symbol',
  'undefined',
  'unknown',
  'void',
] as const satisfies V.Nullary['type'][]

export function isNullary(x: unknown): x is V.Nullary
export function isNullary(x: unknown) {
  return has('type', (type): type is unknown => nullaryTags.includes(type as never))(x)
}

export function isOptionalDeep(x: unknown): boolean {
  switch (true) {
    default: return false
    case tagged('optional', x): return true
    case tagged('exactOptional', x): return true
    case tagged('nullish', x): return true
    // case tagged('nonOptional', x): return false
    // case tagged('undefinedable', x): return isOptionalDeep(x.wrapped)
    // case tagged('nullable', x): return isOptionalDeep(x.wrapped)
    // case tagged('nonNullable', x): return isOptionalDeep(x.wrapped)
    // case tagged('nonNullish', x): return isOptionalDeep(x.wrapped)
    // case tagged('lazy', x): return isOptionalDeep(x.getter(undefined))
    // case tagged('union', x): return x.options.some(isOptionalDeep)
  }
}
