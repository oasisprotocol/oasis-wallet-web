import { useEffect, useState } from 'react'
import { Box, Button, Layer, Paragraph } from 'grommet'
import { useTranslation } from 'react-i18next'
import { Alert, Checkmark, Close, Configure } from 'grommet-icons'
import { ModalHeader } from 'app/components/Header'
import { AlertBox } from '../AlertBox'
import { selectAllowDangerousSetting } from '../SettingsDialog/slice/selectors'
import { useDispatch, useSelector } from 'react-redux'
import { settingsActions } from '../SettingsDialog/slice'
import { selectCurrentModal } from './slice/selectors'
import { modalActions } from './slice'

const ModalContainer = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const modal = useSelector(selectCurrentModal)
  const allowDangerous = useSelector(selectAllowDangerousSetting)
  const [secsLeft, setSecsLeft] = useState(0)
  const closeModal = () => dispatch(modalActions.close())
  const confirm = () => {
    modal?.handleConfirm()
    dispatch(modalActions.close())
  }
  const { isDangerous, mustWaitSecs } = modal || {}

  const forbidden = isDangerous && !allowDangerous
  const waitingTime = forbidden
    ? 0 // If the action is forbidden, there is nothing to wait for
    : isDangerous
    ? mustWaitSecs ?? 10 // For dangerous actions, we require 10 seconds of waiting, unless specified otherwise.
    : mustWaitSecs ?? 0 // For normal, non-dangerous operations, just use what was specified

  const openSettings = () => {
    dispatch(modalActions.stash())
    dispatch(settingsActions.setOpen(true))
  }

  useEffect(() => {
    if (waitingTime) {
      setSecsLeft(waitingTime)
      const stopCounting = () => window.clearInterval(interval)
      const interval = window.setInterval(
        () =>
          setSecsLeft(seconds => {
            const remains = seconds - 1
            if (!remains) stopCounting()
            return remains
          }),
        1000,
      )
      return stopCounting
    }
  }, [waitingTime])

  if (!modal) return null
  return (
    <Layer modal onEsc={closeModal} onClickOutside={closeModal} background="background-front">
      <Box margin="medium">
        <ModalHeader>{modal.title}</ModalHeader>
        <Paragraph fill>{modal.description}</Paragraph>
        {forbidden && (
          <AlertBox color={'status-error'}>
            {t(
              'dangerMode.youDontWantThis',
              "You most probably don't want to do this, so I won't allow it. If you really do, then please enable the 'dangerous mode' in wallet settings, and try again.",
            )}
          </AlertBox>
        )}
        {isDangerous && allowDangerous && (
          <AlertBox color={'status-warning'}>
            {t(
              'dangerMode.youCanButDoYouWant',
              "You most probably shouldn't do this, but since you have specifically enabled 'dangerous mode' in wallet settings, we won't stop you.",
            )}
          </AlertBox>
        )}
        <Box direction="row" gap="small" justify="between" pad={{ top: 'large' }}>
          <Button
            label={t('common.cancel', 'Cancel')}
            onClick={closeModal}
            secondary
            icon={<Close size="18px" />}
          />
          {!forbidden && (
            <Button
              label={t('common.confirm', 'Confirm') + (secsLeft ? ` (${secsLeft})` : '')}
              onClick={confirm}
              disabled={!!secsLeft}
              primary={modal.isDangerous}
              color={modal.isDangerous ? 'status-error' : ''}
              icon={modal.isDangerous ? <Alert size="18px" /> : <Checkmark size="18px" />}
            />
          )}
          {forbidden && (
            <Button label={t('menu.settings', 'Settings')} onClick={openSettings} icon={<Configure />} />
          )}
        </Box>
      </Box>
    </Layer>
  )
}

export { ModalContainer }
