import { z } from 'zod4'
import { Seed } from '@traversable/schema-seed'
import type { AnyTag } from './utils-v4.js'
import { Tag } from './utils-v4.js'

type Options = {
  rootSchemaType?: AnyTag | 'random'
  include?: AnyTag[]
}


const defaults = {
  rootSchemaType: 'random',
  include: Object.values(Tag),
} satisfies Required<Generator.Options>

declare namespace Generator { export { Options } }

function Generator(options?: Options) {}
