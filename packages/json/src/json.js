// import type * as T from '../../schema/src/types.js'
// import * as fn from '../../schema/src/function.js'
// import { parseKey } from '../../schema/src/parse.js'
export const isScalar = (x) => x == null
    || typeof x === 'boolean'
    || typeof x === 'number'
    || typeof x === 'string';
export const isArray = (x) => globalThis.Array.isArray(x);
export const isObject = (x) => !!x && typeof x === 'object' && !isArray(x);
export { Json };
/** @internal */
const Object_entries = globalThis.Object.entries;
/** @internal */
const JSON_stringify = globalThis.JSON.stringify;
/** @internal */
const Object_values = globalThis.Object.values;
// export const Functor: T.Functor<Json.Free, Json.Fixpoint> = {
//   map(f) {
//     return (x) => {
//       switch (true) {
//         default: return fn.exhaustive(x)
//         case is.scalar(x): return x
//         case is.array(x): return fn.map(x, f)
//         case is.object(x): return fn.map(x, f)
//       }
//     }
//   }
// }
var Json;
(function (Json) {
    is.scalar = isScalar;
    is.array = isArray;
    is.object = isObject;
    function is(u) {
        return isScalar(u)
            || (isArray(u) && u.every(Json.is))
            || (isObject(u) && Object_values(u).every(Json.is));
    }
    Json.is = is;
    // export const fold = fn.cata(Json.Functor)
    // export const unfold = fn.ana(Json.Functor)
    /** @internal */
    // const toString_ = fold(Recursive.toString)
    // export const toString = (x: unknown) => !Json.is(x) ? JSON_stringify(x, null, 2) : toString_(x)
})(Json || (Json = {}));
//# sourceMappingURL=json.js.map