import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { AlertBox } from 'app/components/AlertBox'
import { ErrorFormatter } from 'app/components/ErrorFormatter'
import { ModalSplitHeader } from 'app/components/Header'
import { ImportAccountsStepFormatter } from 'app/components/ImportAccountsStepFormatter'
import { ResponsiveLayer } from 'app/components/ResponsiveLayer'
import { ImportableAccount } from 'app/components/Toolbar/Features/Account/ImportableAccount'
import { importAccountsActions } from 'app/state/importaccounts'
import {
  selectImportAccounts,
  selectImportAccountsOnCurrentPage,
  selectImportAccountsPageNumber,
  selectSelectedAccounts,
} from 'app/state/importaccounts/selectors'
import { ImportAccountsListAccount, ImportAccountsStep } from 'app/state/importaccounts/types'
import { walletActions } from 'app/state/wallet'
import { Box } from 'grommet/es6/components/Box'
import { Button } from 'grommet/es6/components/Button'
import { Form } from 'grommet/es6/components/Form'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Spinner } from 'grommet/es6/components/Spinner'
import { Text } from 'grommet/es6/components/Text'
import { numberOfAccountPages } from 'app/state/importaccounts/saga'
import { WalletType, LedgerWalletType } from 'app/state/wallet/types'
import { ChoosePasswordFields } from 'app/components/Persist/ChoosePasswordFields'
import { FormValue as ChoosePasswordFieldsFormValue } from 'app/components/Persist/ChoosePasswordInputFields'
import { preventSavingInputsToUserData } from 'app/lib/preventSavingInputsToUserData'

interface ImportAccountsSelectorSelectorProps {
  accounts: ImportAccountsListAccount[]
}

function ImportAccountsSelector({ accounts }: ImportAccountsSelectorSelectorProps) {
  const dispatch = useDispatch()
  const toggleAccount = (address: string) => dispatch(importAccountsActions.toggleAccount(address))

  return (
    <Box gap="small">
      {accounts.map(a => (
        <ImportableAccount account={a} onClick={toggleAccount} key={a.address} />
      ))}
    </Box>
  )
}

interface ImportAccountsSelectionModalProps {
  abort: () => void
  type: WalletType.Mnemonic | LedgerWalletType
}

interface FormValue extends ChoosePasswordFieldsFormValue {}

export function ImportAccountsSelectionModal(props: ImportAccountsSelectionModalProps) {
  const { t } = useTranslation()
  const size = useContext(ResponsiveContext)
  const importAccounts = useSelector(selectImportAccounts)
  const accounts = useSelector(selectImportAccountsOnCurrentPage)
  const pageNum = useSelector(selectImportAccountsPageNumber)
  const error = importAccounts.error
  const selectedAccounts = useSelector(selectSelectedAccounts)
  const dispatch = useDispatch()

  const openAccounts = ({ value }: { value: FormValue }) => {
    dispatch(
      props.type === WalletType.UsbLedger
        ? walletActions.openWalletsFromLedger({ choosePassword: value.password2 })
        : walletActions.openWalletFromMnemonic({ choosePassword: value.password2 }),
    )
  }

  const isBusyImporting = importAccounts.step !== ImportAccountsStep.Idle
  const cancelDisabled = isBusyImporting && !error
  const confirmDisabled = isBusyImporting || selectedAccounts.length === 0

  const canGoPrev = pageNum > 0 && !isBusyImporting && !error
  const canGoNext = pageNum < numberOfAccountPages - 1 && !isBusyImporting && !error

  const onPrev = () => {
    dispatch(importAccountsActions.setPage(pageNum - 1))
  }

  const onNext = () => {
    dispatch(importAccountsActions.setPage(pageNum + 1))
    if (props.type === WalletType.UsbLedger || props.type === WalletType.BleLedger) {
      dispatch(importAccountsActions.enumerateMoreAccountsFromLedger(props.type))
    }
  }

  // Workaround for i18next-scanner to pickup plurals correctly, because it is missing
  // defaultValue_zero, defaultValue_one, defaultValue_other here:
  // https://github.com/i18next/i18next-scanner/blob/4687b6a/src/parser.js#L502-L503
  t('openWallet.importAccounts.accountCounter_zero', 'No account selected')
  t('openWallet.importAccounts.accountCounter_one', 'One account selected')

  return (
    <ResponsiveLayer onEsc={props.abort} onClickOutside={props.abort} modal background="background-front">
      <Form<FormValue> onSubmit={openAccounts} {...preventSavingInputsToUserData}>
        <Box width="800px" pad="medium">
          <ModalSplitHeader
            side={t('openWallet.importAccounts.accountCounter', '{{count}} accounts selected', {
              count: selectedAccounts.length,
            })}
          >
            {t('openWallet.importAccounts.selectWallets', 'Select accounts to open')}
          </ModalSplitHeader>

          <Box style={{ minHeight: '362px' }}>
            <ImportAccountsSelector accounts={accounts} />
            {![ImportAccountsStep.Idle, ImportAccountsStep.LoadingBalances].includes(importAccounts.step) && (
              <Box direction="row" gap="medium" alignContent="center" pad={{ top: 'small' }}>
                <Spinner size="medium" />
                <Box alignSelf="center">
                  <Text size="xlarge">
                    <ImportAccountsStepFormatter step={importAccounts.step} />
                  </Text>
                </Box>
              </Box>
            )}
            {error && (
              <AlertBox status="error">
                <ErrorFormatter code={error.code} message={error.message} />
              </AlertBox>
            )}
          </Box>
          <Box direction="row" gap="large" justify="center" align="baseline" pad={{ top: 'medium' }}>
            <Button
              disabled={!canGoPrev}
              label={size === 'small' ? '<' : `< ${t('openWallet.importAccounts.prev', 'Prev')}`}
              size={'small'}
              a11yTitle={t('openWallet.importAccounts.prev', 'Prev')}
              onClick={onPrev}
            />
            <Box>
              <span>
                {t('openWallet.importAccounts.pageNumber', 'Page {{pageNum}} of {{totalPages}}', {
                  pageNum: importAccounts.accountsSelectionPageNumber + 1,
                  totalPages: numberOfAccountPages,
                })}
              </span>
            </Box>
            <Button
              disabled={!canGoNext}
              label={size === 'small' ? '>' : `${t('openWallet.importAccounts.next', 'Next')} >`}
              size={'small'}
              a11yTitle={t('openWallet.importAccounts.next', 'Next')}
              onClick={onNext}
            />
          </Box>
          <ChoosePasswordFields />
          <Box direction="row" gap="small" justify="between" pad={{ top: 'medium' }}>
            <Button
              secondary
              label={t('common.cancel', 'Cancel')}
              onClick={props.abort}
              disabled={cancelDisabled}
            />
            <Button
              type="submit"
              primary
              data-testid="ledger-open-accounts"
              label={t('openWallet.importAccounts.openWallets', 'Open')}
              disabled={confirmDisabled}
            />
          </Box>
        </Box>
      </Form>
    </ResponsiveLayer>
  )
}
