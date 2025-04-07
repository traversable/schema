import { t } from '@traversable/schema'

export function parse<S extends t.Schema>(this: S, u: unknown) {
  if (this(u)) return u
  else throw Error('invalid input')
}

export const prototype = { parse }
