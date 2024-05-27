import { client, misc } from '@oasisprotocol/client'
import { Signer } from '@oasisprotocol/client/dist/signature'
import { PayloadAction } from '@reduxjs/toolkit'
import { hex2uint, isValidAddress, parseRoseStringToBaseUnitString, uint2bigintString } from 'app/lib/helpers'
import { LedgerSigner } from 'app/lib/ledger'
import { OasisTransaction, signerFromEthPrivateKey, signerFromPrivateKey, TW } from 'app/lib/transaction'
import { getEvmBech32Address, privateToEthAddress } from 'app/lib/eth-helpers'
import { call, delay, put, race, select, take, takeEvery } from 'typed-redux-saga'
import { ErrorPayload, ExhaustedTypeError, WalletError, WalletErrors } from 'types/errors'
import { transactionActions } from '.'
import { sign } from '../importaccounts/saga'
import { getOasisNic } from '../network/saga'
import { selectAccountAddress, selectAccountAllowances } from '../account/selectors'
import { selectChainContext, selectSelectedNetwork } from '../network/selectors'
import { selectActiveWallet } from '../wallet/selectors'
import { Wallet, WalletType } from '../wallet/types'
import { Transaction, TransactionPayload, TransactionStatus, TransactionStep, TransactionType } from './types'
import { ParaTimeTransaction, Runtime, TransactionTypes } from '../paratimes/types'
import { accountActions } from '../account'

export function* transactionSaga() {
  yield* takeEvery(transactionActions.sendTransaction, doTransaction)
  yield* takeEvery(transactionActions.addEscrow, doTransaction)
  yield* takeEvery(transactionActions.reclaimEscrow, doTransaction)
}

function* setStep(step: TransactionStep) {
  yield* put(transactionActions.setStep(step))
}

/**
 * When we are previewing a transaction, await either a confirm action,
 * or an abort action.
 */
function* expectConfirmation() {
  const { confirm } = yield* race({
    confirm: take(transactionActions.confirmTransaction),
    abort: take(transactionActions.abortTransaction),
  })

  if (confirm) {
    return true
  } else {
    return false
  }
}

/**
 * Yields the appropriate signer for the currently active wallet
 */
function* getSigner() {
  const wallet = yield* select(selectActiveWallet)
  if (!wallet) {
    throw new WalletError(WalletErrors.NoOpenWallet, 'Cannot send transaction without an active wallet')
  }

  const privateKey = wallet.privateKey!

  let signer: Signer | LedgerSigner
  if (wallet.type === WalletType.PrivateKey || wallet.type === WalletType.Mnemonic) {
    const bytes = hex2uint(privateKey!)
    signer = yield* call(signerFromPrivateKey, bytes)
  } else if (wallet.type === WalletType.UsbLedger || wallet.type === WalletType.BleLedger) {
    signer = new LedgerSigner(wallet)
  } else {
    throw new ExhaustedTypeError('Invalid wallet type', wallet.type)
  }

  return signer
}

function* prepareTransfer(signer: Signer, amount: bigint, to: string) {
  const nic = yield* call(getOasisNic)

  yield* call(assertWalletIsOpen)
  yield* call(assertValidAddress, to)
  yield* call(assertSufficientBalance, amount)
  yield* call(assertRecipientNotSelf, to)

  return yield* call(OasisTransaction.buildTransfer, nic, signer as Signer, to, amount)
}

/**
 * Set allowance for ParaTime transaction
 */
function* prepareStakingAllowTransfer(signer: Signer, amount: bigint, to: string) {
  const nic = yield* call(getOasisNic)

  yield* call(assertWalletIsOpen)
  yield* call(assertValidAddress, to)
  yield* call(assertSufficientBalance, amount)
  yield* call(assertRecipientNotSelf, to)

  return yield* call(OasisTransaction.buildStakingAllowTransfer, nic, signer as Signer, to, amount)
}

