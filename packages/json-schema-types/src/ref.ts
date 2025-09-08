const DASH = new RegExp('[-_]', 'g')
const DASH_BOUNDARY = new RegExp('([-_][a-z])', 'g')

function camelCase(x: string) {
  return x.replace(DASH_BOUNDARY, (c) => c.toUpperCase().replace(DASH, ''))
}

function pascalCase(x: string) {
  return (x[0] ?? '').toUpperCase() + camelCase(x.slice(1))
}

export function canonicalizeRefName(x: string) {
  return x === '#' || x === '' ? 'Root' : pascalCase(x.slice(x.lastIndexOf('/') + 1) ?? x).replace(/\W/g, '')
}
