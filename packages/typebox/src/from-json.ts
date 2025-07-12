import * as typebox from '@sinclair/typebox'
import { fn, parseKey } from '@traversable/registry'
import { Json } from '@traversable/json'

export function fromJson(json: Json, initialIndex?: Json.Functor.Index): typebox.TAnySchema
export function fromJson(
  json: Json,
  initialIndex = Json.defaultIndex
): typebox.TAnySchema {
  return Json.foldWithIndex<typebox.TAnySchema>((x, ix) => {
    switch (true) {
      default: return fn.exhaustive(x)
      case x == null: return typebox.Null()
      case x === true:
      case x === false:
      case typeof x === 'number':
      case typeof x === 'string': return typebox.Literal(x)
      case Json.isArray(x): return typebox.Tuple([...x])
      case Json.isObject(x): return typebox.Object(Object.fromEntries(Object.entries(x).map(([k, v]) => [parseKey(k), v])))
    }
  })(json, initialIndex)
}
