import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'

import { Modal, ModalState } from './types'

export const initialState: ModalState = {
  current: null,
  stash: [],
}

const slice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    /**
     * Show a new modal
     */
    launch(state, action: PayloadAction<Modal>) {
      if (state.current) {
        state.stash.push(state.current)
      }
      state.current = action.payload
    },

    /**
     * Close the current modal
     */
    close(state) {
      state.current = state.stash.pop() || null
    },

    /**
     * Hide the current modal (with the intention of showing in again later)
     *
     * The semantics is the same as with git stash.
     */
    stash(state) {
      if (!state.current) {
        throw new Error("You can't call hideModal if no model is shown!")
      }
      state.stash.push(state.current)
      state.current = null
    },

    /**
     * Show the previously hidden modal again.
     *
     * The semantics is the same as with `git stash pop`.
     */
    stashPop(state) {
      if (state.current) {
        throw new Error("You can't call showModal when a modal is already visible!")
      }
      const latest = state.stash.pop()
      if (!latest) return
      state.current = latest
    },
  },
})

export const { actions: modalActions } = slice

export default slice.reducer
