const RAISE_ISSUE_URL = "https://github.com/traversable/schema/issues" as const

export const PromiseSchemaIsUnsupported = (schemaName: string, functionName?: string) => {
  if (typeof functionName === 'string') {
    throw Error(''
      + '\r\n\n[@traversable/valibot]\r\n'
      + functionName
      + ' has not implemented '
      + `v.${schemaName}`
      + '. If you\'d like to see it supported, please file an issue: '
      + RAISE_ISSUE_URL
    )
  } else {
    throw Error(''
      + `v.${schemaName} has not been implemented. `
      + `If you think this might be a mistake, consider filing an issue: `
      + RAISE_ISSUE_URL
    )
  }
}
