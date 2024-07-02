/**
 *
 * AccountPage
 *
 */
import { AlertBox } from 'app/components/AlertBox'
import { ErrorFormatter } from 'app/components/ErrorFormatter'
import { TransactionModal } from 'app/components/TransactionModal'
import { selectSelectedNetwork } from 'app/state/network/selectors'
import { selectStaking } from 'app/state/staking/selectors'
import { selectTransaction } from 'app/state/transaction/selectors'
import { Box } from 'grommet/es6/components/Box'
import { Layer } from 'grommet/es6/components/Layer'
import { Spinner } from 'grommet/es6/components/Spinner'
import { Text } from 'grommet/es6/components/Text'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useParams } from 'react-router-dom'

import { accountActions } from 'app/state/account'
import { selectAccount } from 'app/state/account/selectors'
import { BalanceDetails } from 'app/state/account/types'
import { selectActiveWallet, selectHasAccounts, selectHasOneAccount } from 'app/state/wallet/selectors'
import { walletActions } from 'app/state/wallet'
import { AccountSummary } from './Features/AccountSummary'
import { AccountPageParams } from './validateAccountPageRoute'

interface AccountPageProps {}

export function AccountPage(props: AccountPageProps) {
  const { t } = useTranslation()
  const address = useParams<keyof AccountPageParams>().address!
  const dispatch = useDispatch()

  const account = useSelector(selectAccount)
  const stake = useSelector(selectStaking)

  const walletHasAccounts = useSelector(selectHasAccounts)
  const wallet = useSelector(selectActiveWallet)
  const selectedNetwork = useSelector(selectSelectedNetwork)
  const { active } = useSelector(selectTransaction)
  const hasOneAccount = useSelector(selectHasOneAccount)
  const balanceDelegations = stake.delegations?.reduce((acc, v) => acc + BigInt(v.amount), 0n)
  const balanceDebondingDelegations = stake.debondingDelegations?.reduce(
    (acc, v) => acc + BigInt(v.amount),
    0n,
  )
  const balance: BalanceDetails = {
    available: account.available,
    delegations: balanceDelegations?.toString() ?? null, //@TODO oasis-explorer : account.debonding_delegations_balance ?? 0,
    debonding: balanceDebondingDelegations?.toString() ?? null, //@TODO oasis-explorer : account.delegations_balance ?? 0,
    total:
      account.available == null || balanceDelegations == null || balanceDebondingDelegations == null
        ? null
        : (BigInt(account.available) + balanceDelegations + balanceDebondingDelegations).toString(),
  }

  // Restart fetching account balances if address or network changes
  useEffect(() => {
    dispatch(accountActions.openAccountPage(address))
    return () => {
      dispatch(accountActions.closeAccountPage())
    }
  }, [dispatch, address, selectedNetwork])

  return (
    <Box pad="small">
      {active && <TransactionModal />}
      {(stake.loading || account.loading) && (
        <Layer modal background="background-front" responsive={false}>
          <Box pad="medium" gap="medium" direction="row" align="center" width="max-content">
            <Spinner size="medium" />
            <Text size="medium">{t('account.loading', 'Loading account')}</Text>
          </Box>
        </Layer>
      )}
      {account.accountError && (
        <AlertBox status="error">
          {t('account.loadingError', "Couldn't load account.")}{' '}
          <ErrorFormatter code={account.accountError.code} message={account.accountError.message} />
        </AlertBox>
      )}
      {stake.updateDelegationsError && (
        <AlertBox status="error">
          {t('delegations.loadingError', "Couldn't load delegations.")}{' '}
          <ErrorFormatter
            code={stake.updateDelegationsError.code}
            message={stake.updateDelegationsError.message}
          />
        </AlertBox>
      )}
      {address && address !== '' && (
        <>
          <AccountSummary
            address={address}
            balance={balance}
            deleteWallet={
              hasOneAccount && wallet
                ? undefined
                : (address: string) => {
                    dispatch(walletActions.deleteWallet(address))
                    wallet!.address === address && dispatch(walletActions.selectFirstWallet())
                  }
            }
            wallet={wallet}
            walletHasAccounts={walletHasAccounts}
          />
          <Box margin={{ bottom: 'small' }}></Box>
          <Outlet />
        </>
      )}
    </Box>
  )
}
