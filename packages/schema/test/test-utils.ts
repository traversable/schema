import { fc } from '@fast-check/vitest'

export const PATTERN = {
  alphanumeric: '^[a-zA-Z0-9]*$',
  ident: '^[$_a-zA-Z][$_a-zA-Z0-9]*$',
  exponential: 'e[-|+]?',
} as const satisfies Record<string, string>

export const REG_EXP = {
  alphanumeric: new RegExp(PATTERN.alphanumeric, 'u'),
  ident: new RegExp(PATTERN.ident, 'u'),
  exponential: new RegExp(PATTERN.exponential, 'u'),
} satisfies Record<string, RegExp>

export const LEAST_UPPER_BOUND = 0x100000000
export const GREATEST_LOWER_BOUND = 1e-8
export const floatConstraints = { noDefaultInfinity: true, min: -LEAST_UPPER_BOUND, max: +LEAST_UPPER_BOUND } satisfies fc.FloatConstraints

export const getExponential = (x: number) => Number.parseInt(String(x).split(REG_EXP.exponential)[1])

export const isBounded = (x: number) => x <= -GREATEST_LOWER_BOUND || +GREATEST_LOWER_BOUND <= x

export const toFixed = (x: number) => {
  const exponential = getExponential(x)
  return Number.isNaN(x) ? x : x.toFixed(exponential)
}

export const arbitrary = {
  alphanumeric: fc.stringMatching(REG_EXP.alphanumeric),
  ident: fc.stringMatching(REG_EXP.ident),
  int32toFixed: fc.float(floatConstraints).filter(isBounded).map(toFixed)
}

export const jsonValue = fc.letrec((go) => {
  return {
    null: fc.constant(null),
    boolean: fc.boolean(),
    number: arbitrary.int32toFixed,
    string: arbitrary.alphanumeric,
    array: fc.array(go('tree')) as fc.Arbitrary<fc.JsonValue[]>,
    object: fc.dictionary(arbitrary.ident, go('tree')) as fc.Arbitrary<Record<string, fc.JsonValue>>,
    tree: fc.oneof(
      go('null'),
      go('boolean'),
      go('number'),
      go('string'),
      go('array'),
      go('object'),
    ) as fc.Arbitrary<fc.JsonValue>,
  }
})

