
export function unsafeCompact<T extends {}>(xs: T): T
export function unsafeCompact<T extends {}>(xs: T) {
  for (const k in xs)
    if (xs[k] == null) delete xs[k]
  return xs
}

