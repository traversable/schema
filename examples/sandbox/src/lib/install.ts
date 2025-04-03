import { t } from '@traversable/schema'

const parsePrototype = {
  parse: function parse<S extends t.Schema>(this: S, u: unknown) {
    if (this(u)) return u
    else throw Error('invalid input')
  }
}

export function bind() {
  Object.assign(t.never, parsePrototype)
  Object.assign(t.unknown, parsePrototype)
  Object.assign(t.void, parsePrototype)
  Object.assign(t.null, parsePrototype)
  Object.assign(t.undefined, parsePrototype)
  Object.assign(t.boolean, parsePrototype)
  Object.assign(t.symbol, parsePrototype)
  Object.assign(t.integer, parsePrototype)
  Object.assign(t.bigint, parsePrototype)
  Object.assign(t.number, parsePrototype)
  Object.assign(t.string, parsePrototype)
  Object.assign(t.eq.prototype, parsePrototype)
  Object.assign(t.optional.prototype, parsePrototype)
  Object.assign(t.array.prototype, parsePrototype)
  Object.assign(t.record.prototype, parsePrototype)
  Object.assign(t.union.prototype, parsePrototype)
  Object.assign(t.intersect.prototype, parsePrototype)
  Object.assign(t.tuple.prototype, parsePrototype)
  Object.assign(t.object.prototype, parsePrototype)
  Object.assign(t.enum.prototype, parsePrototype)
}
