#!/usr/bin/env pnpm dlx tsx
import { Print, rimraf } from "./util.js"
import { BUILD_ARTIFACTS, BUILD_DEPS, GRAPH } from "./constants.js"

const log = (): void => 
  Print(Print.task(`Cleaning build artifacts and project dependencies...`))

const clean = (): void => 
  GRAPH.forEach(
    node => [...BUILD_ARTIFACTS, ...BUILD_DEPS]
      .map(path => `${node}/${path}`)
      .forEach(rimraf),
  )

const main = (): void => (
  void log(),
  void clean()
)

void main()
