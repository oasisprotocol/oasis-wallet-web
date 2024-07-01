import { useContext } from 'react'
import { useSelector } from 'react-redux'
import { Box } from 'grommet/es6/components/Box'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { selectHasAccounts } from 'app/state/wallet/selectors'
import { MobileFooterNavigation } from '../MobileFooterNavigation'
import { Footer } from '.'

export const PageFooter = () => {
  const isMobile = useContext(ResponsiveContext) === 'small'
  const isDesktop = useContext(ResponsiveContext) === 'large'
  const walletHasAccounts = useSelector(selectHasAccounts)

  return (
    <>
      {walletHasAccounts && isMobile && (
        <Box pad="xlarge">
          <MobileFooterNavigation />
        </Box>
      )}
      {/* Footer for opened wallet is rendered in Settings tab in Profile dropdown */}
      {((walletHasAccounts && isDesktop) || !walletHasAccounts) && <Footer />}
    </>
  )
}
