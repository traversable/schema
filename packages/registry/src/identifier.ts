import { joinPath } from './parse.js'

export function createIdentifier(x: string): string {
  const out = x.replace(/[^$_a-zA-Z]/, '_').replaceAll(/[^$_a-zA-Z0-9]/g, '_')
  return out.length === 0 ? '_' : out
}

export function ident(x: string, bindings: Map<string, string>, dontBind?: 'dontBind'): string {
  const original = x
  x = createIdentifier(x)
  let count = 1
  while (bindings.has(x))
    x = `${x.replace(/\d+$/, '')}${count++}`
  if (dontBind === undefined) {
    bindings.set(original, x)
    bindings.set(x, original)
  }
  return x
}
