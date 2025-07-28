export const Invariant = {
  IllegalState(functionName: string, expected: string, got: unknown): never {
    throw Error(`Illegal state (ark.${functionName}): ${expected}, got: ${JSON.stringify(got, null, 2)}`)
  }
}
