import { RAISE_ISSUE_URL } from './version.js'

export const PromiseSchemaIsUnsupported = (schemaName: string, functionName?: string) => {
  if (typeof functionName === 'string') {
    throw Error(''
      + '\r\n\n[@traversable/zod]\r\n'
      + functionName
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
}

/**
 * TODO: Remove once [this issue](https://github.com/colinhacks/zod/pull/4359) is resolved
 */
export const removePrototypeMethods = (k: string) => !['__proto__', 'toString'].includes(k)
