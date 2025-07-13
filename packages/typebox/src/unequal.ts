import * as T from '@sinclair/typebox'
import * as F from './functor.js'

/**
 * @example
 * 
 * T.Optional  -> symbol.invalid
 * T.Undefined -> symbol.invalid
 * T.String    -> x.concat(' ')
 * T.Number    -> x + 1
 * T.Boolean   -> !x
 * T.Null      -> undefined
 * T.Tuple    -> empty ? undefined : x
 * T.Array    -> empty ? undefined : x
 * T.Object   -> empty ? undefined : x
 * T.Record   -> empty ? undefined : x
 * 
 * T.Object({
 *   a: 
 * })
 * 
 */


