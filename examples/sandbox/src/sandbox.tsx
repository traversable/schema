import { t } from './lib'
import { HardcodedSchemaExamples, RandomlyGeneratedSchemas } from './demo/advanced'

window.t = t

export function Sandbox() {
  return <pre style={{ padding: '1rem', position: 'relative' }}>
    <HardcodedSchemaExamples />
    <RandomlyGeneratedSchemas howManyToGenerate={100} />
  </pre>
}
