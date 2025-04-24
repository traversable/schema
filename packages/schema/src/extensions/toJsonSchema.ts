export { dummyToJsonSchema as toJsonSchema }
let dummyToJsonSchema = (..._: any) => { throw Error('Called dummy toJsonSchema') }
interface dummyToJsonSchema<_ = any> { }
