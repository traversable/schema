import { execSync as $ } from "node:child_process"
import { Print } from "./util.js"

const log = (): void => Print(Print.task(`Publishing project...`))

const publish = (): void => void $(`pnpm changeset publish`)

const main = (): void => (
  void log(),
  void publish()
)

void main()
