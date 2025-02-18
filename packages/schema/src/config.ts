import type {
  GlobalOptions,
  SchemaOptions,
} from './options.js'

export interface SchemaConfig extends Required<SchemaOptions> { }

export interface GlobalConfig extends Required<{
  [K in keyof GlobalOptions]: NonNullable<Required<GlobalOptions[K]>>
}> { }

export const defaults = {
  schema: {
    optionalTreatment: 'presentButUndefinedIsOK',
    treatArraysAsObjects: false,
  }
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

export function configure(options?: GlobalOptions): GlobalConfig
export function configure($?: GlobalOptions) {
  const prev = getConfig()
  const config = {
    schema: !$?.schema ? prev.schema : {
      optionalTreatment: $?.schema.optionalTreatment ?? prev.schema.optionalTreatment,
      treatArraysAsObjects: $?.schema.treatArraysAsObjects ?? prev.schema.treatArraysAsObjects,
    }
  } satisfies GlobalConfig

  return config
}
