import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.settings || initialState

export const selectAllowDangerousSetting = createSelector([selectSlice], settings => settings.allowDangerous)
