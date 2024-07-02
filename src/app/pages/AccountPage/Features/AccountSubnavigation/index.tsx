import { selectStaking } from 'app/state/staking/selectors'
import { Nav } from 'grommet/es6/components/Nav'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom'
import styled from 'styled-components'
import { normalizeColor } from 'grommet/es6/utils'

import { AccountPageParams } from '../../validateAccountPageRoute'
import { Button } from 'grommet/es6/components/Button'

const StyledNavItem = styled(NavLink)`
  padding: ${({ theme }) => theme.global?.edgeSize?.small};

  :hover {
    background-color: ${({ theme }) => normalizeColor('background-contrast', theme)};
  }

  &.active {
    background-color: ${({ theme }) => normalizeColor('background-back', theme)};
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.global?.breakpoints?.small?.value}px`}) {
    padding: ${({ theme }) => theme.global?.edgeSize?.xsmall};
  }
`

interface NavItemProps {
  counter?: number
  label: string
  route: string
}

const NavItem = ({ counter, label, route }: NavItemProps) => {
  return (
    <StyledNavItem end to={route}>
      <Button badge={counter} tabIndex={-1}>
        {label}
      </Button>
    </StyledNavItem>
  )
}

export function AccountSubnavigation() {
  const { t } = useTranslation()
  const isMobile = React.useContext(ResponsiveContext) === 'small'
  const address = useParams<keyof AccountPageParams>().address!
  const stake = useSelector(selectStaking)

  return (
    <Nav
      background="background-front"
      justify={isMobile ? 'evenly' : 'start'}
      margin={{ bottom: 'small' }}
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
  )
}
