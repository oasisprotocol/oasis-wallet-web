import { useWalletSlice } from 'app/state/wallet'
import { Box, Form, Heading, Paragraph, FormField, Button, TextInput, Tip } from 'grommet'
import { View, Hide } from 'grommet-icons/icons'
import * as React from 'react'
import { useDispatch } from 'react-redux'
import { OasisKey } from 'app/lib/key'
import { base64ToUint, uint2hex } from 'app/lib/helpers'
import { useTranslation } from 'react-i18next'
import * as EthUtils from 'ethereumjs-util'
import * as oasis from '@oasisprotocol/client'
import * as oasisRT from '@oasisprotocol/client-rt'

interface Props {}

const parseKey = (key: string) => {
  try {
    const keyWithoutEnvelope = key
      .replace(/\n/gm, '')
      .replace(/ /g, '')
      .replace(/^-----.*?-----/, '')
      .replace(/-----.*?-----$/, '')

    const key_bytes = base64ToUint(keyWithoutEnvelope)
    return OasisKey.fromPrivateKey(key_bytes)
  } catch (e) {
    throw e
  }
}

export async function getEvmBech32Address(evmAddress: any) {
  if (!evmAddress) {
    return ''
  }
  let newEvmAddress = evmAddress
  if (newEvmAddress.indexOf('0x') === 0) {
    newEvmAddress = newEvmAddress.substr(2)
  }
  const evmBytes = oasis.misc.fromHex(newEvmAddress)
  let address = await oasis.address.fromData(
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_IDENTIFIER,
    oasisRT.address.V0_SECP256K1ETH_CONTEXT_VERSION,
    evmBytes,
  )
  const bech32Address = oasisRT.address.toBech32(address)
  return bech32Address
}
export function FromEthereumPrivateKey(props: Props) {
  const { t } = useTranslation()
  const walletActions = useWalletSlice().actions
  const dispatch = useDispatch()

  const [privateKey, setPrivateKey] = React.useState('')
  const [privateKeyIsValid, setPrivateKeyIsValid] = React.useState(true)
  const [privateKeyIsVisible, setPrivateKeyIsVisible] = React.useState(false)

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => setPrivateKey(event.target.value)
  const onSubmit = () => {

    const priKey = '7c0280a2967ba774899b2641e46f0ba71f5008b4b381b0231751b08e9b851a78'

    let priBuffer = Buffer.from(priKey.replace('0x', ''), 'hex')

    let isValid = EthUtils.isValidPrivate(priBuffer)
    if (!isValid) {
      throw new Error('privateError')
    }
    let publicKeyBuffer = EthUtils.privateToPublic(priBuffer)
    let publicKeyHex = publicKeyBuffer.toString('hex')
    //let publicKey = EthUtils.addHexPrefix(publicKeyHex)
    const publicKey = publicKeyHex

    let addressBuffer = EthUtils.privateToAddress(priBuffer)
    let addressHex = addressBuffer.toString('hex')
    let address = EthUtils.addHexPrefix(addressHex)
    let walletAddress = EthUtils.toChecksumAddress(address)

    // TODO: move getEvmBech32Address to saga
    /*let oasisAddress = await */ getEvmBech32Address(walletAddress).then(oasisAddress => {
      const tmp = {
        privKey_hex: priKey,
        publicKey,
        address: oasisAddress,
        evmAddress: walletAddress,
      }
      console.log({tmp})

      setPrivateKeyIsValid(true)
      dispatch(walletActions.openWalletFromEthereumPrivateKey(tmp/*oasisAddress*/))

    })
    //TODO: catch

    /*try {
      const secret = parseKey(privateKey)
      setPrivateKeyIsValid(true)
      dispatch(walletActions.openWalletFromPrivateKey(uint2hex(secret)))
    } catch (e) {
      setPrivateKeyIsValid(false)
    }*/
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
