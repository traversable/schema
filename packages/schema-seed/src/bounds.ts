import { fc } from '@fast-check/vitest'
import { fn, Math_max, Math_min, Object_is, unsafeCompact } from '@traversable/registry'

export interface InclusiveBounds<T = number> {
  minimum?: T
  maximum?: T
}

export interface ExclusiveBounds<T = number> {
  exclusiveMinimum?: T
  exclusiveMaximum?: T
}

export interface StringBounds extends InclusiveBounds {}
export interface ArrayBounds extends InclusiveBounds {}
export interface IntegerBounds extends InclusiveBounds {}
export interface NumberBounds extends InclusiveBounds, ExclusiveBounds {}
export interface BigIntBounds extends InclusiveBounds<bigint | number> {}

export const makeInclusiveBounds = <T>(model: fc.Arbitrary<T>) => ({ minimum: model, maximum: model })

const defaultDoubleConstraints = {
  noNaN: true,
  noDefaultInfinity: true,
} satisfies fc.DoubleConstraints

const defaultNumberBounds = {} satisfies NumberBounds

const constraintsTuple
  : (model: fc.Arbitrary<number | undefined>) => fc.Arbitrary<[number | undefined, number | undefined, boolean, boolean]>
  = (model) => fc.tuple(model, model, fc.boolean(), fc.boolean()).map(([left, right, minExcluded, maxExcluded]) => [
    typeof left === 'number' ? typeof right === 'number' ? Math_min(left, right) : left : undefined,
    typeof right === 'number' ? typeof left === 'number' ? Math_max(right, left) + 1 : right : undefined,
    minExcluded,
    maxExcluded,
  ] as const satisfies any[]).map(([min, max, minExcluded, maxExcluded]) => [
    min,
    ((minExcluded || maxExcluded) && typeof min === 'number' && typeof max === 'number' && min === max) ? max + 1 : max,
    minExcluded,
    maxExcluded
  ])

export const numberBounds
  : (model: fc.Arbitrary<number | undefined>) => fc.Arbitrary<NumberBounds>
  = (model) => constraintsTuple(model).map(fn.flow(
    ([minimum, maximum, minExcluded, maxExcluded]) =>
      minExcluded && maxExcluded ? {
        exclusiveMinimum: minimum,
        exclusiveMaximum: maximum,
      } : minExcluded ? {
        exclusiveMinimum: minimum,
        maximum,
      } : maxExcluded ? {
        minimum,
        exclusiveMaximum: maximum,
      } : {
        minimum,
        maximum,
      },
    unsafeCompact,
  ))

export const doubleConstraints
  : (model: fc.Arbitrary<number | undefined>) => fc.Arbitrary<fc.DoubleConstraints>
  = (model) => constraintsTuple(model).map(
    ([min, max, minExcluded, maxExcluded]) => (
      (minExcluded || maxExcluded)
      && typeof min === 'number'
      && typeof max === 'number'
      && min === max
    ) ? {
      ...defaultDoubleConstraints,
      min,
      max: max + 1,
      ...minExcluded && { minExcluded: minExcluded },
      ...maxExcluded && { maxExcluded: maxExcluded },
    } : {
      ...defaultDoubleConstraints,
      min,
      max,
      ...minExcluded && { minExcluded: minExcluded },
      ...maxExcluded && { maxExcluded: maxExcluded },
    }
  )

export const doubleConstraintsFromNumberBounds
  : (bounds?: NumberBounds) => fc.DoubleConstraints
  = ({
    exclusiveMaximum,
    exclusiveMinimum,
    maximum,
    minimum,
  } = defaultNumberBounds) => {
    const minExcluded = typeof exclusiveMinimum === 'number'
    const maxExcluded = typeof exclusiveMaximum === 'number'
    let min = minExcluded ? exclusiveMinimum : minimum
    let max = maxExcluded ? exclusiveMaximum : maximum
    if (minExcluded && Object_is(min, +0)) min = -0
    if (maxExcluded && Object_is(max, -0)) min = +0
    return (
      (minExcluded || maxExcluded)
      && typeof min === 'number'
      && typeof max === 'number'
      && min === max
    ) ? {
      min,
      max: max + 1,
      minExcluded,
      maxExcluded,
    } : {
      min,
      max,
      minExcluded,
      maxExcluded,
    }
  }
