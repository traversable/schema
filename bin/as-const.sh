#!/usr/bin/env bash

##
# Usage:
#
#                 [path-to-json-file] [identifier (optional)]
# $ ./as-const.sh  my-json-file.json   MyDocument

if [[ -z "$2" ]]; then
  echo -E "type anon = typeof anon" > $1.ts
  echo -E "const anon = $(cat $1) as const" >> $1.ts
  echo -E "export default anon" >> $1.ts
  echo $'\n Generated:\n ∟ ' $1.ts
  echo ""
fi

if [[ -n "$2" ]]; then
  echo -E "export type $2 = typeof $2;" > $1.ts
  echo -E "export const $2 = $(cat $1) as const;" >> $1.ts
  echo $'\n Generated:\n ∟ ' $1.ts
  echo ""
fi
