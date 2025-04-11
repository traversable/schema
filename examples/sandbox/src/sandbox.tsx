import { t } from './lib'
// to view the inferred type predicates demo, see './demo/inferredTypePredicates.ts'
import './demo/inferredTypePredicates'
// to view the '.toString' demo, see './demo/toString.ts' + check your browser console
import './demo/toString'
// to view the '.toJsonSchema' demo, see './demo/toJsonSchema.ts' + check your browser console
import './demo/toJsonSchema'
// to view the '.validate' demo, see './demo/validate.ts' + check your browser console
import './demo/validate'
// to view the '.pipe' and '.extend' demo, see './demo/codec.ts' + check your browser console
import './demo/codec'
// to see how to extend traversable schemas in userland, see './demo/userlandExtensions.ts' + check your browser console
import './demo/userlandExtensions'
// to see how traversable schemas support reflection + custom interpreters, run this example with 'pnpm dev'
import { HardcodedSchemaExamples, RandomlyGeneratedSchemas } from './demo/advanced'

window.t = t

export function Sandbox() {
  return <pre style={{ padding: '1rem', position: 'relative' }}>
    <HardcodedSchemaExamples />
    <RandomlyGeneratedSchemas howManyToGenerate={10} />
  </pre>
}
