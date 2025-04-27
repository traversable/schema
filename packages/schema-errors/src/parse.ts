import type { Unknown } from '@traversable/registry'
import { t } from '@traversable/schema'

import type { Options } from './options.js'
import { defaults } from './options.js'
import { getValidator } from './fold.js'

export function unsafeParse<S extends t.Schema>(schema: S, options?: Options): (got: S['_type'] | Unknown) => S['_type']
export function unsafeParse<S extends t.Schema>(schema: S, options: Options = defaults) {
  return (got: S['_type'] | Unknown): S['_type'] => {
    if (schema(got)) return got
    else throw getValidator(got, options)
  }
}
