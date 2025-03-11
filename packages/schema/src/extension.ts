import type { newtype } from './registry.js'
import type { SchemaOptions } from './options.js'

export const nullary = new globalThis.Map()
export const defaults = {}

export const Registry: Registry = {
  nullary,
  defaults,
}

export interface Registry {
  nullary: globalThis.Map<unknown, unknown>
  defaults: SchemaOptions
}

export interface extend<T extends Registry> extends newtype<T> { }
