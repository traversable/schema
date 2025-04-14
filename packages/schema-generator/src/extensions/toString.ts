export { dummyToString as toString }
let dummyToString = (..._: any) => { throw Error('Called dummy toString') }
interface dummyToString<_ = any> { }
