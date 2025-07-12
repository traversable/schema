function createIdentifier(x: string) {
  const out = x.replace(/[^$_a-zA-Z]/, '_').replaceAll(/[^$_a-zA-Z0-9]/g, '_')
  return out.length === 0 ? '_' : out
}

export function ident(x: string, set: Map<string, string>) {
  const original = x
  x = createIdentifier(x)
  let count = 1
  while (set.has(x))
    x = `${x.replace(/\d+$/, '')}${count++}`
  set.set(original, x)
  set.set(x, original)
  return x
}
