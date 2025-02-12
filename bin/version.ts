import { execSync as $ } from "node:child_process"
import { Print } from "./util.js"

const log = () => Print(Print.task(`Versioning packages...`))

function version() {
  return (
    void $(`pnpm changeset version`),
    void $(`pnpm install --lockfile-only`),
    void $(`pnpm run build:pre`)
  )
}

const main = () => (
  void log(),
  void version()
)

void main()
