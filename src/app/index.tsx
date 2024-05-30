/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */
import { Box } from 'grommet/es6/components/Box'
import { Main } from 'grommet/es6/components/Main'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import * as React from 'react'
import { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { FatalErrorHandler } from './components/FatalErrorHandler'
import { PageFooter } from './components/Footer/PageFooter'
import { Navigation } from './components/Sidebar'
import { Toolbar } from './components/Toolbar'
import { ModalProvider } from './components/Modal'
import { useRouteRedirects } from './useRouteRedirects'
import { PersistLoadingGate } from 'app/components/Persist/PersistLoadingGate'
import { UnlockGate } from 'app/components/Persist/UnlockGate'
import { BuildBanner } from 'app/components/BuildBanner'
import { IonicNativePlatformProvider } from './components/Ionic/components/IonicNativePlatformProvider'

export function App() {
  useRouteRedirects()
  const { i18n } = useTranslation()
  const isMobile = useContext(ResponsiveContext) === 'small'

  return (
    <FatalErrorHandler>
      <IonicNativePlatformProvider>
        <ModalProvider>
          <Helmet
            titleTemplate="%s - ROSE Wallet"
            defaultTitle="ROSE Wallet"
            htmlAttributes={{ lang: i18n.language }}
          >
            <meta name="description" content="A wallet for Oasis" />
          </Helmet>
          {!isMobile && <BuildBanner />}
          <Box direction="row-responsive" background="background-back" fill style={{ minHeight: '100dvh' }}>
            <PersistLoadingGate>
              <UnlockGate>
                <Navigation />
                <Box flex pad={{ top: isMobile ? '64px' : undefined }}>
                  <Main>
                    {isMobile && <BuildBanner />}
                    <Toolbar />
                    <Outlet />
                    <PageFooter />
                  </Main>
                </Box>
              </UnlockGate>
            </PersistLoadingGate>
          </Box>
        </ModalProvider>
      </IonicNativePlatformProvider>
    </FatalErrorHandler>
  )
}
