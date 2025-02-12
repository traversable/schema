#!/usr/bin/env pnpm dlx tsx
import { Print, deriveShortView, topological } from "./util.js"

function describe(effect: (description: string) => void): void {
  const indent = `   `
  const ordered = topological()
  const shortTree = [
    Print.greenText(`++++++`),
    ``,
    `📈 `.concat(Print.greenText(Print.strong(`Dependency Graph`))),
    ``,
    `${indent}${Print.with.underline(`Short view`)}:` as const,
    Print.hush(`${indent}[topological order]`),
    deriveShortView(ordered),
    ``,
    ``,
  ]

  const expandedTree = [
    Print.greenText(`++++++`),
    ``,
    `📈 `.concat(Print.greenText(Print.strong(`Dependency Graph`))),
    ``,
    `${indent}${Print.with.underline(`Expanded view`)}:` as const,
    Print.hush(`${indent}[topological order]`),
    ``,
    Print.toString(ordered),
  ]

  const description = [
    Print.task(`Describing project...`),
    ...shortTree,
    ...expandedTree,
    ``,
  ].join("\n")

  return void effect(description)
}

const main = () => describe(globalThis.console.log)

void main()
