import { PayloadAction } from '@reduxjs/toolkit'
import { ErrorPayload } from 'types/errors'
import { createSlice } from 'utils/@reduxjs/toolkit'
import {
  AddEscrowPayload,
  TransferPayload,
  TransactionPreview,
  TransactionState,
  TransactionStep,
  TransactionPayload,
  ReclaimEscrowPayload,
  BurnPayload,
} from './types'

export const initialState: TransactionState = {
  success: false,
  active: false,
}

const slice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    clearTransaction(state, action: PayloadAction<void>) {
      state.preview = undefined
      state.error = undefined
      state.success = false
      state.active = false
    },
    confirmTransaction(state, action: PayloadAction<void>) {},
    abortTransaction(state, action: PayloadAction<void>) {},
    setStep(state, action: PayloadAction<TransactionStep>) {
      state.step = action.payload
    },
    addEscrow(state, action: PayloadAction<AddEscrowPayload>) {
      state.error = undefined
      state.success = false
      state.active = true
    },
    reclaimEscrow(state, action: PayloadAction<ReclaimEscrowPayload>) {
      state.error = undefined
      state.success = false
      state.active = true
    },
    sendTransaction(state, action: PayloadAction<TransferPayload>) {
      state.error = undefined
      state.success = false
      state.active = true
    },
    sendBurn(state, action: PayloadAction<BurnPayload>) {
      state.error = undefined
      state.success = false
      state.active = true
    },
    updateTransactionPreview(state, action: PayloadAction<TransactionPreview>) {
      state.preview = Object.assign({}, action.payload)
    },
    transactionSent(state, action: PayloadAction<TransactionPayload>) {
      state.preview = undefined
      state.success = true
      state.active = false
    },
    transactionFailed(state, action: PayloadAction<ErrorPayload>) {
      state.preview = undefined
      state.error = action.payload
      state.active = false
    },
  },
})

export const { actions: transactionActions } = slice

export default slice.reducer