function* prepareParatimeTransfer(
  nic: client.NodeInternal,
  signer: Signer,
  transaction: ParaTimeTransaction,
  from: string,
  runtime: Runtime,
) {
  yield* call(assertWalletIsOpen)
  if (transaction.type === TransactionTypes.Deposit) {
    yield* call(assertSufficientBalance, BigInt(parseRoseStringToBaseUnitString(transaction.amount)))
  }

  return yield* call(OasisTransaction.buildParaTimeTransfer, nic, signer, transaction, from, runtime)
}

function* prepareAddEscrow(signer: Signer, amount: bigint, validator: string) {
  const nic = yield* call(getOasisNic)

  yield* call(assertWalletIsOpen)
  yield* call(assertValidAddress, validator)
  yield* call(assertSufficientBalance, amount)

  return yield* call(OasisTransaction.buildAddEscrow, nic, signer as Signer, validator, amount)
}

function* prepareReclaimEscrow(signer: Signer, shares: bigint, validator: string) {
  const nic = yield* call(getOasisNic)

  yield* call(assertWalletIsOpen)
  yield* call(assertValidAddress, validator)

  return yield* call(OasisTransaction.buildReclaimEscrow, nic, signer as Signer, validator, shares)
}

/**
 * Generate transaction, sign, push to node
 *
 * Build the transaction (and validate it client-side)
 * Wait for either confirm or cancel, exit saga on cancel
 */
export function* doTransaction(action: PayloadAction<TransactionPayload>) {
  const wallet = yield* select(selectActiveWallet)
  const nic = yield* call(getOasisNic)
  const chainContext = yield* select(selectChainContext)
  const networkType = yield* select(selectSelectedNetwork)

  try {
    yield* setStep(TransactionStep.Building)

    yield* call(assertWalletIsOpen)
    const activeWallet = wallet as Wallet
    const signer = yield* getSigner()

    let tw: TW<any>
    switch (action.payload.type) {
      case 'transfer':
        tw = yield* call(prepareTransfer, signer as Signer, BigInt(action.payload.amount), action.payload.to)
        break

      case 'addEscrow':
        tw = yield* call(
          prepareAddEscrow,
          signer as Signer,
          BigInt(action.payload.amount),
          action.payload.validator,
        )
        break

      case 'reclaimEscrow':
        tw = yield* call(
          prepareReclaimEscrow,
          signer as Signer,
          BigInt(action.payload.shares),
          action.payload.validator,
        )
        break

      default:
        throw new ExhaustedTypeError('Unsupported transaction type', action.payload)
    }

    yield* put(
      transactionActions.updateTransactionPreview({
        transaction: action.payload,
        fee: uint2bigintString(tw.transaction.fee?.amount!),
        gas: BigInt(tw.transaction.fee?.gas!).toString(),
      }),
    )

    yield* setStep(TransactionStep.Preview)
    const confirmed = yield* expectConfirmation()
    if (!confirmed) {
      yield* put(transactionActions.clearTransaction())
      return
    }

    yield* setStep(TransactionStep.Signing)

    if (activeWallet.type === WalletType.UsbLedger || activeWallet.type === WalletType.BleLedger) {
      yield* call(sign, signer as LedgerSigner, tw)
    } else {
      yield* call(OasisTransaction.sign, chainContext, signer as Signer, tw)
    }

    yield* setStep(TransactionStep.Submitting)
    yield* call(OasisTransaction.submit, nic, tw)

    // Notify that the transaction was a success
    yield* put(transactionActions.transactionSent(action.payload))

    const hash = yield* call([tw, tw.hash])

    const transaction: Transaction = {
      hash,
      type: tw.transaction.method as TransactionType,
      from: activeWallet.address,
      amount: action.payload.amount,
      to: undefined,
      ...(action.payload.type === 'transfer'
        ? {
            to: action.payload.to,
          }
        : {}),
      ...(action.payload.type === 'addEscrow'
        ? {
            to: action.payload.validator,
          }
        : {}),
      ...(action.payload.type === 'reclaimEscrow'
        ? {
            to: action.payload.validator,
          }
        : {}),
      status: TransactionStatus.Pending,
      fee: undefined,
      level: undefined,
      round: undefined,
      runtimeId: undefined,
      runtimeName: undefined,
      timestamp: undefined,
      nonce: undefined,
    }

    // TODO: Handle ParaTime transactions in similar way
    yield* put(accountActions.addPendingTransaction({ transaction, from: activeWallet.address, networkType }))
  } catch (e: any) {
    let payload: ErrorPayload
    if (e instanceof WalletError) {
      payload = { code: e.type, message: e.message }
    } else {
      payload = { code: WalletErrors.UnknownError, message: e.message }
    }

    yield* put(transactionActions.transactionFailed(payload))
  }
}

