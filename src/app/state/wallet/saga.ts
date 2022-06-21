import { hdkey } from '@oasisprotocol/client'
import { PayloadAction } from '@reduxjs/toolkit'
import { hex2uint, parseRpcBalance, publicKeyToAddress, shortPublicKey, uint2hex } from 'app/lib/helpers'
import { push } from 'connected-react-router'
import nacl from 'tweetnacl'
import { call, fork, put, select, take, takeEvery, takeLatest } from 'typed-redux-saga'

import { walletActions as actions, walletActions } from '.'
import { LedgerAccount } from '../ledger/types'
import { getOasisNic } from '../network/saga'
import { transactionActions } from '../transaction'
import { selectActiveWallet, selectAddress, selectWallets } from './selectors'
import { AddWalletPayload, Wallet, WalletType } from './types'

// Ensure a unique walletId per opened wallet
// Maybe we should switch to something like uuid later
let walletId = 0

/**
 * Opened wallet saga
 * Will later be used to sign arbitrary messages
 */
export function* walletSaga() {}

export function* rootWalletSaga() {
  // Wait for an openWallet action (Mnemonic, Private Key, Ledger) and add them if requested
  yield* takeEvery(walletActions.openWalletFromPrivateKey, openWalletFromPrivateKey)
  yield* takeEvery(walletActions.openWalletFromMnemonic, openWalletFromMnemonic)
  yield* takeEvery(walletActions.openWalletsFromLedger, openWalletsFromLedger)
  yield* takeEvery(walletActions.openWalletFromEthereumPrivateKey, openWalletFromEthereumPrivateKey)
  yield* takeEvery(walletActions.addWallet, addWallet)

  // Reload balance of matching wallets when a transaction occurs
  yield* fork(reloadBalanceOnTransaction)
  yield* takeEvery(walletActions.fetchWallet, loadWallet)

  // Allow switching between wallets
  yield* takeLatest(walletActions.selectWallet, selectWallet)

  // Start the wallet saga in parallel
  yield* fork(walletSaga)

  // Listen to closeWallet
  yield* takeEvery(actions.closeWallet, closeWallet)
}

export function* getBalance(publicKey: Uint8Array) {
  const nic = yield* call(getOasisNic)
  const short = yield* call(shortPublicKey, publicKey)
  const account = yield* call([nic, nic.stakingAccount], {
    height: 0,
    owner: short,
  })

  return parseRpcBalance(account)
}

function* getWalletByAddress(address: string) {
  const wallets = yield* select(selectWallets)
  const wallet = Object.values(wallets).find(w => w.address === address)

  return wallet ? wallet : undefined
}
/**
 * Take multiple ledger accounts that we want to open
 */
export function* openWalletsFromLedger({ payload: accounts }: PayloadAction<LedgerAccount[]>) {
  for (const [index, account] of accounts.entries()) {
    yield* put(
      actions.addWallet({
        id: walletId++,
        address: account.address,
        publicKey: account.publicKey,
        type: WalletType.Ledger,
        balance: account.balance,
        path: account.path,
        selectImmediately: index === 0,
      }),
    )
  }
}

export function* openWalletFromPrivateKey({ payload: privateKey }: PayloadAction<string>) {
  const type = WalletType.PrivateKey
  const publicKeyBytes = nacl.sign.keyPair.fromSecretKey(hex2uint(privateKey)).publicKey
  const walletAddress = yield* call(publicKeyToAddress, publicKeyBytes)
  const publicKey = uint2hex(publicKeyBytes)
  const balance = yield* call(getBalance, publicKeyBytes)

  yield* put(
    actions.addWallet({
      id: walletId++,
      address: walletAddress,
      publicKey,
      privateKey,
      type: type!,
      balance,
      selectImmediately: true,
    }),
  )
}

export function* openWalletFromMnemonic({ payload: mnemonic }: PayloadAction<string>) {
  const signer = yield* call(hdkey.HDKey.getAccountSigner, mnemonic)
  const privateKey = uint2hex(signer.secretKey)
  const type = WalletType.Mnemonic
  const publicKeyBytes = signer.publicKey
  const publicKey = uint2hex(publicKeyBytes)

  const walletAddress = yield* call(publicKeyToAddress, publicKeyBytes!)
  const balance = yield* call(getBalance, publicKeyBytes)

  yield* put(
    actions.addWallet({
      id: walletId++,
      address: walletAddress,
      publicKey,
      privateKey,
      type: type!,
      balance,
      selectImmediately: true,
    }),
  )
}

export function* openWalletFromEthereumPrivateKey({ payload: tmp }: PayloadAction<any>) {
  const balance = yield* call(getBalance, tmp.publicKey)

  yield* put(
    actions.addWallet({
      id: walletId++,
      address: tmp.address,
      publicKey: tmp.publicKey,
      privateKey: tmp.privKey_hex,
      type: WalletType.ParaTime,
      balance,
      selectImmediately: true,
    }),
  )
}

/**
 * Adds a wallet to the existing wallets
 * If the wallet exists already, do nothingg
 * If it has "selectImmediately", we select it immediately
 */
export function* addWallet({ payload: newWallet }: PayloadAction<AddWalletPayload>) {
  const existingWallet = yield* call(getWalletByAddress, newWallet.address)
  if (!existingWallet) {
    yield* put(actions.walletOpened(newWallet))
  }

  const walletId = existingWallet ? existingWallet.id : newWallet.id

  if (newWallet.selectImmediately) {
    yield* put(walletActions.selectWallet(walletId))
  }
}

export function* closeWallet() {
  yield* put(actions.walletClosed())
}

export function* selectWallet({ payload: index }: PayloadAction<number>) {
  yield* put(walletActions.walletSelected(index))
  const newWallet = yield* select(selectActiveWallet)
  yield* put(push(`/account/${newWallet?.address}`))
}

function* loadWallet(action: PayloadAction<Wallet>) {
  const wallet = action.payload
  const balance = yield* call(getBalance, hex2uint(wallet.publicKey))
  yield* put(
    walletActions.updateBalance({
      walletId: wallet.id,
      balance,
    }),
  )
}

/**
 * When a transaction is done, and it is related to the account we currently have in state
 * refresh the data.
 */
function* reloadBalanceOnTransaction() {
  while (true) {
    const { payload } = yield* take(transactionActions.transactionSent)
    if (payload.type !== 'transfer') {
      // @TODO: This should be done for other types of transactions too
      return
    }

    const from = yield* select(selectAddress)
    const to = payload.to

    const wallets = yield* select(selectWallets)
    const matchingWallets = Object.values(wallets).filter(w => w.address === to || w.address === from)
    for (const wallet of matchingWallets) {
      yield* put(walletActions.fetchWallet(wallet))
    }
  }
}
