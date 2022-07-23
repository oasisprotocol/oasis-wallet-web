/**
 *
 * Toolbar
 *
 */
import { selectIsOpen } from 'app/state/wallet/selectors'
import { Box, ResponsiveContext } from 'grommet'
import styled from 'styled-components'
import * as React from 'react'
import { useSelector } from 'react-redux'

import { AccountSelectorButton } from './Features/AccountSelectorButton'
import { NetworkSelector } from './Features/NetworkSelector'
import { mobileHeaderZIndex } from '../Sidebar'

const toolbarZIndex = mobileHeaderZIndex + 1
const StyledToolbar = styled(Box)`
  @media only screen and (min-width: ${({ theme }) => `${theme.global?.breakpoints?.small?.value}px`}) {
    padding: ${({ theme }) => `${theme.global?.edgeSize?.small} ${theme.global?.edgeSize?.small} 0`};
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.global?.breakpoints?.small?.value}px`}) {
    position: fixed;
    top: 0;
    right: 0;
    z-index: ${toolbarZIndex};
    padding: ${({ theme }) => theme.global?.breakpoints?.small?.edgeSize?.small};
  }
`

export function Toolbar() {
  const isOpen = useSelector(selectIsOpen)
  const isMobile = React.useContext(ResponsiveContext) === 'small'

  return (
    <StyledToolbar direction="row" gap="small" justify="end">
      <Box
        background={isMobile ? 'transparent' : 'background-front'}
        justify="end"
        round="5px"
        border={{ color: 'background-front-border', size: isMobile ? 'none' : 'xsmall' }}
      >
        <NetworkSelector />
      </Box>

      {isOpen && (
        <Box justify="center" data-testid="account-selector">
          <AccountSelectorButton />
        </Box>
      )}
    </StyledToolbar>
  )
}
