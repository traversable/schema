import { tuple } from './__generated__/tuple.gen.js'
import { string } from './__generated__/string.gen.js'
import { number } from './__generated__/number.gen.js'
import { object } from './__generated__/object.gen.js'
import { intersect } from './__generated__/intersect.gen.js'
import { union } from './__generated__/union.gen.js'

let xs = intersect(string).toJsonSchema()
let ys = tuple(string).toJsonSchema()
let zs = object({ a: number }).toJsonSchema()
let as = object({ a: string }).toJsonSchema()
let bs = union(string).toJsonSchema()
