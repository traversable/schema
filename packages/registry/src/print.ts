export interface Options {
  indent?: number
  separator?: string
}

export const defaults = {
  indent: 0,
  separator: "",
} as const satisfies Required<Options>

export const pad = ({ indent = defaults.indent }: Options) => " ".repeat(indent)
export const tab = ({ indent = defaults.indent }: Options) => " ".repeat(indent + 2)
export const newline = ({ indent = defaults.indent }: Options, count = 0) => "\n" + " ".repeat(indent + (2 * (count + 1)))

export function lines($?: Options):
  <L extends string, const Body extends string[], R extends string>(left: L, ...body: [...Body, R])
    => `${L}${string}${R}`
export function lines($: Options = defaults) {
  return (...args: [string, ...string[], string]) => {
    const [left, body, right] = [args.at(0), args.slice(1, -1), args.at(-1)]
    return ""
      + left
      + [body.map((_) => newline($) + _).join(",")].join("," + newline($, -1))
      + newline($, -1)
      + right
  }
}

