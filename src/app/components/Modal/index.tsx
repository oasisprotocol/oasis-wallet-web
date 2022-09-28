import React from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { Box, Button, Layer, Heading, Paragraph } from 'grommet'
import { useTranslation } from 'react-i18next'
import { Alert, Checkmark, Close } from 'grommet-icons/icons'
import { AlertBox } from '../AlertBox'
import { selectAllowDangerousSetting } from '../SettingsDialog/slice/selectors'
import { useSelector } from 'react-redux'

interface Modal {
  title: string
  description: string
  handleConfirm: () => void

  /**
   * Is this a dangerous operation?
   *
   * If marked as such, it will only be possible to execute it if the wallet is configured to run in dangerous mode.
   *
   * It also automatically implies a mandatory waiting time of 10 sec, unless specified otherwise.
   */
  isDangerous: boolean

  /**
   * How long does the user have to wait before he can actually confirm the action?
   */
  mustWaitSecs?: number
}

interface ModalContainerProps {
  modal: Modal
  closeModal: () => void
}

interface ModalContextProps {
  launchModal: (modal: Modal) => void
  closeModal: () => void
}

interface ModalProviderProps {
  children: React.ReactNode
}

const ModalContext = createContext<ModalContextProps>({} as ModalContextProps)

const ModalContainer = ({ modal, closeModal }: ModalContainerProps) => {
  const { t } = useTranslation()
  const confirm = useCallback(() => {
    modal.handleConfirm()
    closeModal()
  }, [closeModal, modal])
  const { isDangerous, mustWaitSecs } = modal
  const allowDangerous = useSelector(selectAllowDangerousSetting)
  const forbidden = isDangerous && !allowDangerous
  const waitingTime = forbidden
    ? 0 // If the action is forbidden, there is nothing to wait for
    : isDangerous
    ? mustWaitSecs ?? 10 // For dangerous actions, we require 10 seconds of waiting, unless specified otherwise.
    : mustWaitSecs ?? 0 // For normal, non-dangerous operations, just use what was specified

  const [secsLeft, setSecsLeft] = useState(0)

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

  return (
    <Layer modal onEsc={closeModal} onClickOutside={closeModal} background="background-front">
      <Box margin="medium">
        <Heading size="small">{modal.title}</Heading>
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
        <Box direction="row" gap="small" alignSelf="end" pad={{ top: 'large' }}>
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
        </Box>
      </Box>
    </Layer>
  )
}

const ModalProvider = (props: ModalProviderProps) => {
  const [modal, setModal] = useState<Modal | null>(null)
  const closeModal = useCallback(() => {
    setModal(null)
  }, [])

  return (
    <ModalContext.Provider value={{ closeModal, launchModal: setModal }}>
      {props.children}
      {modal && <ModalContainer modal={modal} closeModal={closeModal} />}
    </ModalContext.Provider>
  )
}

const useModal = () => {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }

  return context
}

export { ModalProvider, useModal }
