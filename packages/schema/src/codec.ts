import type { LowerBound, Schema } from './core.js'

/** @internal */
interface Internal {
  from: ((_: any) => unknown)[]
  to: ((_: any) => unknown)[]
  $: unknown
}

export interface Pipe<S, T, A, B> { unpipe(mapBack: (b: B) => T): Codec<S, B, A> }

export interface Extend<S, T, A, B> { unextend(mapBack: (s: S) => B): Codec<B, T, A> }

export class Codec<S, T, A> {
  static new
    : <S extends Schema<LowerBound>>(schema: S) => Codec<S['_type'], S['_type'], S>
    = (schema) => new Codec(schema)

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
    private _: Internal = { from: [], to: [], $: void 0 }
  ) { }
}

export interface pipe<T> {
  pipe<B>(map: (src: T['_type' & keyof T]) => B):
    Pipe<T['_type' & keyof T], T['_type' & keyof T], T, B>
  extend<B>(premap: (b: B) => T['_type' & keyof T]):
    Extend<T['_type' & keyof T], T['_type' & keyof T], T, B>
}

export function pipe<S extends Schema>(schema: S): pipe<S> {
  return Codec.new(schema)
}

