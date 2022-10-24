import { createSelector } from '@reduxjs/toolkit'

import { RootState } from 'types'
import { initialState } from '.'

const selectSlice = (state: RootState) => state.modal || initialState

export const selectCurrentModal = createSelector([selectSlice], settings => settings.current)
