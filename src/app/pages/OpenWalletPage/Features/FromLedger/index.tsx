import { Box } from 'grommet/es6/components/Box'
import React, { useEffect } from 'react'
import { Header } from 'app/components/Header'
import { ButtonLink } from '../../../../components/ButtonLink'
import { Button } from 'grommet/es6/components/Button'
import { Text } from 'grommet/es6/components/Text'
import { canAccessBle, canAccessNavigatorUsb } from '../../../../lib/ledger'
import { useTranslation } from 'react-i18next'

type SelectOpenMethodProps = {
  webExtensionLedgerAccess?: () => void
  disableBluetoothLedger?: boolean
}

export function FromLedger({ webExtensionLedgerAccess, disableBluetoothLedger }: SelectOpenMethodProps) {
  const { t } = useTranslation()
  const [supportsUsbLedger, setSupportsUsbLedger] = React.useState<boolean | undefined>(true)
  const [supportsBleLedger, setSupportsBleLedger] = React.useState<boolean | undefined>(true)

  useEffect(() => {
    async function getLedgerSupport() {
      const usbLedgerSupported = await canAccessNavigatorUsb()
      const bleLedgerSupported = !disableBluetoothLedger && (await canAccessBle())

      setSupportsUsbLedger(usbLedgerSupported)
      setSupportsBleLedger(bleLedgerSupported)
    }

    getLedgerSupport()
  }, [disableBluetoothLedger])

  return (
    <Box
      round="5px"
      border={{ color: 'background-front-border', size: '1px' }}
      background="background-front"
      margin="small"
      pad="medium"
    >
      <Header>
        {t('openWallet.importAccounts.connectDeviceHeader', 'How do you want to connect your Ledger device?')}
      </Header>

      <Box direction="row-responsive" justify="start" margin={{ top: 'medium' }} gap="medium">
        <div>
          <div>
            {webExtensionLedgerAccess ? (
              <Button
                disabled={!supportsUsbLedger}
                style={{ width: 'fit-content' }}
                onClick={webExtensionLedgerAccess}
                label={t('ledger.extension.grantAccess', 'Grant access to your USB Ledger')}
                primary
              />
            ) : (
              <span>
                <ButtonLink
                  disabled={!supportsUsbLedger}
                  to="usb"
                  label={t('openWallet.importAccounts.usbLedger', 'USB Ledger')}
                  primary
                />
              </span>
            )}
          </div>
          {!supportsUsbLedger && (
            <Text size="small" textAlign="center">
              {t(
                'errors.usbTransportNotSupported',
                'Your browser does not support WebUSB (e.g. Firefox). Try using Chrome.',
              )}
            </Text>
          )}
        </div>
        <div>
          <div>
            <ButtonLink
              disabled={!supportsBleLedger}
              to="ble"
              label={t('openWallet.importAccounts.bluetoothLedger', 'Bluetooth Ledger')}
              primary
            />
          </div>
          {!supportsBleLedger && (
            <Text size="small" textAlign="center">
              {t('errors.bluetoothTransportNotSupported', 'Your device does not support Bluetooth.')}
            </Text>
          )}
        </div>
      </Box>
    </Box>
  )
}
