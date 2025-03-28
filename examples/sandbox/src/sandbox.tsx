import { t } from './lib'
// to view the inferred type predicates demo, see './demo/inferredTypePredicates.ts'
import './demo/inferredTypePredicates'
// to view the '.toString' demo, check your browser console + see './demo/toString.ts'
import './demo/toString'
// to view the '.toJsonSchema' demo, check your browser console + see './demo/toJsonSchema.ts'
import './demo/toJsonSchema'
// to view the '.validate' demo, check your browser console + see './demo/validate.ts'
import './demo/validate'
// to view the '.pipe' and '.extend' demo, check your browser console + see './demo/codec.ts'
import './demo/codec'
// to see how to extend traversable schemas in userland, check your browser console + see './demo/userlandExtensions.ts'
import './demo/userlandExtensions'
// to see how traversable schemas support reflection + custom interpreters, run this example with 'pnpm dev'
import { HardcodedSchemaExamples, RandomlyGeneratedSchemas } from './demo/advanced'

window.t = t

export function Sandbox() {
  return <pre style={{ padding: '1rem', position: 'relative' }}>
    <HardcodedSchemaExamples />
    <RandomlyGeneratedSchemas howManyToGenerate={100} />
  </pre>
}
