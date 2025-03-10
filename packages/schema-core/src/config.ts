import type {
  GlobalOptions,
  SchemaOptions,
} from './options.js'
import type { Primitive } from '@traversable/registry'
import { Equal } from '@traversable/registry'

declare namespace Required {
  type Atom = globalThis.Date | globalThis.RegExp | globalThis.Function
  type Deep<T, Atom = Required.Atom | Primitive> = [T] extends [Atom] ? T
    : { [K in keyof T]-?: Required.Deep<T[K], Atom> }
}

export interface SchemaConfig extends Required.Deep<SchemaOptions> { }

export interface GlobalConfig extends Required<{
  [K in keyof GlobalOptions]: NonNullable<Required<GlobalOptions[K]>>
}> { }

export const eqDefaults = {
  equalsFn: Equal.lax,
} satisfies SchemaOptions.Eq

export const defaults = {
  schema: {
    optionalTreatment: 'presentButUndefinedIsOK',
    treatArraysAsObjects: false,
    eq: eqDefaults,
  },
} as const satisfies GlobalConfig

/** @internal */
let __mutableConfig: GlobalConfig = {
  ...defaults,
}

export function getConfig(): GlobalConfig {
  return {
    schema: __mutableConfig.schema,
  }
}

export function applyOptions(options?: SchemaOptions): SchemaConfig {
  const equalsFn
    = options?.eq?.equalsFn
      || options?.optionalTreatment === 'treatUndefinedAndOptionalAsTheSame'
      ? Equal.lax
      : defaults.schema.eq.equalsFn
  return !options ? defaults.schema : {
    eq: { equalsFn },
    optionalTreatment: options.optionalTreatment ?? defaults.schema.optionalTreatment,
    treatArraysAsObjects: options.treatArraysAsObjects ?? defaults.schema.treatArraysAsObjects,
  }
}

export function configure(options?: GlobalOptions): GlobalConfig
export function configure($?: GlobalOptions) {
  $?.schema?.optionalTreatment !== undefined && void (__mutableConfig.schema.optionalTreatment = $?.schema?.optionalTreatment)
  $?.schema?.treatArraysAsObjects !== undefined && void (__mutableConfig.schema.treatArraysAsObjects = $.schema.treatArraysAsObjects)
  $?.schema?.eq?.equalsFn !== undefined && void (__mutableConfig.schema.eq.equalsFn = $.schema.eq.equalsFn)
  return getConfig()
}
