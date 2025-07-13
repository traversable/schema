import { invalid_value } from './symbol.js'

export const mutateRandomValueOf = <S, T>(before: Record<string, S>, x: T = invalid_value as never): Record<string, S> => {
  const xs = Object.entries(before)
  if (xs.length === 0) return x as never
  else {
    const index = getRandomIndexOf(xs)
    const [key] = xs[index]
    void xs.splice(index, 1, [key, x as never])
    const after = Object.fromEntries(xs)
    return after
  }
}

export const getRandomIndexOf = <T>(xs: T[]) => Math.floor((Math.random() * 100) % Math.max(xs.length, 1))
export const getRandomElementOf = <T>(xs: T[]) => xs[getRandomIndexOf(xs)]

export const mutateRandomElementOf = <S, T>(xs: S[], x: T = invalid_value as never): S[] => {
  if (xs.length === 0) return x as never
  else {
    const index = getRandomIndexOf(xs)
    xs.splice(index, 1, x as never)
    return xs
  }
}
