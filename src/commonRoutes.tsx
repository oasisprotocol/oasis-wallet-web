import React from 'react'
import { RouteObject } from 'react-router-dom'
import { CreateWalletPage } from 'app/pages/CreateWalletPage'
import { HomePage } from 'app/pages/HomePage'
import { FromLedger } from 'app/pages/OpenWalletPage/Features/FromLedger'
import { FromMnemonic } from 'app/pages/OpenWalletPage/Features/FromMnemonic'
import { FromPrivateKey } from 'app/pages/OpenWalletPage/Features/FromPrivateKey'
import { AccountPage } from 'app/pages/AccountPage'
import { validateAccountPageRoute } from 'app/pages/AccountPage/validateAccountPageRoute'
import { AccountDetails } from 'app/pages/AccountPage/Features/AccountDetails'
import { ValidatorList } from 'app/pages/StakingPage/Features/ValidatorList'
import { ActiveDelegationList } from 'app/pages/StakingPage/Features/DelegationList/ActiveDelegationList'
import { DebondingDelegationList } from 'app/pages/StakingPage/Features/DelegationList/DebondingDelegationList'
import { ParaTimes } from 'app/pages/ParaTimesPage'
import { FiatOnramp } from 'app/pages/FiatOnrampPage'
import { ErrorBoundary } from 'app/components/ErrorBoundary'
import { FromBleLedger } from './app/pages/OpenWalletPage/Features/FromBleLedger'
import { FromUsbLedger } from './app/pages/OpenWalletPage/Features/FromUsbLedger'

export const commonRoutes: RouteObject[] = [
  {
    path: '',
    element: <HomePage />,
  },
  {
    path: 'create-wallet',
    element: <CreateWalletPage />,
  },
  {
    path: 'account/:address/*',
    element: <AccountPage />,
    errorElement: <ErrorBoundary></ErrorBoundary>,
    loader: async ({ params }) => {
      return validateAccountPageRoute(params as any)
    },
    children: [
      {
        path: '',
        element: <AccountDetails />,
      },
      {
        path: 'stake',
        element: <ValidatorList />,
      },
      {
        path: 'active-delegations',
        element: <ActiveDelegationList />,
      },
      {
        path: 'debonding-delegations',
        element: <DebondingDelegationList />,
      },
      {
        path: 'paratimes',
        element: <ParaTimes />,
      },
      {
        path: 'fiat',
        element: <FiatOnramp />,
      },
    ],
  },
  {
    path: 'open-wallet/mnemonic',
    element: <FromMnemonic />,
  },
  {
    path: 'open-wallet/private-key',
    element: <FromPrivateKey />,
  },
  {
    path: 'open-wallet/ledger',
    element: <FromLedger />,
  },
  {
    path: 'open-wallet/ledger/usb',
    element: <FromUsbLedger />,
  },
  {
    path: 'open-wallet/ledger/ble',
    element: <FromBleLedger />,
  },
]

if (process.env.REACT_APP_E2E_TEST) {
  commonRoutes.push({
    path: 'e2e',
    lazy: async () => {
      const { E2EPage } = await import('app/pages/E2EPage')
      return { element: <E2EPage /> }
    },
  })
}
