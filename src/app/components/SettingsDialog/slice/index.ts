import { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from 'utils/@reduxjs/toolkit'

import { SettingsState } from './types'

export const initialState: SettingsState = {
  allowDangerous: false,
}

const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setAllowDangerous(state, action: PayloadAction<boolean>) {
      state.allowDangerous = action.payload
    },
  },
})

export const { actions: settingsActions } = slice

export default slice.reducer
