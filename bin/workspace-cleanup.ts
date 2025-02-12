#!/usr/bin/env pnpm dlx tsx
import { Command, Prompt } from "@effect/cli"
import { NodeContext, NodeRuntime } from "@effect/platform-node"
import { Effect } from "effect"

import { PACKAGES } from "./constants.js"
import { main } from "./workspace.js"

const pkgToRm = Prompt.select({
  message: `Which package would you like to cleanup (remove)?`,
  choices: 
    [...PACKAGES]
      .sort()
      .map(pkg => pkg.slice("packages/".length))
      .map((pkg) => ({ title: pkg, value: pkg }))
})

const cleanup = Command.prompt(
  "Cleanup workspace", 
  Prompt.all([ pkgToRm ]),
  ([ pkgName ]) => 
    Effect.sync(() => main.cleanup({ pkgName })
))

const cli = Command.run(cleanup, {
  name: "Removes a previously generated workspace",
  version: "v0.0.1"
})

Effect.suspend(() => cli(globalThis.process.argv)).pipe(
  Effect.provide(NodeContext.layer),
  NodeRuntime.runMain
)
