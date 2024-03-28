/**
 *
 * FatalError
 *
 */
import { selectFatalError } from 'app/state/fatalerror/selectors'
import copy from 'copy-to-clipboard'
import styled from 'styled-components'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { ThemeContext } from 'styled-components'
import { Anchor } from 'grommet/es6/components/Anchor'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Heading } from 'grommet/es6/components/Heading'
import { TextArea } from 'grommet/es6/components/TextArea'
import { Text } from 'grommet/es6/components/Text'
import { Copy } from 'grommet-icons/es6/icons/Copy'
import { Dashboard } from 'grommet-icons/es6/icons/Dashboard'
import { Refresh } from 'grommet-icons/es6/icons/Refresh'
import * as React from 'react'
import { useContext, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { normalizeColor } from 'grommet/es6/utils'
import { ResponsiveLayer } from '../ResponsiveLayer'
import logotype from '../../../../public/logo192.png'
import { runtimeIs } from 'config'

const StyledTextArea = styled(TextArea)`
  // Opacity is a workaround for browsers anti-aliasing issue triggered by border-radius.
  // Without it text is blurry.
  background-color: ${({ theme }) => `${normalizeColor('brand-background-light', theme)}fe`};
  font-family: 'Roboto mono', monospace;
  letter-spacing: 0;
  font-size: 13px;
  color: ${({ theme }) => normalizeColor('text-custom', theme)};
`

const StyledButton = styled(Button)`
  font-size: 14px;
  border-radius: 8px;
  border-width: 1px;
  border-style: solid;
`

interface Props {
  children?: React.ReactNode
}

export function FatalErrorHandler({ children }: Props) {
  const { t } = useTranslation()
  const isMobile = useContext(ResponsiveContext) === 'small'
  const theme = useContext(ThemeContext)
  const fatalError = useSelector(selectFatalError)
  const [copied, setCopied] = useState(false)

  if (!fatalError) {
    return <>{children}</>
  }

  const combinedStacktrace = `${fatalError.message}\n\n${fatalError.sagaStack}\n\n${fatalError.stack}`

  const copyError = () => {
    copy(combinedStacktrace)
    setCopied(true)
  }

  return (
    <ResponsiveLayer modal background="background-front">
      <Box align="end" margin={{ horizontal: 'large', top: 'medium' }}>
        <img src={logotype} alt={t('appTitle')} width="45" height="45" />
      </Box>
      <Box margin={{ horizontal: 'large', bottom: 'large' }}>
        <Box direction="row" align="center" gap="small">
          <Heading style={{ fontSize: '20px' }} margin="none">
            {t('fatalError.heading', 'An error occurred.')}
          </Heading>
        </Box>
        <Text size="small" margin={{ bottom: 'small' }}>
          <Trans
            i18nKey="fatalError.description"
            defaults="The error that has occurred triggers the wallet to stop. <strong>Your funds are safe.</strong><br/><br/>Please try refreshing the page and reopening your wallet to see if the issue persists. You can check the current status of the network below."
            t={t}
          />
        </Text>
        <Box direction={isMobile ? 'column' : 'row'} margin={{ bottom: isMobile ? 'xlarge' : 'large' }}>
          <StyledButton
            href="https://status.oasisprotocol.org"
            target="_blank"
            rel="noopener noreferrer"
            icon={<Dashboard size="22px" color={normalizeColor('brand-white', theme)} />}
            label={t('fatalError.checkStatus', 'Check network status')}
            style={{
              backgroundColor: normalizeColor('brand-blue', theme),
              color: normalizeColor('brand-white', theme),
              borderColor: normalizeColor('brand-blue', theme),
            }}
            size="large"
          />
        </Box>
        <Box direction="row" justify="end" margin={{ bottom: isMobile ? 'medium' : 'small' }}>
          <StyledTextArea data-testid="fatalerror-stacktrace" readOnly rows={6} value={combinedStacktrace} />
        </Box>
        <Box align={isMobile ? 'stretch' : 'end'} margin={{ bottom: isMobile ? 'xlarge' : 'large' }}>
          <StyledButton
            onClick={() => copyError()}
            icon={<Copy size="18px" color={normalizeColor('brand-gray-extra-dark', theme)} />}
            label={
              !copied
                ? t('fatalError.copy', 'Copy error to clipboard')
                : t('fatalError.copied', 'Error copied to clipboard')
            }
            style={{
              backgroundColor: normalizeColor('brand-gray-medium', theme),
              color: normalizeColor('brand-gray-extra-dark', theme),
              borderColor: normalizeColor('brand-gray-medium', theme),
            }}
            size="large"
          />
        </Box>
        {runtimeIs === 'extension' && (
          <Box align={isMobile ? 'stretch' : 'end'} margin={{ bottom: isMobile ? 'xlarge' : 'large' }}>
            <StyledButton
              onClick={() => (window as any).chrome?.runtime?.reload()}
              icon={<Refresh size="22px" color={normalizeColor('brand-white', theme)} />}
              label={t('fatalError.reloadExtension', 'Reload extension')}
              style={{
                backgroundColor: normalizeColor('brand-blue', theme),
                color: normalizeColor('brand-white', theme),
                borderColor: normalizeColor('brand-blue', theme),
              }}
              size="large"
            />
          </Box>
        )}
        <Text size="small">
          <Trans
            i18nKey="fatalError.instruction"
            defaults="If the issue is not resolved after refreshing, please email our support team at  <Email/> and attached the error report."
            t={t}
            components={{
              Email: (
                <Anchor
                  href="mailto:wallet@oasisprotocol.org"
                  label="wallet@oasisprotocol.org"
                  style={{ color: normalizeColor('brand-blue', theme) }}
                ></Anchor>
              ),
            }}
          />
        </Text>
      </Box>
    </ResponsiveLayer>
  )
}
