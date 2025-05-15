export const findPaths = (
  tree: unknown,
  predicate: (x: unknown) => boolean,
) => {
  let matches = Array.of<(string | number)[]>()
  function go(
    x: unknown,
    path: (string | number)[],
  ): void {
    switch (true) {
      default: throw Error('[Illegal state] \'findPaths\' encoutered a value it did not know how to handle, got:' + JSON.stringify(x))
      case predicate(x): return void matches.push(path)
      case x == null:
      case typeof x === 'boolean':
      case typeof x === 'symbol':
      case typeof x === 'bigint':
      case typeof x === 'number':
      case typeof x === 'string': return void 0
      case x instanceof Map: return void Array.from(x.entries()).forEach(([k, v]) => (go(k, path), go(v, path)))
      case x instanceof Set: return void Array.from(x.values()).forEach((v) => go(v, path))
      case Array.isArray(x): return void x.forEach((v, i) => go(v, [...path, i]))
      case !!x && typeof x === 'object': return void Object.entries(x).forEach(([k, v]) => go(v, path.concat(k)))
    }
  }
  return (go(tree as never, []), matches)
}
