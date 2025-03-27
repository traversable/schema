import type { Equal } from './types.js'
import type { defaults } from './config.js'

export type SchemaOptions<T = any> = {
  optionalTreatment?: OptionalTreatment
  treatArraysAsObjects?: boolean
  eq?: SchemaOptions.Eq<T>
}

export declare namespace SchemaOptions {
  interface Eq<T = any> {
    /** 
     * You can provide `t.eq` with a different "equalsFn"
     * to use both by default and on a schema-by-schema basis.
     * 
     * By default, `t.eq` uses {@link defaults.schema.eq.equalsFn `defaults.eq.equalsFn`}.
     */
    equalsFn?: Equal<T>
  }
}

export type OptionalTreatment = never
  | 'exactOptional'
  | 'presentButUndefinedIsOK'
  | 'treatUndefinedAndOptionalAsTheSame'

export type GlobalOptions = {
  schema?: SchemaOptions
}


