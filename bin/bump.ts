#!/usr/bin/env pnpm dlx tsx
import * as fs from "./fs.js"
import { Print, Transform } from "./util.js"
import { PACKAGES, PATH, RELATIVE_PATH } from "./constants.js"

const serialize = (packages: readonly string[]) => {
  return [
    `export const PACKAGES = [`,
    [...packages].map((pkg) => `\t"${pkg}"`).sort().join(",\n"),
    `] as const`,
    `export type PACKAGES = typeof PACKAGES`
  ].join("\n")
}

const writingMetadataLog = (s: string, t: string) => Print(
  `[bin/bump.ts] ${
    Print.strong(s.split(`/`)[1])
  } writing metadata to:\n\t\t📁 ${
    Print.with.underline(Print.hush(t))
  }`
)

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
}

/**
 * TODO:
 * - for each workspace, cache the most recent version number
 * - short-circuit if the version number hasn't changed since the previous run
 */
const main = bump

void main()
