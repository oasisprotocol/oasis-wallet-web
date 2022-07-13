/**
 * BigInt as a string.
 *
 * Redux can't serialize bigint fields, so we stringify them, and mark them.
 * TODO: make this a branded type, that only works with bigint parsing utils.
 */
export type StringifiedBigInt = string
