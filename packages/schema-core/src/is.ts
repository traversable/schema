import { URI } from '@traversable/registry'

import type { Conform } from './types.js'
import { t } from './core.js'

export const is = {
  never: (u: unknown): u is t.Never => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.never,
  any: (u: unknown): u is t.Any => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.any,
  void: (u: unknown): u is t.Void => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.void,
  unknown: (u: unknown): u is t.Unknown => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.unknown,
  null: (u: unknown): u is t.Null => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.null,
  undefined: (u: unknown): u is t.Undefined => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.undefined,
  symbol: (u: unknown): u is t.Symbol => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.symbol,
  boolean: (u: unknown): u is t.Boolean => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.boolean,
  bigint: (u: unknown): u is t.BigInt => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.bigint,
  number: (u: unknown): u is t.Number => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.number,
  string: (u: unknown): u is t.String => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.string,
  eq: <S>(u: S): u is Conform<S, t.Eq<any>, t.Eq> => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.array,
  array: <S>(u: S): u is Conform<S, t.Array<any>, t.Array> => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.array,
  record: <S>(u: S): u is Conform<S, t.Record<any>, t.Record> => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.record,
  optional: <S>(u: S): u is Conform<S, t.Optional<any>, t.Optional> => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.optional,
  union: <S>(u: unknown): u is Conform<S, t.Union<any>, t.Union> => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.union,
  intersect: <S>(u: unknown): u is Conform<S, t.Intersect<any>, t.Intersect> => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.intersect,
  tuple: <S>(u: S): u is Conform<S, t.Tuple<any>, t.Tuple> => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.tuple,
  object: <S>(u: unknown): u is Conform<S, t.Object<any>, t.Object> => !!u && typeof u === 'object' && 'tag' in u && u.tag === URI.object,
} as const
