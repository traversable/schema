export { dummyEquals as equals }
let dummyEquals = (..._: any) => { throw Error('Called dummy equals') }
interface dummyEquals<_ = any> { }
