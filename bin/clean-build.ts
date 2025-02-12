#!/usr/bin/env pnpm dlx tsx
import { Print, rimraf } from "./util.js"
import { BUILD_ARTIFACTS, EMOJI, GRAPH } from "./constants.js"
import { flow } from "effect/Function"

const log = (): void => 
  void Print(Print.task(`Cleaning build artifacts... ${EMOJI.WELL}`))

const cleanBuild = (): void =>
  void GRAPH.forEach(node => BUILD_ARTIFACTS.forEach(flow(path => `${node}/${path}`, rimraf)))

const main = (): void => (
  void log(),
  void cleanBuild()
)

void main()
