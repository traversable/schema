import { t } from './schema.js'
import type { Functor as functor } from './types.js'
import { cata, exhaustive } from './function.js'
import { URI } from './uri.js'
import { key as parseKey } from './parse.js'

namespace Recursive {
  export type Skeleton = { tag: t.Fixpoint['tag'], def: t.Fixpoint['def'] }
  export const skeleton
    : functor.Algebra<t.Free, Skeleton>
    = (x) => ({ tag: x.tag, def: x.def })

}
