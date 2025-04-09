export let bindUserDefinitions = (schema: {}, userDefinitions: Record<string, unknown>) => {
  for (let k in userDefinitions) {
    userDefinitions[k] =
      typeof userDefinitions[k] === 'function'
        ? userDefinitions[k](schema)
        : userDefinitions[k]
  }
  return userDefinitions
}
