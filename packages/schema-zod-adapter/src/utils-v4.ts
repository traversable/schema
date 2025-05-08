import { z } from 'zod4'
import { has } from '@traversable/registry'

import { RAISE_ISSUE_URL, VERSION } from './version.js'
import type { Z } from './functor-v4.js'

export type Options = {
  initialIndex?: (string | number)[]
  namespaceAlias?: string
}

export interface Config extends Required<Options> {}

export interface Ctx { input: unknown, error: z.ZodError }
export const ctx = { input: null, error: new z.ZodError([]) } satisfies Ctx

export type AnyTag = z.ZodType['_zod']['def']['type']
export type Tag = { [K in Exclude<AnyTag, 'interface'>]: K }
export const Tag = {
  any: 'any',
  array: 'array',
  bigint: 'bigint',
  boolean: 'boolean',
  catch: 'catch',
  custom: 'custom',
  date: 'date',
  default: 'default',
  enum: 'enum',
  file: 'file',
  int: 'int',
  intersection: 'intersection',
  lazy: 'lazy',
  literal: 'literal',
  map: 'map',
  nan: 'nan',
  never: 'never',
  nonoptional: 'nonoptional',
  null: 'null',
  nullable: 'nullable',
  number: 'number',
  object: 'object',
  optional: 'optional',
  pipe: 'pipe',
  promise: 'promise',
  readonly: 'readonly',
  record: 'record',
  set: 'set',
  string: 'string',
  success: 'success',
  symbol: 'symbol',
  template_literal: 'template_literal',
  transform: 'transform',
  tuple: 'tuple',
  undefined: 'undefined',
  union: 'union',
  unknown: 'unknown',
  void: 'void',
} satisfies Tag

export const tagged
  : <K extends keyof Tag>(tag: K) => <S>(u: unknown) => u is Z.lookup<K, S>
  = (tag) => has('_zod', 'def', 'type', (x): x is never => x === tag) as never

export const defaults = {
  initialIndex: Array.of<string | number>(),
  namespaceAlias: 'z',
} satisfies Config

export const ZOD_CHANGELOG = 'https://v4.zod.dev/v4/changelog'

export const Invariant = {
  Unimplemented: (schemaName: string, functionName?: string) => {
    if (typeof functionName === 'string') {
      throw Error(''
        + '\r\n\n[@traversable/schema-zod-adapter]\r\n'
        + `v4.${functionName}`
        + ' has not implemented '
        + `z.${schemaName}`
        + '. If you\'d like to see it supported, please file an issue: '
        + RAISE_ISSUE_URL
      )
    } else {
      throw Error(''
        + `z.${schemaName} has not been implemented. `
        + `If you think this might be a mistake, consider filing an issue: `
        + RAISE_ISSUE_URL
      )
    }
  },
}

export const Warn = {
  Deprecated: <T>(
    output: T,
    schemaName: string,
    functionName: string,
    logger: (...xs: unknown[]) => void = console.warn
  ): T => (
    logger(''
      + '\r\n\n'
      + '    WARNING:'
      + '\r\n\n'
      + `    z.${schemaName} has been deprecated in zod@4, and will`
      + '\r\n'
      + `    not continue to be supported by v4.${functionName}. `
      + '\r\n'
      + `    For migration instructions, please visit: `
      + '\r\n'
      + `    ${ZOD_CHANGELOG}.`
      + '\r\n\n'
      + `    [${VERSION}]`
      + '\r\n'
    ),
    output
  ),
}
