#!/usr/bin/env pnpm dlx tsx
import * as fs from "./fs.js"
import { Print, Transform, INTEGRATIONS_VERSIONS, LIB_VERSIONS } from './util.js'
import { PACKAGES, PATH, REG_EXP, RELATIVE_PATH } from "./constants.js"

const serialize = (packages: readonly string[]) => {
  return [
    `export const PACKAGES = [`,
    [...packages].map((pkg) => `  "${pkg}"`).sort().join(",\n"),
    `] as const`,
    `export type PACKAGES = typeof PACKAGES`
  ].join("\n")
}

const writingMetadataLog = (s: string, t: string) => Print(
  `[bin/bump.ts] ${Print.strong(s.split(`/`)[1])
  } writing metadata to:\n\t\t📁 ${Print.with.underline(Print.hush(t))
  }`
)

function copyPackageVersionToRootReadme() {
  const INTEGRATIONS = INTEGRATIONS_VERSIONS()
  const LIBS = LIB_VERSIONS()
  const newReadme = fs.readFileSync(PATH.readme).toString('utf8').replaceAll(
    REG_EXP.PackageNameWithSemver, (x1, x2) => {
      const [, pkgNameWithVersion] = x1.split('/')
      const [pkgName] = pkgNameWithVersion.split('@')
      const [, integrationVersion] = INTEGRATIONS.find(([libName]) => libName === pkgName) || []
      const [, libVersion] = LIBS.find(([libName]) => libName === pkgName) || []
      const VERSION = integrationVersion || libVersion
      if (VERSION === undefined) throw Error('Expected every package to have a version')
      return `@traversable/${pkgName}@${VERSION}`
    }
  )
  void fs.writeFileSync(PATH.readme, newReadme)
}


function bump(): void {
  void Print.task(`[bin/bump.ts] Writing workspace metadata...`)
  void Print.task(`[bin/bump.ts] Writing changelogs to '${PATH.generated_package_list}'`)
  void fs.mkdir(PATH.generated)
  void fs.writeFileSync(PATH.generated_package_list, serialize(PACKAGES))
  void PACKAGES
    .sort()
    .map((pkg): [string, string] => [
      `${pkg}/${RELATIVE_PATH.package_json}`,
      `${pkg}/${RELATIVE_PATH.generated_package_json}`
    ])
    .map(([s, t]): [string, string] => (writingMetadataLog(s, t), [s, t]))
    .map((xs) => Transform.toMetadata(xs))
  void copyPackageVersionToRootReadme()
}

/**
 * TODO:
 * - for each workspace, cache the most recent version number
 * - short-circuit if the version number hasn't changed since the previous run
 */
const main = bump

void main()
