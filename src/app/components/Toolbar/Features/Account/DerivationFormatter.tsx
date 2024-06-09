import { WalletType } from 'app/state/wallet/types'
import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import { useTranslation } from 'react-i18next'

export interface DerivationFormatterProps {
  type: WalletType
  pathDisplay: string | undefined
}

export const DerivationFormatter = (props: DerivationFormatterProps) => {
  const { t } = useTranslation()
  const walletTypes: { [type in WalletType]: string } = {
    [WalletType.UsbLedger]: t('toolbar.wallets.type.usbLedger', 'USB Ledger'),
    [WalletType.BleLedger]: t('toolbar.wallets.type.bluetoothLedger', 'Bluetooth Ledger'),
    [WalletType.Mnemonic]: t('toolbar.wallets.type.mnemonic', 'Mnemonic'),
    [WalletType.PrivateKey]: t('toolbar.wallets.type.privateKey', 'Private key'),
  }
  return (
    <Box align="start" direction="row">
      {walletTypes[props.type]} {props.pathDisplay && <Text size="80%">({props.pathDisplay})</Text>}
    </Box>
  )
}
