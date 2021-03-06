/**
 *
 * AccountPage
 *
 */
import { AlertBox } from 'app/components/AlertBox'
import { ErrorFormatter } from 'app/components/ErrorFormatter'
import { TransactionModal } from 'app/components/TransactionModal'
import { TransitionRoute } from 'app/components/TransitionRoute'
import { selectSelectedNetwork } from 'app/state/network/selectors'
import { stakingActions } from 'app/state/staking'
import { selectStaking } from 'app/state/staking/selectors'
import { selectTransaction } from 'app/state/transaction/selectors'
import { walletActions } from 'app/state/wallet'
import { Box, Layer, Nav, ResponsiveContext, Spinner, Text } from 'grommet'
import * as React from 'react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, Switch, useParams } from 'react-router-dom'
import { TransitionGroup } from 'react-transition-group'
import styled from 'styled-components'
import { normalizeColor } from 'grommet/utils'

import { accountActions } from '../../state/account'
import { selectAccount } from '../../state/account/selectors'
import { BalanceDetails } from '../../state/account/types'
import {
  selectAddress,
  selectIsOpen,
  selectWallets,
  selectWalletsPublicKeys,
} from '../../state/wallet/selectors'
import { ActiveDelegationList } from '../StakingPage/Features/DelegationList/ActiveDelegationList'
import { DebondingDelegationList } from '../StakingPage/Features/DelegationList/DebondingDelegationList'
import { ValidatorList } from '../StakingPage/Features/ValidatorList'
import { AccountDetails } from './Features/AccountDetails'
import { AccountSummary } from './Features/AccountSummary'

const StyledNavItem = styled(NavLink)`
  display: flex;
  position: relative;
  padding: ${({ theme }) => theme.global?.edgeSize?.small};

  :hover {
    background-color: ${({ theme }) => `${normalizeColor('background-contrast', theme)}`};
  }

  &.active {
    background-color: ${({ theme }) => `${normalizeColor('background-back', theme)}`};
  }
`

interface NavItemProps {
  counter?: number
  label: string
  route: string
}

const NavItem = ({ counter, label, route }: NavItemProps) => {
  return (
    <StyledNavItem exact to={route}>
      <Text>{label}</Text>
      {!!counter && (
        <Box
          style={{ position: 'absolute', top: '-3px', right: '-5px' }}
          responsive={false}
          background="brand"
          pad={{ horizontal: 'xsmall' }}
          round
        >
          <Text size="small" weight="bold">
            {counter}
          </Text>
        </Box>
      )}
    </StyledNavItem>
  )
}

interface Props {}

interface AccountPageParams {
  address: string
}

export function AccountPage(props: Props) {
  const { t } = useTranslation()
  const isMobile = React.useContext(ResponsiveContext) === 'small'
  const { address } = useParams<AccountPageParams>()
  const dispatch = useDispatch()

  const account = useSelector(selectAccount)
  const stake = useSelector(selectStaking)

  const walletIsOpen = useSelector(selectIsOpen)
  const walletAddress = useSelector(selectAddress)
  const selectedNetwork = useSelector(selectSelectedNetwork)
  const { active } = useSelector(selectTransaction)
  const wallets = useSelector(selectWallets)
  const walletsPublicKeys = useSelector(selectWalletsPublicKeys)

  const balanceDelegations = stake.delegations?.reduce((acc, v) => acc + Number(v.amount), 0) ?? null
  const balanceDebondingDelegations =
    stake.debondingDelegations?.reduce((acc, v) => acc + Number(v.amount), 0) ?? null
  const balance: BalanceDetails = {
    available: account.available,
    delegations: balanceDelegations, //@TODO oasis-explorer : account.debonding_delegations_balance ?? 0,
    debonding: balanceDebondingDelegations, //@TODO oasis-explorer : account.delegations_balance ?? 0,
    total:
      account.available == null || balanceDelegations == null || balanceDebondingDelegations == null
        ? null
        : account.available + balanceDelegations + balanceDebondingDelegations,
  }

  // Reload account balances if address or network changes
  useEffect(() => {
    dispatch(accountActions.fetchAccount(address))
    dispatch(stakingActions.fetchAccount(address))
    return () => {
      dispatch(accountActions.clearAccount())
    }
  }, [dispatch, address, selectedNetwork])

  // Reload wallet balances if network changes
  useEffect(() => {
    for (const wallet of Object.values(wallets)) {
      dispatch(walletActions.fetchWallet(wallet))
    }
    // Using `walletsPublicKeys` dependency instead of `wallets` to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, walletsPublicKeys.join(','), selectedNetwork])

  return (
    <Box pad="small">
      {active && <TransactionModal />}
      {(stake.loading || account.loading) && (
        <Layer modal background="background-front" responsive={false}>
          <Box pad="medium" gap="medium" direction="row" align="center">
            <Spinner size="medium" />
            <Text size="large">{t('account.loading', 'Loading account')}</Text>
          </Box>
        </Layer>
      )}
      {account.accountError && (
        <AlertBox color="status-error">
          {t('account.loadingError', "Couldn't load account.")}{' '}
          <ErrorFormatter code={account.accountError.code} message={account.accountError.message} />
        </AlertBox>
      )}
      {stake.updateDelegationsError && (
        <AlertBox color="status-error">
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
            walletAddress={walletAddress}
            walletIsOpen={walletIsOpen}
          />
          <Nav
            background="background-front"
            justify={isMobile ? 'evenly' : 'start'}
            margin={{ vertical: 'small' }}
            direction="row"
            gap="none"
            wrap
          >
            <NavItem
              label={t('account.subnavigation.transactions', 'Transactions')}
              route={`/account/${address}`}
            />

            <NavItem
              counter={stake.delegations?.length}
              label={
                isMobile
                  ? t('account.subnavigation.mobileActiveDelegations', 'Delegations')
                  : t('account.subnavigation.activeDelegations', 'Active delegations')
              }
              route={`/account/${address}/active-delegations`}
            />

            <NavItem
              counter={stake.debondingDelegations?.length}
              label={
                isMobile
                  ? t('account.subnavigation.mobileDebondingDelegations', 'Debonding')
                  : t('account.subnavigation.debondingDelegations', 'Debonding delegations')
              }
              route={`/account/${address}/debonding-delegations`}
            />
          </Nav>
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
