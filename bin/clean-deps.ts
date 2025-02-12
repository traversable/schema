#!/usr/bin/env pnpm dlx tsx
import { Print, rimraf } from "./util.js"
import { BUILD_DEPS, EMOJI, GRAPH } from "./constants.js"

const log = (): void => 
  Print(Print.task(`Cleaning project dependencies... ${EMOJI.WOW}`))

const cleanDeps = (): void => GRAPH.forEach(
  node => BUILD_DEPS
    .map(path => `${node}/${path}`)
    .forEach(rimraf),
)

const main = (): void => (
  void log(),
  void cleanDeps()
)

void main()
