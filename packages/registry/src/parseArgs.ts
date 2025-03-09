/** 
 * TODO: Currently this is hardcoded to avoid creating a dependency on 
 * schema-core. Figure out a better way to handle this. 
 */

type Options = {
  optionalTreatment?: unknown
  treatArraysAsObjects?: unknown
}

export function parseArgs<
  F extends readonly unknown[],
  Fallbacks extends Required<Options>,
>(
  fallbacks: Fallbacks,
  args: readonly [...F] | readonly [...F, Options]
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
  if (last && typeof last === 'object' && ('optionalTreatment' in last || 'treatArraysAsObjects' in last)) return [args.slice(0, -1), last]
  else return [args, last === undefined ? fallbacks : { ...fallbacks, ...last }]
}
