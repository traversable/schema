import type { Force } from '@traversable/registry'
import type { SchemaOptions } from './options.js'

export type parseArgs<F extends readonly unknown[], Fallbacks, Options>
  = F extends readonly [...infer Lead, infer Last]
  ? Last extends { [K in keyof Fallbacks | keyof Options]+?: unknown }
  ? [Lead, Force<Omit<Fallbacks, keyof Last> & { [K in keyof Last]-?: Last[K] }>]
  : [F, Fallbacks]
  : never
  ;

export function parseArgs<
  F extends readonly [...((_: any) => boolean)[]],
  Fallbacks extends Required<SchemaOptions>,
>(
  fallbacks: Fallbacks,
  args: readonly [...F] | readonly [...F, SchemaOptions]
): [[...F], Fallbacks]

export function parseArgs<
  F extends readonly unknown[],
  Fallbacks extends { [x: string]: unknown },
  Options extends { [x: string]: unknown }
>(
  fallbacks: Fallbacks,
  args: readonly [...F] | readonly [...F, $: Options]
) {
  const last = args.at(-1)
  if (typeof last === 'function') return [args, fallbacks]
  else return [args.slice(0, -1), last === undefined ? fallbacks : { ...fallbacks, ...last }]
}
