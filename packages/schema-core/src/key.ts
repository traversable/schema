import { number } from './number.js'
import { string } from './string.js'
import { symbol } from './symbol.js'
import { union } from './union.js'

export const key = union(string, number, symbol)
