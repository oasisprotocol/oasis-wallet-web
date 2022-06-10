/**
 *
 * AccountPage
 *
 */
import { TransactionModal } from 'app/components/TransactionModal'
import { TransitionRoute } from 'app/components/TransitionRoute'
import { selectSelectedNetwork } from 'app/state/network/selectors'
import { useStakingSlice } from 'app/state/staking'
import { selectStaking } from 'app/state/staking/selectors'
import { selectTransaction } from 'app/state/transaction/selectors'
import { walletActions } from 'app/state/wallet'
import { Box, Layer, Spinner, Text } from 'grommet'
import * as React from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Switch, useLocation, useParams } from 'react-router-dom'
import { TransitionGroup } from 'react-transition-group'

import { useAccountSlice } from '../../state/account'
import { selectAccount } from '../../state/account/selectors'
import { BalanceDetails } from '../../state/account/types'
import { selectAddress, selectStatus, selectWallets, selectType } from '../../state/wallet/selectors'
import { ActiveDelegationList } from '../StakingPage/Features/DelegationList/ActiveDelegationList'
import { DebondingDelegationList } from '../StakingPage/Features/DelegationList/DebondingDelegationList'
import { ValidatorList } from '../StakingPage/Features/ValidatorList'
import { AccountDetails } from './Features/AccountDetails'
import { AccountSummary } from './Features/AccountSummary'

interface NavItemProps {
  label: string
  route: string
}

const NavItem = (props: NavItemProps) => {
  const route = props.route
  const label = props.label

  const location = useLocation()
  const isActive = route && route === location.pathname

  return (
    <NavLink to={route}>
      <Box
        pad="xsmall"
        // onClick={() => {}} hoverIndicator={{ color: 'background-oasis-blue' }}
      >
        <Box
          border={{ side: 'bottom', color: isActive ? 'oasisBlue2' : 'background-contrast-2', size: '2px' }}
          pad={{ bottom: 'xxsmall', horizontal: 'xxsmall' }}
        >
          {label}
        </Box>
      </Box>
    </NavLink>
  )
}

interface Props {}

interface AccountPageParams {
  address: string
}

export function AccountPage(props: Props) {
  const { t } = useTranslation()
  const accountActions = useAccountSlice().actions
  const stakeActions = useStakingSlice().actions

  const { address } = useParams<AccountPageParams>()
  const dispatch = useDispatch()

  const account = useSelector(selectAccount)
  const stake = useSelector(selectStaking)

  const walletIsOpen = useSelector(selectStatus)
  const walletAddress = useSelector(selectAddress)
  const walletType = useSelector(selectType)
  const selectedNetwork = useSelector(selectSelectedNetwork)
  const { active } = useSelector(selectTransaction)
  const wallets = useSelector(selectWallets)

  const balanceDelegations = stake.delegations.reduce((acc, v) => acc + Number(v.amount), 0)
  const balanceDebondingDelegations = stake.debondingDelegations.reduce((acc, v) => acc + Number(v.amount), 0)
  const balance: BalanceDetails = {
    available: account.liquid_balance ?? 0,
    delegations: balanceDelegations, //@TODO oasis-explorer : account.debonding_delegations_balance ?? 0,
    debonding: balanceDebondingDelegations, //@TODO oasis-explorer : account.delegations_balance ?? 0,
    total: (account.liquid_balance ?? 0) + balanceDelegations + balanceDebondingDelegations,
  }

  // Reload account balances if address or network changes
  useEffect(() => {
    dispatch(accountActions.fetchAccount({address,type:walletType}))
    dispatch(stakeActions.fetchAccount(address))
    return () => {
      dispatch(accountActions.clearAccount())
    }
  }, [dispatch, accountActions, stakeActions, address, selectedNetwork])

  // Reload wallet balances if network changes
  useEffect(() => {
    for (const wallet of Object.values(wallets)) {
      dispatch(walletActions.fetchWallet(wallet))
    }
  }, [dispatch, wallets, selectedNetwork])

  return (
    <Box pad="small">
      {active && <TransactionModal />}
      {(stake.loading || account.loading) && (
        <Layer position="center" responsive={false}>
          <Box pad="medium" gap="medium" direction="row" align="center" background="background-front">
            <Spinner size="medium" />
            <Text size="large">{t('account.loading', 'Loading account')}</Text>
          </Box>
        </Layer>
      )}
      {account.accountError && (
        <p>
          {t('account.loadingError', "Couldn't load account. Information may be missing or out of date.")}{' '}
          {account.accountError}
        </p>
      )}
      {address && address !== '' && (
        <>
          <AccountSummary
            address={address}
            balance={balance}
            walletAddress={walletAddress}
            walletIsOpen={walletIsOpen}
          />
          <Box background="background-front" margin={{ vertical: 'small' }} direction="row" gap="small" wrap>
            <NavItem
              route={`/account/${address}`}
              label={t('account.subnavigation.transactions', 'Transactions')}
            />
            <NavItem
              route={`/account/${address}/active-delegations`}
              label={t('account.subnavigation.activeDelegations', 'Active delegations ({{count}})', {
                count: stake.delegations.length,
              })}
            />
            <NavItem
              route={`/account/${address}/debonding-delegations`}
              label={t('account.subnavigation.debondingDelegations', 'Debonding delegations ({{count}})', {
                count: stake.debondingDelegations.length,
              })}
            />
          </Box>
          <TransitionGroup>
            <Switch>
              <TransitionRoute exact path="/account/:address" component={AccountDetails} />
              <TransitionRoute exact path="/account/:address/stake" component={ValidatorList} />
              <TransitionRoute
                exact
                path="/account/:address/active-delegations"
                component={ActiveDelegationList}
              />
              <TransitionRoute
                exact
                path="/account/:address/debonding-delegations"
                component={DebondingDelegationList}
              />
            </Switch>
          </TransitionGroup>
        </>
      )}
    </Box>
  )
}
