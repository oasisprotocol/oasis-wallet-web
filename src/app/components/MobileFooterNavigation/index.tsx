import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import { LineChart } from 'grommet-icons/es6/icons/LineChart'
import { Inherit } from 'grommet-icons/es6/icons/Inherit'
import { Money } from 'grommet-icons/es6/icons/Money'
import { CreditCard } from 'grommet-icons/es6/icons/CreditCard'
import styled from 'styled-components'
import { normalizeColor } from 'grommet/es6/utils'
import { NavLink, useLocation } from 'react-router-dom'
import { selectAddress } from 'app/state/wallet/selectors'
import { useParaTimesNavigation } from 'app/pages/ParaTimesPage/useParaTimesNavigation'
import { IS_FIAT_ONRAMP_ENABLED } from '../../pages/FiatOnrampPage/isEnabled'
import { mobileFooterNavigationHeight } from '../../../styles/theme/elementSizes'
// eslint-disable-next-line no-restricted-imports
import type { Icon } from 'grommet-icons/es6/icons'

const StyledMobileFooterNavigation = styled.nav`
  background-color: ${({ theme }) => normalizeColor('background-front', theme)};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: ${mobileFooterNavigationHeight};
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  box-shadow: ${({ theme }) =>
    `0px 0px ${theme.global?.borderSize?.xsmall} ${normalizeColor('background-front-border', theme)}`};
  border-top: ${({ theme }) =>
    `solid ${theme.global?.borderSize?.xsmall} ${normalizeColor('background-contrast', theme)}`};
  flex-direction: row;
`

const StyledNavLink = styled(NavLink)`
  // Make items equal width
  flex-grow: 1;
  flex-basis: 0;
  &:hover {
    background-color: ${({ theme }) => normalizeColor('background-contrast', theme)};
  }
`

export const MobileFooterNavigation = () => {
  const { t } = useTranslation()
  const address = useSelector(selectAddress)
  const { getParaTimesRoutePath, paraTimesRouteLabel } = useParaTimesNavigation()
  const getMenuItems = useMemo(() => {
    const menuItems = [
      {
        label: t('menu.wallet', 'ROSE Wallet'),
        Icon: Money,
        to: `/account/${address}`,
      },
      {
        label: t('menu.stake-mobile', 'Stake'),
        Icon: LineChart,
        to: `/account/${address}/stake`,
      },
      {
        label: paraTimesRouteLabel,
        Icon: Inherit,
        to: getParaTimesRoutePath(address!),
      },
      ...(IS_FIAT_ONRAMP_ENABLED
        ? [
            {
              label: t('menu.fiatOnramp-mobile', 'Buy'),
              Icon: CreditCard,
              to: `/account/${address}/fiat`,
            },
          ]
        : []),
    ]
    return menuItems
  }, [address, getParaTimesRoutePath, paraTimesRouteLabel, t])

  return (
    <StyledMobileFooterNavigation data-testid="mobile-footer-navigation">
      {getMenuItems.map(({ label, Icon, to }) => (
        <MobileFooterButton key={to} label={label} Icon={Icon} to={to} />
      ))}
    </StyledMobileFooterNavigation>
  )
}

function MobileFooterButton({ label, Icon, to }: { label: string; Icon: Icon; to: string }) {
  const location = useLocation()
  const isActive = to === location.pathname

  return (
    <StyledNavLink to={to}>
      <Box
        as="span"
        justify="center"
        align="center"
        fill="vertical"
        background={isActive ? 'control' : undefined}
        gap="small"
      >
        <Icon />
        <Text size="small" textAlign="center" style={{ lineHeight: 1 }}>
          {label}
        </Text>
      </Box>
    </StyledNavLink>
  )
}
