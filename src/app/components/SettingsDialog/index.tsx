import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { ResponsiveLayer } from '../ResponsiveLayer'
import { Box, Button, Heading, Paragraph, RadioButtonGroup, ResponsiveContext } from 'grommet'
import { useDispatch, useSelector } from 'react-redux'
import { selectAllowDangerousSetting } from './slice/selectors'
import { Threats } from 'grommet-icons'
import { settingsActions } from './slice'

interface SettingsDialogProps {
  closeHandler: () => void
}

export const SettingsDialog = (props: SettingsDialogProps) => {
  const { t } = useTranslation()
  const size = useContext(ResponsiveContext)

  const dispatch = useDispatch()
  const dangerousMode = useSelector(selectAllowDangerousSetting)

  return (
    <ResponsiveLayer
      onClickOutside={props.closeHandler}
      onEsc={props.closeHandler}
      animation="slide"
      background="background-front"
      modal
    >
      <Box pad={{ vertical: 'small' }} margin="medium" width={size === 'small' ? 'auto' : '700px'}>
        <Heading size="1" margin={{ vertical: 'small' }}>
          {t('settings.dialog.title', 'Wallet settings')}
        </Heading>
        <Paragraph fill>
          {t(
            'settings.dialog.description',
            'This is where you can configure the behavior of the Oasis Wallet.',
          )}
        </Paragraph>
        <Box
          gap="small"
          pad={{ vertical: 'medium', right: 'small' }}
          overflow={{ vertical: 'auto' }}
          height={{ max: '400px' }}
        >
          <Paragraph fill>
            <strong>
              {t(
                'dangerMode.description',
                'Dangerous mode: should the wallet let the user shoot himself in the foot?',
              )}
            </strong>
          </Paragraph>
          <RadioButtonGroup
            name="doc"
            options={[
              {
                value: false,
                label: t('dangerMode.off', 'Off - Refuse to execute nonsensical actions'),
              },
              {
                value: true,
                label: (
                  <span>
                    {t('dangerMode.on', "On - Allow executing nonsensical actions. Don't blame Oasis!")}{' '}
                    <Threats size={'large'} />
                  </span>
                ),
              },
            ]}
            value={dangerousMode}
            onChange={event => dispatch(settingsActions.setAllowDangerous(event.target.value === 'true'))}
          />
        </Box>
        <Box align="end" pad={{ top: 'medium' }}>
          <Button primary label={t('settings.dialog.close', 'Close')} onClick={props.closeHandler} />
        </Box>
      </Box>
    </ResponsiveLayer>
  )
}
