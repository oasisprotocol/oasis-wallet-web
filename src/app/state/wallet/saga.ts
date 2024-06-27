import { PayloadAction } from '@reduxjs/toolkit'
import { hex2uint, publicKeyToAddress, uint2hex } from 'app/lib/helpers'
import nacl from 'tweetnacl'
import { call, delay, fork, put, select, take, takeEvery } from 'typed-redux-saga'
import { selectSelectedAccounts } from 'app/state/importaccounts/selectors'

import { walletActions } from '.'
import { importAccountsActions } from '../importaccounts'
import { ImportAccountsListAccount } from '../importaccounts/types'
import { transactionActions } from '../transaction'
import { selectAddress, selectWallets } from './selectors'
import {
  AddWalletPayload,
  OpenFromPrivateKeyPayload,
  OpenSelectedAccountsPayload,
  Wallet,
  WalletType,
} from './types'
import { persistActions } from 'app/state/persist'
import { getAccountBalanceWithFallback } from '../../lib/getAccountBalanceWithFallback'
import { networkActions } from '../network'

export function* rootWalletSaga() {
  // Wait for an openWallet action (Mnemonic, Private Key, Ledger) and add them if requested
  yield* takeEvery(walletActions.openWalletFromPrivateKey, openWalletFromPrivateKey)
  yield* takeEvery(walletActions.openWalletFromMnemonic, openWalletFromMnemonic)
  yield* takeEvery(walletActions.openWalletsFromLedger, openWalletsFromLedger)

  // Reload balance of matching wallets when a transaction occurs
  yield* fork(refreshAccountOnTransaction)
  yield* fork(refreshAccountOnParaTimeTransaction)
  yield* takeEvery(walletActions.fetchWallet, fetchWallet)

  // Reload wallet balances if network changes
  yield* takeEvery(networkActions.networkSelected, refreshOnNetworkChange)
}

function* getWalletByAddress(address: string) {
  const wallets = yield* select(selectWallets)
  const wallet = Object.values(wallets).find(w => w.address === address)

  return wallet ? wallet : undefined
}
/**
 * Take multiple ledger accounts that we want to open
 */
export function* openWalletsFromLedger({ payload }: PayloadAction<OpenSelectedAccountsPayload>) {
  const accounts: ImportAccountsListAccount[] = yield* select(selectSelectedAccounts)
  yield* put(importAccountsActions.clear())
  for (const account of accounts) {
    const { nonce: _, ...balance } = account.balance!

    yield* call(addWallet, {
      address: account.address,
      publicKey: account.publicKey,
      type: WalletType.UsbLedger,
      balance,
      path: account.path,
      pathDisplay: account.pathDisplay,
      selectImmediately: account === accounts[0], // Select first
    })
  }

  if (payload.choosePassword) {
    yield* put(persistActions.setPasswordAsync({ password: payload.choosePassword }))
  }
}

export function* openWalletFromPrivateKey({ payload }: PayloadAction<OpenFromPrivateKeyPayload>) {
  const type = WalletType.PrivateKey
  const publicKeyBytes = nacl.sign.keyPair.fromSecretKey(hex2uint(payload.privateKey)).publicKey
  const walletAddress = yield* call(publicKeyToAddress, publicKeyBytes)
  const publicKey = uint2hex(publicKeyBytes)
  const balance = yield* call(getAccountBalanceWithFallback, walletAddress, { includeNonce: false })

  yield* call(addWallet, {
    address: walletAddress,
    publicKey,
    privateKey: payload.privateKey,
    type: type!,
    balance,
    selectImmediately: true,
  })

  if (payload.choosePassword) {
    yield* put(persistActions.setPasswordAsync({ password: payload.choosePassword }))
  }
}

export function* openWalletFromMnemonic({ payload }: PayloadAction<OpenSelectedAccountsPayload>) {
  const accounts: ImportAccountsListAccount[] = yield* select(selectSelectedAccounts)
  yield* put(importAccountsActions.clear())
  for (const account of accounts) {
    const { nonce: _, ...balance } = account.balance!

    yield* call(addWallet, {
      address: account.address,
      balance,
      path: account.path,
      pathDisplay: account.pathDisplay,
      privateKey: account.privateKey,
      publicKey: account.publicKey,
      type: account.type,
      selectImmediately: account === accounts[0], // Select first
    })
  }

  if (payload.choosePassword) {
    yield* put(persistActions.setPasswordAsync({ password: payload.choosePassword }))
  }
}

/**
 * Adds a wallet to the existing wallets
 * If the wallet exists already, do nothing
 * If it has "selectImmediately", we select it immediately
 */
export function* addWallet(payload: AddWalletPayload) {
  const { selectImmediately, ...newWallet } = payload
  const existingWallet = yield* call(getWalletByAddress, newWallet.address)
  if (!existingWallet) {
    yield* put(walletActions.walletOpened(newWallet))
  }

  if (selectImmediately) {
    yield* put(walletActions.selectWallet(undefined)) // Workaround so useRouteRedirects detects selecting the same account
    yield* delay(1) // Workaround to avoid React batching state updates
    yield* put(walletActions.selectWallet(newWallet.address))
  }
}

function* fetchWallet(action: PayloadAction<Wallet>) {
  const wallet = action.payload
  const balance = yield* call(getAccountBalanceWithFallback, wallet.address, { includeNonce: false })
  yield* put(
    walletActions.updateBalance({
      address: wallet.address,
      balance,
    }),
  )
}

/**
 * When a transaction is done, and it is related to the account we currently have in state
 * refresh the data.
 */
function* refreshAccountOnTransaction() {
  while (true) {
    const { payload } = yield* take(transactionActions.transactionSent)
    const otherAddress = payload.type === 'transfer' ? payload.to : payload.validator
    yield* call(refreshAccount, otherAddress)
  }
}

function* refreshAccountOnParaTimeTransaction() {
  while (true) {
    const { payload } = yield* take(transactionActions.paraTimeTransactionSent)

    yield* call(refreshAccount, payload)
  }
}

export function* refreshAccount(address: string) {
  const from = yield* select(selectAddress)
  const wallets = yield* select(selectWallets)
  const matchingWallets = Object.values(wallets).filter(
    wallet => wallet.address === address || wallet.address === from,
  )
  for (const wallet of matchingWallets) {
    yield* put(walletActions.fetchWallet(wallet))
  }
}

function* refreshOnNetworkChange() {
  const wallets = yield* select(selectWallets)
  for (const wallet of Object.values(wallets)) {
    yield* put(walletActions.fetchWallet(wallet))
  }
}
