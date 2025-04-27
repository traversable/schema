import { isValidIdentifier, parseKey } from '@traversable/registry'

export const defaultPath = ['value']

export const toPath = (xs: (keyof any)[]) => xs.filter((x) => typeof x !== 'symbol')

export const buildAccessor = (k: keyof any) => {
  switch (true) {
    default: return '' as const
    case typeof k === 'string': return isValidIdentifier(k) ? `.${k}` as const : `["${parseKey(k)}"]` as const
    case typeof k === 'number': return `[${k}]` as const
  }
}

export const accessor = (xs: (keyof any)[]) => xs.slice(1).reduce((acc: string, x) => acc += buildAccessor(x), String(xs[0]))
