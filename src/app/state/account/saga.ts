import { PayloadAction } from '@reduxjs/toolkit'
import { addressToPublicKey, parseRpcBalance } from 'app/lib/helpers'
import { all, call, fork, join, put, select, take, takeEvery } from 'typed-redux-saga'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'

import { accountActions as actions } from '.'
import { getExplorerAPIs, getOasisNic } from '../network/saga'
import { stakingActions } from '../staking'
import { transactionActions } from '../transaction'
import { selectAddress, selectType } from '../wallet/selectors'
import { selectAccountAddress } from './selectors'
import { WalletType } from '../wallet/types'
import { Account } from '../account/types'

/**
 * Waits for a LoadAccount action with a specific address,
 * and hydrate the state accordingly
 */
function* loadAccount(action: PayloadAction<{ address: string; type: WalletType }>) {
  const address = action.payload.address
  const walletType = action.payload.type

  yield* put(actions.setLoading(true))
  const nic = yield* call(getOasisNic)
  const publicKey = yield* call(addressToPublicKey, address)
  const { getAccount, getTransactionsList } = yield* call(getExplorerAPIs)

  yield* all([
    join(
      yield* fork(function* () {
        try {
          if (walletType === WalletType.ParaTime) {
            const paratimeAddress = address
            const runtimeId = '00000000000000000000000000000000000000000000000072c8215e60d5bca7' // Emerald
            const CONSENSUS_RT_ID = oasis.misc.fromHex(runtimeId)
            const accountsWrapper = new oasisRT.accounts.Wrapper(CONSENSUS_RT_ID)
            const newAddress = yield* call(oasis.staking.addressFromBech32, paratimeAddress)

            const balancesResult = yield* call((nicArg) => accountsWrapper
              .queryBalances()
              .setArgs({
                address: newAddress,
              })
              .query(nic)
              .catch((err: any) => {
                return err
              }), nic)

            let nativeDenominationBalanceBI = 0n
            if (balancesResult.balances) {
              const nativeDenominationHex = oasis.misc.toHex(oasisRT.token.NATIVE_DENOMINATION)
              for (const [denomination, amount] of balancesResult.balances) {
                const denominationHex = oasis.misc.toHex(denomination)
                if (denominationHex === nativeDenominationHex) {
                  nativeDenominationBalanceBI = oasis.quantity.toBigInt(amount)
                  break
                }
              }
            }
            yield put(actions.accountLoaded({ address, liquid_balance: Number(nativeDenominationBalanceBI) }))
          } else {
            const account = yield* call(getAccount, address)
            yield put(actions.accountLoaded(account))
          }
        } catch (apiError) {
          console.error('get account failed, continuing to RPC fallback.', apiError)
          try {
            const account = yield* call([nic, nic.stakingAccount], { owner: publicKey, height: 0 })
            // console.log({ loadAccount: account })
            const balance = parseRpcBalance(account)
            yield put(actions.accountLoaded({ address, liquid_balance: parseFloat(balance.available) }))
          } catch (rpcError) {
            console.error('get account with RPC failed, continuing without updated account.', rpcError)
            yield put(actions.accountError('' + apiError))
            return
          }
        }
      }),
    ),
    join(
      yield* fork(function* () {
        try {
          const transactions = yield* call(getTransactionsList, {
            accountId: address,
            limit: 20,
          })
          yield put(actions.transactionsLoaded(transactions))
        } catch (e) {
          console.error('get transactions list failed, continuing without updated list.', e)
          yield put(actions.transactionsError('' + e))
          return
        }
      }),
    ),
  ])

  yield* put(actions.setLoading(false))
}

/**
 * When a transaction is done, and it is related to the account we currently have in state
 * refresh the data.
 */
function* refreshAccountOnTransaction() {
  while (true) {
    const { payload } = yield* take(transactionActions.transactionSent)
    const from = yield* select(selectAddress)
    let otherAddress: string

    if (payload.type === 'transfer') {
      otherAddress = payload.to
    } else {
      otherAddress = payload.validator
    }

    const currentAccount = yield* select(selectAccountAddress)
    const walletType = yield* select(selectType)
    if (currentAccount === from || currentAccount === otherAddress) {
      // Refresh current account
      yield* put(actions.fetchAccount({ address: currentAccount, type: walletType }))
      yield* put(stakingActions.fetchAccount(currentAccount))
    }
  }
}

export function* accountSaga() {
  yield* fork(refreshAccountOnTransaction)
  yield* takeEvery(actions.fetchAccount, loadAccount)
}
