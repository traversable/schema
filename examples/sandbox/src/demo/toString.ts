import { expectTypeOf } from 'expect-type'

import { t } from '../lib'

/**
 * DEMO: toString()
 */
let ex_01 = t.object({
  abc: t.number,
  def: t.object({
    ghi: t.array(t.integer)
  })
})

let stringified = ex_01.toString()
//  ^?

expectTypeOf<
  | "{ 'abc': number, 'def': { 'ghi': (number)[] } }"
  | "{ 'def': { 'ghi': (number)[] }, 'abc': number }"
>(stringified)

console.group('=====================\n\r  DEMO: .toString()\n=====================\n\r')
console.debug('stringified:', stringified)
console.assert(stringified === "{ 'abc': number, 'def': { 'ghi': (number)[] } }" as string)
console.groupEnd()
