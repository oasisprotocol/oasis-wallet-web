/**
 *
 * TransactionHistory
 *
 */
import { Transaction } from 'app/components/Transaction'
import { Box } from 'grommet/es6/components/Box'
import { Heading } from 'grommet/es6/components/Heading'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import {
  hasAccountUnknownPendingTransactions,
  selectAccountAddress,
  selectAccountIsLoading,
  selectPendingTransactionForAccount,
  selectTransactions,
  selectTransactionsError,
} from 'app/state/account/selectors'
import { selectSelectedNetwork } from 'app/state/network/selectors'
import { ErrorFormatter } from 'app/components/ErrorFormatter'
import { AlertBox } from '../../../../components/AlertBox'
import { Anchor } from 'grommet/es6/components/Anchor'
import { Text } from 'grommet/es6/components/Text'
import { FormNext } from 'grommet-icons/es6/icons/FormNext'
import { config } from '../../../../../config'
import { backend } from '../../../../../vendors/backend'

/**
 * Displays the past transactions from the state for a given account
 */
export function TransactionHistory() {
  const { t } = useTranslation()
  const allTransactions = useSelector(selectTransactions)
  const transactionsError = useSelector(selectTransactionsError)
  const address = useSelector(selectAccountAddress)
  const accountIsLoading = useSelector(selectAccountIsLoading)
  const pendingTransactions = useSelector(selectPendingTransactionForAccount)
  const hasUnknownPendingTransactions = useSelector(hasAccountUnknownPendingTransactions)
  const network = useSelector(selectSelectedNetwork)
  const backendLinks = config[network][backend()]
  const transactionComponents = allTransactions.map(t => (
    <Transaction key={t.hash} transaction={t} referenceAddress={address} network={network} />
  ))
  const pendingTransactionComponents = pendingTransactions
    .filter(({ hash: pendingTxHash }) => !allTransactions.some(({ hash }) => hash === pendingTxHash))
    .map(t => <Transaction key={t.hash} transaction={t} referenceAddress={address} network={network} />)

  const showPendingSection = !accountIsLoading && !!address

  return (
    <Box margin="none">
      {transactionsError && (
        <p>
          {t('account.transaction.loadingError', `Couldn't load transactions.`)}{' '}
          <ErrorFormatter code={transactionsError.code} message={transactionsError.message} />
        </p>
      )}
      {/* eslint-disable no-restricted-syntax */}
      {showPendingSection && (!!pendingTransactionComponents.length || hasUnknownPendingTransactions) && (
        <>
          <Heading level="3">{t('account.summary.pendingTransactions', 'Pending transactions')}</Heading>
          <AlertBox
            status="ok-weak"
            justify="between"
            endSlot={
              <span>
                {backendLinks.blockExplorerAccount && (
                  <Anchor
                    href={backendLinks.blockExplorerAccount.replace(
                      '{{address}}',
                      encodeURIComponent(address),
                    )}
                    target="_blank"
                    rel="noopener"
                    color="brand"
                    style={{ verticalAlign: 'middle' }}
                  >
                    <Text size="xsmall">
                      {t('account.summary.viewAccountTxs', 'View account transactions')}
                    </Text>
                    <FormNext color="brand" size="20px" />
                  </Anchor>
                )}
              </span>
            }
          >
            {t(
              'account.summary.someTxsInPendingState',
              'Some transactions are currently in a pending state.',
            )}
          </AlertBox>
          {!!pendingTransactionComponents.length && (
            <Box gap="medium" data-testid="pending-txs" margin={{ top: 'small' }}>
              {pendingTransactionComponents}
            </Box>
          )}
          <Heading level="3">{t('account.summary.activity', 'Activity')}</Heading>
        </>
      )}
      {/* eslint-enable no-restricted-syntax */}
      {allTransactions.length ? (
        <Box gap="medium" margin="none" data-testid="completed-txs">
          {transactionComponents}
        </Box>
      ) : (
        <Box
          round="5px"
          border={{ color: 'background-front-border', size: '1px' }}
          background="background-front"
          pad="large"
        >
          <Heading level="3">{t('account.summary.noTransactionFound', 'No transactions found.')}</Heading>
        </Box>
      )}
    </Box>
  )
}
