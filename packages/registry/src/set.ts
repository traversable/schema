import type { Equal } from './types.js'

export interface ValueSet<T> {
  [Symbol.iterator](): ValueSet.Iterator<T>
  /** 
   * ### {@link add `ValueSet.add`}
   *
   * Appends a new element with a specified value to the end of the {@link ValueSet `ValueSet`}
   * if the value is not already a member.
   * 
   * Set membership is determined by {@link equalsFn `ValueSet.equalsFn`}
   */
  add(value: T): ValueSet<T>
  /** 
   * ### {@link clear `ValueSet.clear`}
   * 
   * Clears all the values from the {@link ValueSet `ValueSet`}.
   */
  clear(): void
  /**
   * ### {@link delete `ValueSet.delete`}
   * 
   * Removes a specified value from the {@link ValueSet `ValueSet`}.
   * 
   * Returns true if an element in the {@link ValueSet `ValueSet`} existed and has been removed, 
   * or false if the element does not exist.
   */
  delete(value: T): boolean
  /** 
   * ### {@link entries `ValueSet.entries`}
   *
   * Returns an iterable of `[v, v]` pairs for every value `v` 
   * in the {@link ValueSet `ValueSet`}.
   */
  entries(): ValueSet.Iterator<[T, T]>
  /** 
   * ### {@link equalsFn `ValueSet.equalsFn`}
   *
   * Retrieves the {@link Equal `equals function`} that was provided when
   * the {@link ValueSet `ValueSet`} was constructed.
   * 
   * This is the function that {@link ValueSet `ValueSet`} uses to determine
   * whether a value is a member of the set it contains.
   */
  equalsFn: Equal<T>
  /**
   * ### {@link forEach `ValueSet.forEach`}
   * 
   * Executes a provided function once per each value in the {@link ValueSet `ValueSet`}, 
   * in insertion order.
   */
  forEach(callback: (value: T, set: ValueSet<T>) => void, thisArg?: any): void
  /** 
   * ### {@link has `ValueSet.has`}
   *
   * Returns boolean indicating whether an element with the specified value 
   * exists in the {@link ValueSet `ValueSet`} or not, as determined by 
   * {@link equalsFn `ValueSet.equalsFn`}.
   */
  has(value: T): boolean
  /** 
   * ### {@link keys `ValueSet.keys`}
   * 
   * Despite its name, returns an iterable of the values in the {@link ValueSet `ValueSet`}.
   */
  keys(): ValueSet.Iterator<T>
  /** 
   * ### {@link values `ValueSet.values`}
   * 
   * Returns an iterable of values in the {@link ValueSet `ValueSet`}.
   */
  values(): ValueSet.Iterator<T>
}

export declare namespace ValueSet {
  interface Constructor {
    new: <T>(equalsFn: Equal<T>) => ValueSet<T>
  }
  interface Iterator<T> extends globalThis.SetIterator<T> { }
}

export class ValueSet<T> implements ValueSet<T> {
  [Symbol.iterator] = this.values;
  private _data = Array.of<T>();
  private constructor(public equalsFn: Equal<T>) { }
  static new
    : <T>(equalsFn: Equal<T>) => ValueSet<T>
    = (equalsFn) => new ValueSet(equalsFn);
  add(value: T): this {
    let data = this._data
    if (data.find((v) => v === value || this.equalsFn(v, value))) {
      return this
    } else {
      data.push(value)
      return this
    }
  }
  clear(): void {
    return void (this._data = Array.of<T>())
  }
  delete(value: T): boolean {
    let data = this._data
    let ix = data.findIndex((v) => v === value || this.equalsFn(v, value))
    if (ix === -1) return false
    else {
      data.splice(ix, 1)
      return true
    }
  }

  entries(): ValueSet.Iterator<[T, T]> {
    let data = this._data
    let size = this.size
    return {
      *[Symbol.iterator](): globalThis.Generator<[T, T], undefined, never> {
        let ix = 0
        while (ix < size) {
          let d = data[ix++]
          yield [d, d] satisfies [any, any]
        }
      },
      next() {
        let ix = 0
        if (ix < size) {
          let d = data[ix++]
          return { value: [d, d] satisfies [any, any], done: false }
        }
        else
          return { value: void 0, done: true }
      }
    }
  }

  forEach(callback: (v: T, self: this) => void): void {
    return [...this.values()].forEach((v) => callback(v, this))
  }

  has(value: T): boolean {
    return this._data.find((v) => this.equalsFn(v, value)) !== undefined
  }

  keys(): ValueSet.Iterator<T> {
    let data = this._data
    let size = this.size
    return {
      *[Symbol.iterator](): globalThis.Generator<T, undefined, never> {
        let ix = 0
        while (ix < size) {
          yield data[ix++]
        }
      },
      next() {
        let ix = 0
        if (ix < size) {
          return { value: data[ix++], done: false }
        }
        else
          return { value: void 0, done: true }
      }
    }
  }

  values(): ValueSet.Iterator<T> {
    let data = this._data
    let size = this.size
    return {
      *[Symbol.iterator](): globalThis.Generator<T, undefined, never> {
        let ix = 0
        while (ix < size) {
          yield data[ix++]
        }
      },
      next() {
        let ix = 0
        if (ix < size) {
          return { value: data[ix++], done: false }
        }
        else
          return { value: void 0, done: true }
      }
    }
  }
  /** 
   * ### {@link size `ValueSet.size`}
   * Returns the number of (unique) elements in the {@link ValueSet `ValueSet`}
   */
  get size(): number { return this._data.length }
}
