import pkgJson from './__generated__/__manifest__.js'
export const VERSION = `${pkgJson.name}@${pkgJson.version}` as const
export type VERSION = typeof VERSION

export type RAISE_ISSUE_URL = typeof RAISE_ISSUE_URL
export const RAISE_ISSUE_URL = `${pkgJson.bugs.url}` as const
