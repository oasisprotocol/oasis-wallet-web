import { removeNullAndUndefinedValues } from '../objectUtils'

describe('removeNullAndUndefinedValues', () => {
  it('works with a simple object', () => {
    const testData = { a: null, b: undefined, c: 10 }
    const result = removeNullAndUndefinedValues(testData)
    expect(result).toEqual({ c: 10 })
  })

  it('works with nested objects', () => {
    const testData = { a: { b: null, c: undefined }, d: 10 }
    const result = removeNullAndUndefinedValues(testData)
    expect(result).toEqual({ a: {}, d: 10 })
  })

  it('ignores non-null and non-undefined values', () => {
    const testData = { a: 0, b: '', c: false, d: NaN }
    const result = removeNullAndUndefinedValues(testData)
    expect(result).toEqual({ a: 0, b: '', c: false, d: NaN })
  })
})
