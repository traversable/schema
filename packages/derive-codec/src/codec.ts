import type { t } from '@traversable/schema'

/** @internal */
interface Pipelines {
  from: ((_: any) => unknown)[]
  to: ((_: any) => unknown)[]
  $: unknown
}

export const Invariant = {
  DecodeError: (u: unknown) => globalThis.Error('DecodeError: could not decode invalid input, got: \n\r' + JSON.stringify(u, null, 2))
} as const

export interface Pipe<S, T, A, B> { unpipe(mapBack: (b: B) => T): Codec<S, B, A> }

export interface Extend<S, T, A, B> { unextend(mapBack: (s: S) => B): Codec<B, T, A> }

export class Codec<S, T, A> {
  static new
    : <S extends t.Schema>(schema: S) => S & { codec: Codec<S['_type'], S['_type'], S> }
    = (schema) => { const codec = new Codec(schema); Object.defineProperty(schema, 'codec', { value: codec, writable: true }); return schema as never }

  parse(u: S | {} | null | undefined): T | Error {
    if (typeof this.schema === 'function' && this.schema(u) === false)
      return Invariant.DecodeError(u)
    else return this.decode(u as S)
  }

  decode(source: S): T
  decode(source: S) {
    this._.$ = source
    for (let ix = 0, len = this._.to.length; ix < len; ix++) {
      const f = this._.to[ix]
      this._.$ = f(this._.$)
    }
    return this._.$
  }

  encode(target: T): S
  encode(target: T) {
    this._.$ = target
    for (let ix = this._.from.length; ix-- !== 0;) {
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

  private constructor(
    public schema: A,
    private _: Pipelines = { from: [], to: [], $: void 0 }
  ) { }
}

export interface pipe<T> {
  codec: {
    pipe<B>(map: (src: T['_type' & keyof T]) => B):
      Pipe<T['_type' & keyof T], T['_type' & keyof T], T, B>
    extend<B>(premap: (b: B) => T['_type' & keyof T]):
      Extend<T['_type' & keyof T], T['_type' & keyof T], T, B>
  }
}

export function pipe<S extends t.Schema>(schema: S): pipe<S> {
  return Codec.new(schema)
}
