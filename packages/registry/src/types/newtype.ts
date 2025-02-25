import type { symbol } from '../uri.js'

export type inline<T> = never | T

/** @ts-expect-error hush */
export interface newtype<T extends {} = {}> extends inline<T> { }

interface msg<T extends string> extends newtype<symbol> { }

export interface TypeError<Msg extends string = string>
  extends newtype<{ [K in msg<Msg> & keyof any | symbol.type_error]: symbol.type_error | Msg }> { }

export declare namespace TypeError {
  interface Unary<Msg extends string = string, T = {}>
    extends newtype<{ [K in msg<Msg> & keyof any | symbol.type_error]: symbol.type_error } & T> { }
}
