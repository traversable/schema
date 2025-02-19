/**
 * ## {@link Scalar `Json.Scalar`}
 *
 * a.k.a "leaves" or "terminal nodes"
 *
 * Note: strictly speaking, `undefined` is not a valid JSON value. It's
 * included here because in practice `JSON.stringify(undefined)` returns
 * `undefined` instead of the empty string.
 */
export type Scalar = undefined | null | boolean | number | string;
export declare const isScalar: (x: unknown) => x is string | number | boolean | null | undefined;
/**
 * ## {@link Fixpoint `Json.Fixpoint`}
 *
 * The recursive definition of JSON.
 *
 * On the one hand, this definition is correct.
 *
 * On the other hand, it's also infinite. And since types
 * aren't tied to actual data, we don't have a type-level
 * "base case" we can fall back on.
 *
 * In fact, the only reason our IDE doesn't start
 * slogging is because TypeScript compiler does extra work
 * to "cache" this type, and detect the circular reference.
 *
 * While this type happens to work in this case, it's also brittle:
 * a small change in its definition could cause the TS compiler to
 * cache things differently, and we might wind up with a very
 * difference performance profile.
 *
 * If you'd prefer to avoid this problem (and others like it), use
 * {@link Unary `Unary`} instead.
 */
export type Fixpoint = Scalar | readonly Fixpoint[] | {
    [x: string]: Fixpoint;
};
export type Unary<T> = Scalar | readonly T[] | {
    [x: string]: T;
};
export declare const isArray: <T>(x: unknown) => x is readonly T[];
export declare const isObject: <T>(x: unknown) => x is {
    [x: string]: T;
};
export { Json };
type Nullary = undefined | null | boolean | number | string;
type Json = Nullary | readonly Json[] | {
    [x: string]: Json;
};
type F<T> = Nullary | readonly T[] | {
    [x: string]: T;
};
declare namespace Json {
    export { Nullary, F, Json as Fixpoint, };
}
declare namespace Json {
    function is(u: unknown): u is Json;
    namespace is {
        var scalar: (x: unknown) => x is string | number | boolean | null | undefined;
        var array: <T>(x: unknown) => x is readonly T[];
        var object: <T>(x: unknown) => x is {
            [x: string]: T;
        };
    }
    /** @internal */
}
//# sourceMappingURL=json.d.ts.map