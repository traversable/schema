import type { Unknown } from '@traversable/registry'
import type { t } from '@traversable/schema-core'

/** @internal */
interface Pipelines {
  from: ((_: any) => unknown)[]
  to: ((_: any) => unknown)[]
  $: unknown
}

export const Invariant = {
  DecodeError: (u: unknown) =>
    Error('DecodeError: could not decode invalid input, got: \n\r' + JSON.stringify(u, null, 2))
} as const

export interface Pipe<S, T, A, B> { unpipe(mapBack: (b: B) => T): Codec<S, B, A> }
export interface Extend<S, T, A, B> { unextend(mapBack: (s: S) => B): Codec<B, T, A> }

export interface BindCodec<T> {
  pipe<B>(map: (src: T['_type' & keyof T]) => B):
    Pipe<T['_type' & keyof T], T['_type' & keyof T], T, B>
  extend<B>(premap: (b: B) => T['_type' & keyof T]):
    Extend<T['_type' & keyof T], T['_type' & keyof T], T, B>
}

export let bindCodec = {
  pipe<S extends t.LowerBound, B>(this: S, mapfn: (src: S['_type']) => B) { return Codec.new(this).pipe(mapfn) },
  extend<S extends t.LowerBound, B>(this: S, mapfn: (src: S['_type']) => B) { return Codec.new(this).extend(mapfn) },
} satisfies BindCodec<never>

export class Codec<S, T, A> {
  static new
    : <S extends t.Schema>(schema: S) => Codec<S['_type'], S['_type'], S>
    = (schema) => new Codec(schema)

  parse(u: S | Unknown): T | Error {
    if (typeof this.schema === 'function' && this.schema(u) === false)
      return Invariant.DecodeError(u)
    else return this.decode(u as S)
  }

  decode(source: S): T
  decode(source: S) {
    this._.$ = source
    let len = this._.to.length
    for (let ix = 0; ix < len; ix++) {
      const f = this._.to[ix]
      this._.$ = f(this._.$)
    }
    return this._.$
  }

  encode(target: T): S
  encode(target: T) {
    this._.$ = target
    let len = this._.from.length
    for (let ix = len; ix-- !== 0;) {
      const f = this._.from[ix]
      this._.$ = f(this._.$)
    }
    return this._.$
  }

  extend<B>(premap: (b: B) => S): Extend<S, T, A, B> {
    return {
      unextend: (mapBack) => new Codec(
        this.schema, {
        to: [premap, ...this._.to],
        from: [mapBack, ...this._.from],
        $: void 0,
      })
    }
  }

  pipe<B>(map: (t: T) => B): Pipe<S, T, A, B> {
    return {
      unpipe: (unmap) => new Codec(
        this.schema, {
        to: [...this._.to, map],
        from: [...this._.from, unmap],
        $: void 0,
      })
    }
  }

  constructor(
    public schema: A,
    private _: Pipelines = { from: [], to: [], $: void 0 }
  ) { }
}
