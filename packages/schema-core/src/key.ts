import { number } from './schemas/number.js'
import { string } from './schemas/string.js'
import { symbol } from './schemas/symbol.js'
import { union } from './schemas/union.js'

export const key = union(string, number, symbol)
