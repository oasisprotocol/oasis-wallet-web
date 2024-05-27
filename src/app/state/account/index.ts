import { PayloadAction } from '@reduxjs/toolkit'
import { ErrorPayload } from 'types/errors'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { AccountState, Account, PendingTransactionPayload, TransactionsLoadedPayload } from './types'

export const initialState: AccountState = {
  address: '',
  available: null,
  debonding: null,
  delegations: null,
  total: null,

  accountError: undefined,
  transactions: [],
  transactionsError: undefined,
  loading: true,
  pendingTransactions: {
    local: [],
    testnet: [],
    mainnet: [],
  },
  nonce: '0',
}

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    openAccountPage(state, action: PayloadAction<string>) {},
    closeAccountPage(state) {},
    clearAccount(state, action: PayloadAction) {
      Object.assign(state, initialState)
    },
    fetchAccount(state, action: PayloadAction<string>) {},
    accountLoaded(state, action: PayloadAction<Account>) {
      state.accountError = undefined
      Object.assign(state, action.payload)
    },
    accountError(state, action: PayloadAction<ErrorPayload>) {
      state.accountError = action.payload
    },
    transactionsLoaded(state, action: PayloadAction<TransactionsLoadedPayload>) {
      const {
        payload: { networkType, transactions },
      } = action

      state.transactionsError = undefined
      state.transactions = transactions

      state.pendingTransactions = {
        ...state.pendingTransactions,
        [networkType]: state.pendingTransactions[networkType].filter(
          ({ hash: pendingTxHash }) => !transactions.some(({ hash }) => pendingTxHash === hash),
        ),
      }
    },
    transactionsError(state, action: PayloadAction<ErrorPayload>) {
      state.transactionsError = action.payload
      // TODO: keep old state if loading the same account
      state.transactions = []
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload
    },
    addPendingTransaction(state, action: PayloadAction<PendingTransactionPayload>) {
      const {
        payload: { from, networkType, transaction },
      } = action

      if (from !== state.address) {
        return
      }

      state.pendingTransactions = {
        ...state.pendingTransactions,
        [networkType]: [transaction, ...state.pendingTransactions[networkType]],
      }
    },
  },
})

export const { actions: accountActions } = accountSlice
