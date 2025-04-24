export function bindUserExtensions<T>(schema: T, userDefinitions: Record<string, unknown>): T & { _type: any }
export function bindUserExtensions<T>(schema: T, userDefinitions: Record<string, unknown>) {
  for (let k in userDefinitions) {
    userDefinitions[k] =
      typeof userDefinitions[k] === 'function'
        ? userDefinitions[k](schema)
        : userDefinitions[k]
  }
  return userDefinitions
}