export function* getAllowanceDifference(amount: string, runtimeAddress: string) {
  const allowances = yield* select(selectAccountAllowances)
  const allowance = allowances
    ? allowances.find(item => item.address === runtimeAddress)?.amount ?? 0 // No allowance set yet
    : 0 // Allowance info is missing

  return BigInt(parseRoseStringToBaseUnitString(amount)) - BigInt(allowance)
}

export function* setAllowance(
  nic: client.NodeInternal,
  chainContext: string,
  amount: string,
  runtimeAddress: string,
) {
  const allowanceDifference = yield* call(getAllowanceDifference, amount, runtimeAddress)
  if (allowanceDifference > 0n) {
    const signer = yield* getSigner()
    const tw = yield* call(prepareStakingAllowTransfer, signer as Signer, allowanceDifference, runtimeAddress)
    yield* call(OasisTransaction.sign, chainContext, signer as Signer, tw)
    yield* call(OasisTransaction.submit, nic, tw)
  }
}

const transactionSentDelay = 1000 // to increase a chance to get updated account data from BE

export function* submitParaTimeTransaction(runtime: Runtime, transaction: ParaTimeTransaction) {
  const fromAddress = transaction.ethPrivateKey
    ? yield* call(getEvmBech32Address, privateToEthAddress(transaction.ethPrivateKey))
    : yield* select(selectAccountAddress)
  const nic = yield* call(getOasisNic)
  const chainContext = yield* select(selectChainContext)
  const paraTimeTransactionSigner = transaction.ethPrivateKey
    ? yield* call(signerFromEthPrivateKey, misc.fromHex(transaction.ethPrivateKey))
    : yield* getSigner()

  if (transaction.type === TransactionTypes.Deposit) {
    yield* call(setAllowance, nic, chainContext, transaction.amount, runtime.address)
  }

  const rtw = yield* call(
    prepareParatimeTransfer,
    nic,
    paraTimeTransactionSigner as Signer,
    transaction,
    fromAddress,
    runtime,
  )

  yield* call(OasisTransaction.signParaTime, chainContext, paraTimeTransactionSigner as Signer, rtw)
  yield* call(OasisTransaction.submit, nic, rtw)
  yield* delay(transactionSentDelay)
  yield* put(transactionActions.paraTimeTransactionSent(transaction.recipient))
}

function* assertWalletIsOpen() {
  const wallet = yield* select(selectActiveWallet)

  if (!wallet) {
    throw new WalletError(WalletErrors.NoOpenWallet, 'Cannot send transaction without an active wallet')
  }
}

function assertValidAddress(address: string) {
  if (!isValidAddress(address)) {
    throw new WalletError(WalletErrors.InvalidAddress, 'Invalid address')
  }
}

function* assertSufficientBalance(amount: bigint) {
  const wallet = yield* select(selectActiveWallet)
  // If balance is missing, allow this to pass. It's just more likely that transaction will fail after submitting.
  if (wallet?.balance.available == null) return

  const balance = BigInt(wallet.balance.available)
  if (amount > balance) {
    throw new WalletError(WalletErrors.InsufficientBalance, 'Insufficient balance')
  }
}

function* assertRecipientNotSelf(recipient: string) {
  const wallet = yield* select(selectActiveWallet)

  if (wallet!.address === recipient) {
    throw new WalletError(WalletErrors.CannotSendToSelf, 'Cannot send to your own account')
  }
}
