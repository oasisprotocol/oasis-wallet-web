import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'

import { SettingsState } from './types'

export const initialState: SettingsState = {
  dialogOpen: false,
  allowDangerous: false,
}

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setOpen(state, action: PayloadAction<boolean>) {
      state.dialogOpen = action.payload
    },
    setAllowDangerous(state, action: PayloadAction<boolean>) {
      state.allowDangerous = action.payload
    },
  },
})

export const { actions: settingsActions } = slice

export default slice.reducer
