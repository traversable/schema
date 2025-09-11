import * as T from 'typebox'
import { fn, parseKey } from '@traversable/registry'
import { Json } from '@traversable/json'

export function fromJson(json: Json, initialIndex?: Json.Functor.Index): T.TSchema
export function fromJson(json: Json, initialIndex = Json.defaultIndex): T.TSchema {
  return Json.foldWithIndex<T.TSchema>((x, ix) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x == null: return T.Null()
      case x === true:
      case x === false:
      case typeof x === 'number':
      case typeof x === 'string': return T.Literal(x)
      case Json.isArray(x): return T.Tuple([...x])
      case Json.isObject(x): return T.Object(Object.fromEntries(Object.entries(x).map(([k, v]) => [parseKey(k), v])))
    }
  })(json, initialIndex)
}
