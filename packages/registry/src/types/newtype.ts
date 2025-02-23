import type { symbol } from '../uri.js'

export type inline<T> = never | T

/** @ts-expect-error hush */
export interface newtype<T extends {} = {}> extends inline<T> { }

export interface TypeError<Msg extends string = string>
  extends newtype<{ [K in Msg]: symbol.type_error }> { }

export declare namespace TypeError {
  interface Unary<Msg extends string = string, T = {}>
    extends newtype<{ [K in Msg]: symbol.type_error } & T> { }
}
