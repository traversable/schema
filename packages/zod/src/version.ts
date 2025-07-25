import pkgJson from './__generated__/__manifest__.js'
import zodPkgJson from 'zod/package.json' with { type: 'json' }

export const VERSION = `${pkgJson.name}@${pkgJson.version}` as const
export type VERSION = typeof VERSION

export type RAISE_ISSUE_URL = typeof RAISE_ISSUE_URL
export const RAISE_ISSUE_URL = `${pkgJson.bugs.url}` as const

export type ZOD_CHANGELOG = typeof ZOD_CHANGELOG
export const ZOD_CHANGELOG = 'https://v4.zod.dev/v4/changelog'

export const ZOD_VERSION = zodPkgJson.version
