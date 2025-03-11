import type { Equal } from './registry-types.js'
import type { eq } from './schema.js'
import type { defaults } from './config.js'

export type SchemaOptions = {
  optionalTreatment?: OptionalTreatment
  treatArraysAsObjects?: boolean
  eq?: SchemaOptions.Eq
}

export declare namespace SchemaOptions {
  interface Eq<T = any> {
    /** 
     * You can provide {@link eq `t.eq`} with a different "equalsFn"
     * to use both by default and on a schema-by-schema basis.
     * 
     * By default, {@link eq `t.eq`} uses {@link defaults.schema.eq.equalsFn `defaults.eq.equalsFn`}.
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

