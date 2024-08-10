import { privateToEthAddress } from '../eth-helpers'

test('privateToEthAddress', () => {
  expect(privateToEthAddress('414bba7f242e9054f9fc119fe32d322a7d9bbe0cb8c75173a6826cc8b1af1370')).toEqual(
    '0xFed5547859F9948d2C85F0516E3944377F88046f',
  )
})
