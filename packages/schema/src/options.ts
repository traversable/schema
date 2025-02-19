export type SchemaOptions = {
  optionalTreatment?: OptionalTreatment
  treatArraysAsObjects?: boolean
}

export type OptionalTreatment = never
  | 'exactOptional'
  | 'presentButUndefinedIsOK'
  | 'treatUndefinedAndOptionalAsTheSame'

export type GlobalOptions = {
  schema?: SchemaOptions
}
