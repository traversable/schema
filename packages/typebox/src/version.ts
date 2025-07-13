import pkg from './__generated__/__manifest__.js'
export const VERSION = `${pkg.name}@${pkg.version}` as const
export type VERSION = typeof VERSION

export type RAISE_ISSUE_URL = typeof RAISE_ISSUE_URL
export const RAISE_ISSUE_URL = `${pkg.bugs.url}` as const
