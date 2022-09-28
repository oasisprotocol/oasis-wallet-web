import React, { useState } from 'react'
import { SidebarButton } from '../Sidebar'
import { Configure } from 'grommet-icons/icons'
import { useTranslation } from 'react-i18next'
import { SettingsDialog } from '../SettingsDialog'

export const SettingsButton = () => {
  const [layerVisibility, setLayerVisibility] = useState(false)
  const { t } = useTranslation()
  return (
    <>
      <SidebarButton
        icon={<Configure />}
        label={t('menu.settings', 'Settings')}
        onClick={() => {
          setLayerVisibility(true)
        }}
      />
      {layerVisibility && <SettingsDialog closeHandler={() => setLayerVisibility(false)} />}
    </>
  )
}
