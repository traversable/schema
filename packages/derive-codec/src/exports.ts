export { VERSION } from './version.js'
export type {
  Extend,
  Pipe,
} from './codec.js'
export {
  Codec,
  pipe,
} from './codec.js'

import type { t } from '@traversable/schema'
import { bindPipes } from './bind.js'
import type { pipe } from './codec.js'

// SIDE-EFFECT
void bindPipes()

declare module '@traversable/schema' {
  interface NeverSchema extends pipe<t.never> { }
  interface UnknownSchema extends pipe<t.unknown> { }
  interface VoidSchema extends pipe<t.void> { }
  interface AnySchema extends pipe<t.any> { }
  interface NullSchema extends pipe<t.null> { }
  interface UndefinedSchema extends pipe<t.undefined> { }
  interface SymbolSchema extends pipe<t.symbol> { }
  interface BooleanSchema extends pipe<t.boolean> { }
  interface IntegerSchema extends pipe<t.integer> { }
  interface BigIntSchema extends pipe<t.bigint> { }
  interface NumberSchema extends pipe<t.number> { }
  interface StringSchema extends pipe<t.string> { }
  interface EqSchema<V> extends pipe<t.eq<V>> { }
  interface OptionalSchema<S> extends pipe<t.optional<S>> { }
  interface ArraySchema<S> extends pipe<t.array<S>> { }
  interface RecordSchema<S> extends pipe<t.record<S>> { }
  interface UnionSchema<S> extends pipe<t.union<S>> { }
  interface IntersectSchema<S> extends pipe<t.intersect<S>> { }
  interface TupleSchema<S> extends pipe<t.tuple<S>> { }
  interface ObjectSchema<S> extends pipe<t.object<S>> { }
}
