import type { Param } from '@traversable/registry'
import { t } from './schema.js'

export function clone<S extends t.AnySchema>(schema: S): S
export function clone<S extends t.AnySchema>(schema: S) {
  function cloned(u: Param<typeof schema>) { return schema(u) }
  for (const k in schema) (cloned as typeof schema)[k] = schema[k]
  return cloned
}

export function extend<Ext>(): <S extends t.AnySchema>(schema: S, extension: Partial<Ext>) => Ext
export function extend<Ext>() {
  return <S extends t.AnySchema>(schema: S, extension: Ext) => {
    function cloned(u: Param<typeof schema>) { return schema(u) }
    for (const k in schema) (cloned as S)[k] = schema[k]
    for (const k in extension) (cloned as Ext)[k] = extension[k]
    return cloned
  }
}