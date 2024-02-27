import { importAccountsActions } from 'app/state/importaccounts'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Heading } from 'grommet/es6/components/Heading'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { ImportAccountsSelectionModal } from 'app/pages/OpenWalletPage/Features/ImportAccountsSelectionModal'
import { selectShowAccountsSelectionModal } from 'app/state/importaccounts/selectors'
import { Header } from 'app/components/Header'
import { WalletType } from 'app/state/wallet/types'

export function FromUsbLedger() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const showAccountsSelectionModal = useSelector(selectShowAccountsSelectionModal)

  return (
    <Box
      background="background-front"
      margin="small"
      pad="medium"
      round="5px"
      border={{ color: 'background-front-border', size: '1px' }}
    >
      <Header>{t('openWallet.ledger.header', 'Open from Ledger device')}</Header>

      <Heading level="3" margin="0">
        {t('ledger.instructionSteps.header', 'Steps:')}
      </Heading>
      <ol>
        <li>
          {t('ledger.instructionSteps.connectUsbLedger', 'Connect your USB Ledger device to the device')}
        </li>
        <li>{t('ledger.instructionSteps.closeLedgerLive', 'Close Ledger Live app on the device')}</li>
        <li>{t('ledger.instructionSteps.openOasisApp', 'Open the Oasis App on your Ledger device')}</li>
      </ol>
      <Box direction="row" margin={{ top: 'medium' }}>
        <Button
          type="submit"
          label={t('openWallet.importAccounts.selectWallets', 'Select accounts to open')}
          onClick={() => {
            dispatch(importAccountsActions.enumerateAccountsFromLedger(WalletType.UsbLedger))
          }}
          primary
        />
      </Box>
      {showAccountsSelectionModal && (
        <ImportAccountsSelectionModal
          abort={() => {
            dispatch(importAccountsActions.clear())
          }}
          type={WalletType.UsbLedger}
        />
      )}
    </Box>
  )
}
