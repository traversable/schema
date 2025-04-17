
/** @internal */
let Array_isArray = globalThis.Array.isArray

/** @internal */
let Object_keys = globalThis.Object.keys

export function map<S, T>(src: S, mapfn: (x: S[keyof S], k: string, xs: S) => T): { [x: string]: T }
export function map<S, T>(src: Record<string, S>, mapfn: (x: S, k: string, xs: Record<string, S>) => T) {
  if (Array_isArray(src)) return src.map(mapfn as never)
  const keys = Object_keys(src)
  let out: { [x: string]: T } = {}
  for (let ix = 0, len = keys.length; ix < len; ix++) {
    const k = keys[ix]
    out[k] = mapfn(src[k], k, src)
  }
  return out
}

