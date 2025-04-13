export { dummyValidate as validate }
let dummyValidate = (..._: any) => { throw Error('Called dummy validate') }
interface dummyValidate<_ = any> { }
