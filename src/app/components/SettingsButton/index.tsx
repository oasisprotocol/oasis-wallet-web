import React from 'react'
import { SidebarButton } from '../Sidebar'
import { Configure } from 'grommet-icons'
import { useTranslation } from 'react-i18next'
import { SettingsDialog } from '../SettingsDialog'
import { selectIsSettingsDialogOpen } from '../SettingsDialog/slice/selectors'
import { useDispatch, useSelector } from 'react-redux'
import { settingsActions } from '../SettingsDialog/slice'
import { modalActions } from '../Modal/slice'

export const SettingsButton = () => {
  const dispatch = useDispatch()
  const layerVisibility = useSelector(selectIsSettingsDialogOpen)
  const { t } = useTranslation()
  const setLayerVisibility = (value: boolean) => dispatch(settingsActions.setOpen(value))
  const closeSettings = () => {
    dispatch(settingsActions.setOpen(false))
    dispatch(modalActions.stashPop())
  }
  return (
    <>
      <SidebarButton
        icon={<Configure />}
        label={t('menu.settings', 'Settings')}
        onClick={() => setLayerVisibility(true)}
      />
      {layerVisibility && <SettingsDialog closeHandler={closeSettings} />}
    </>
  )
}
