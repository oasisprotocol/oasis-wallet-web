import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors'
import { LedgerAccount } from '../ledger/types'

import { rootWalletSaga } from './saga'
import { AddWalletPayload, BalanceUpdatePayload, Wallet, WalletBalance, WalletState } from './types'

export const initialState: WalletState = {
  wallets: {},
  isOpen: false,
  selectedWallet: undefined,
}

const slice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    openWalletFromMnemonic(state, action: PayloadAction<string>) {},
    openWalletFromPrivateKey(state, action: PayloadAction<string>) {},
    openWalletsFromLedger(state, action: PayloadAction<LedgerAccount[]>) {},
    openWalletFromEthereumPrivateKey(state, action: PayloadAction<string>) {},
    selectWallet(state, action: PayloadAction<number>) {},
    closeWallet(state, action: PayloadAction<void>) {},
    fetchWallet(state, action: PayloadAction<Wallet>) {},
    updateBalance(state, action: PayloadAction<BalanceUpdatePayload>) {
      Object.assign(state.wallets[action.payload.walletId].balance, action.payload.balance)
    },
    walletSelected(state, action: PayloadAction<number>) {
      state.selectedWallet = action.payload
    },
    addWallet(state, action: PayloadAction<AddWalletPayload>) {},
    walletOpened(state, action: PayloadAction<Wallet>) {
      const newWallet = action.payload
      state.wallets[newWallet.id] = Object.assign({}, newWallet)
      state.isOpen = true
    },
    walletClosed(state, action: PayloadAction<void>) {
      // Revert to initial state
      Object.assign(state, initialState)
    },
    walletLoaded(state, action: PayloadAction<WalletBalance>) {
      state.isOpen = true
      // state.wallets[state.selectedWallet!].balance = action.payload
    },
  },
})

export const { actions: walletActions } = slice

export const useWalletSlice = () => {
  useInjectReducer({ key: slice.name, reducer: slice.reducer })
  useInjectSaga({ key: slice.name, saga: rootWalletSaga })
  return { actions: slice.actions }
}
