#!/usr/bin/env pnpm dlx tsx
import * as path from "node:path"
import * as fs from "node:fs"
import { execSync as $ } from "node:child_process"

const PATH = {
  RegistryWeightData: {
    source: path.join(path.resolve(), "packages", "registry", "src", "__generated__", "node-weight-by-type.json"),
    target:  path.join(path.resolve(), "packages", "registry", "src", "tmp", "node-weight-by-type.json"),
  },
} as const

const main = () => {
  const rm = (): void => fs.rmSync(PATH.RegistryWeightData.target, { force: true, recursive: true })
  const cp = (): void => fs.linkSync(PATH.RegistryWeightData.source, PATH.RegistryWeightData.target)
  const trap = (): void => { $("./bin/post-test.sh") }

  void rm()
  void cp()
  void trap()
}


main()
