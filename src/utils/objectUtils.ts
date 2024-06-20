export const removeNullAndUndefinedValues = <T extends Record<string, any>>(obj: T): Partial<T> => {
  return Object.keys(obj).reduce((acc, curr) => {
    if (obj[curr] !== null && obj[curr] !== undefined) {
      return {
        ...acc,
        [curr]: typeof obj[curr] === 'object' ? removeNullAndUndefinedValues(obj[curr]) : obj[curr],
      }
    }

    return acc
  }, {})
}
