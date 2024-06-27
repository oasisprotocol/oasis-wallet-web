import { addressToPublicKey, parseRpcBalance } from 'app/lib/helpers'
import { call } from 'typed-redux-saga'
import { getExplorerAPIs, getOasisNic } from '../state/network/saga'
import { Account } from '../state/account/types'

function* getBalanceGRPC(address: string, { includeNonce = true } = {}) {
  const nic = yield* call(getOasisNic)
  const publicKey = yield* call(addressToPublicKey, address)
  const account = yield* call([nic, nic.stakingAccount], { owner: publicKey, height: 0 })
  const grpcBalance = parseRpcBalance(account)
  return {
    address,
    available: grpcBalance.available,
    delegations: null,
    debonding: null,
    total: null,
    ...(includeNonce ? { nonce: account.general?.nonce?.toString() ?? '0' } : {}),
  }
}

export function* getAccountBalanceWithFallback(address: string, { includeNonce = true } = {}) {
  const { getAccount } = yield* call(getExplorerAPIs)
  try {
    const account: Account = yield* call(getAccount, address, { includeNonce })
    return account
  } catch (apiError: any) {
    console.error('get account failed, continuing to RPC fallback.', apiError)
    try {
      const account: Account = yield* call(getBalanceGRPC, address, { includeNonce })
      return account
    } catch (rpcError) {
      console.error('get account with RPC failed, continuing without updated account.', rpcError)
      throw apiError
    }
  }
}
