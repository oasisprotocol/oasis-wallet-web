import { useWalletSlice } from 'app/state/wallet'
import { Box, Form, Heading, Paragraph, FormField, Button, TextInput, Tip } from 'grommet'
import { View, Hide } from 'grommet-icons/icons'
import * as React from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import * as EthUtils from 'ethereumjs-util'

interface Props {}

export function FromEthereumPrivateKey(props: Props) {
  const { t } = useTranslation()
  const walletActions = useWalletSlice().actions
  const dispatch = useDispatch()

  const [privateKey, setPrivateKey] = React.useState('')
  const [privateKeyIsValid, setPrivateKeyIsValid] = React.useState(true)
  const [privateKeyIsVisible, setPrivateKeyIsVisible] = React.useState(false)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setPrivateKey(event.target.value)
  const onSubmit = () => {
    try {
      let priBuffer = Buffer.from(privateKey.replace('0x', ''), 'hex')
      let isValid = EthUtils.isValidPrivate(priBuffer)
      if (!isValid) {
        setPrivateKeyIsValid(false)
        return
      }
      setPrivateKeyIsValid(true)
      const tmp = {priBuffer, privateKey}
      console.log({tmp})
      dispatch(walletActions.openWalletFromEthereumPrivateKey(tmp))
    } catch {
      setPrivateKeyIsValid(false)
    }
  }

  return (
    <Box
      background="background-front"
      margin="small"
      pad="medium"
      round="5px"
      border={{ color: 'background-front-border', size: '1px' }}
    >
      <Form>
        <Heading margin="0">
          {t('openWallet.ethereumPrivateKey.header', 'Enter your Ethereum-compatible private key')}
        </Heading>
        <Paragraph>
          <label htmlFor="privatekey">
            {t('openWallet.ethereumPrivateKey.instruction', 'Enter your Ethereum-compatible private key.')}
          </label>
        </Paragraph>
        <FormField
          htmlFor="privateKey"
          error={privateKeyIsValid === false ? t('openWallet.privateKey.error', 'Invalid private key') : ''}
          border
          contentProps={{ border: privateKeyIsValid ? false : 'bottom' }}
          round="small"
          width="xlarge"
        >
          <Box direction="row" align="center">
            <TextInput
              id="privatekey"
              data-testid="privatekey"
              placeholder={t('openWallet.privateKey.enterPrivateKeyHere', 'Enter your private key here')}
              value={privateKey}
              onChange={onChange}
              type={privateKeyIsVisible ? 'text' : 'password'}
              plain
            />
            <Tip
              content={
                privateKeyIsVisible
                  ? t('openWallet.privateKey.hidePrivateKey', 'Hide private key')
                  : t('openWallet.privateKey.showPrivateKey', 'Show private key')
              }
            >
              <Button
                onClick={() => setPrivateKeyIsVisible(!privateKeyIsVisible)}
                icon={privateKeyIsVisible ? <View /> : <Hide />}
              />
            </Tip>
          </Box>
        </FormField>
        <Box pad={{ vertical: 'medium' }}>
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <Button
              type="submit"
              label={t('openWallet.mnemonic.import', 'Import my account')}
              style={{ borderRadius: '4px' }}
              primary
              onClick={onSubmit}
            />
          </Box>
        </Box>
      </Form>
    </Box>
  )
}
