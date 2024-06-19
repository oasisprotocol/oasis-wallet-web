import { Transaction } from 'app/state/transaction/types'
import { ErrorPayload } from 'types/errors'
import { StringifiedBigInt } from 'types/StringifiedBigInt'
import { NetworkType } from '../network/types'

export interface BalanceDetails {
  available: StringifiedBigInt | null
  /** This is delayed in getAccount by 20 seconds on oasisscan and 5 seconds on oasismonitor. */
  debonding: StringifiedBigInt | null
  /** This is delayed in getAccount by 20 seconds on oasisscan and 5 seconds on oasismonitor. */
  delegations: StringifiedBigInt | null
  /** This is delayed in getAccount by 20 seconds on oasisscan and 5 seconds on oasismonitor. */
  total: StringifiedBigInt | null
  nonce?: StringifiedBigInt | null
}

export interface Allowance {
  address: string
  amount: StringifiedBigInt
}

export interface Account extends BalanceDetails {
  address: string
  allowances?: Allowance[]
  nonce?: StringifiedBigInt
}

/* --- STATE --- */
export interface AccountState extends Account {
  loading: boolean
  accountError?: ErrorPayload
  transactions: Transaction[]
  transactionsError?: ErrorPayload
  pendingTransactions: Record<NetworkType, Transaction[]>
}

export interface PendingTransactionPayload {
  from: string
  networkType: NetworkType
  transaction: Transaction
}

export interface TransactionsLoadedPayload {
  transactions: Transaction[]
  networkType: NetworkType
}
