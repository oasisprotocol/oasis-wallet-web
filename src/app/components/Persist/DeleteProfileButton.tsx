import { Button } from 'grommet/es6/components/Button'
import { persistActions } from 'app/state/persist'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Paragraph } from 'grommet/es6/components/Paragraph'
import { DeleteInputForm } from '../../components/DeleteInputForm'
import { Box } from 'grommet/es6/components/Box'
import { ResponsiveLayer } from '../ResponsiveLayer'
import { Header } from 'app/components/Header'

interface DeleteProfileButtonProps {
  prominent?: boolean
  variant: 'voluntary' | 'forgot-password'
}

export function DeleteProfileButton({ prominent, variant }: DeleteProfileButtonProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [layerVisibility, setLayerVisibility] = useState(false)

  const onCancel = () => {
    setLayerVisibility(false)
  }

  const onConfirm = () => {
    navigate('/')
    dispatch(persistActions.deleteProfileAsync())
  }

  return (
    <>
      <Button
        color="status-error"
        label={
          variant === 'forgot-password'
            ? t('persist.loginToProfile.deleteProfile.forgotPasswordButton', 'Forgot password?')
            : t('persist.loginToProfile.deleteProfile.button', 'Delete profile')
        }
        onClick={() => setLayerVisibility(true)}
        primary={prominent}
        plain={!prominent}
      />
      {layerVisibility && (
        <ModalLayout
          title={t('persist.loginToProfile.deleteProfile.title', 'Delete Profile')}
          onClickOutside={onCancel}
          onEsc={onCancel}
        >
          <DeleteInputForm onCancel={onCancel} onConfirm={onConfirm}>
            <Paragraph fill>
              <label htmlFor="type_delete">
                {variant === 'forgot-password' && (
                  <span>
                    {t(
                      'persist.loginToProfile.deleteProfile.forgotPasswordDescription',
                      'ROSE Wallet does not store your password and cannot help you retrieve it. If you forgot your password, you can delete your locked profile here. After that, you can create a new one using your mnemonic phrase or private keys, and use your ROSE tokens again.',
                    )}
                    <br />
                    <br />
                  </span>
                )}

                <Trans
                  t={t}
                  i18nKey="persist.loginToProfile.deleteProfile.description"
                  defaults="This will <strong>permanently remove your private keys from this device.</strong><br/><br/>To confirm and proceed, please type <strong>{{confirmationKeyword}}</strong> below."
                  values={{
                    confirmationKeyword: t('deleteForm.confirmationKeyword', 'delete'),
                  }}
                />
              </label>
            </Paragraph>
          </DeleteInputForm>
        </ModalLayout>
      )}
    </>
  )
}

function ModalLayout(props: {
  title: string
  children: React.ReactNode
  onClickOutside?: () => void
  onEsc?: () => void
}) {
  return (
    <ResponsiveLayer
      modal
      responsive={false}
      style={{
        width: '100%',
        maxWidth: '500px',
      }}
      background="background-front"
      onClickOutside={props.onClickOutside}
      onEsc={props.onEsc}
    >
      <Box pad="medium">
        <Header level={2} fill textAlign="center" margin={{ top: 'medium' }}>
          {props.title}
        </Header>

        {props.children}
      </Box>
    </ResponsiveLayer>
  )
}
