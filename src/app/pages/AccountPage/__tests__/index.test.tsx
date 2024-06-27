import { render, screen } from '@testing-library/react'
import { Provider, useDispatch } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { configureAppStore } from 'store/configureStore'

import { AccountPage } from '..'
import { AccountDetails } from '../Features/AccountDetails'
import { DeepPartialRootState } from 'types/RootState'
import { stakingActions } from 'app/state/staking'
import { PersistState } from 'app/state/persist/types'
import { WalletErrors } from 'types/errors'

jest.unmock('react-i18next')
jest.mock('qrcode.react', () => ({
  QRCodeCanvas: () => <>QRCodeCanvasMock</>,
}))
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}))

const renderPage = (store: any, initialEntries: string[]) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/account/:address/*" element={<AccountPage />}>
              <Route path="" element={<AccountDetails />}></Route>
            </Route>
          </Routes>
        </MemoryRouter>
      </ThemeProvider>
    </Provider>,
  )

describe('<AccountPage  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    // Ignore dispatches to fetch account from AccountPage
    jest.mocked(useDispatch).mockImplementation(() => jest.fn())

    const state: DeepPartialRootState = {
      account: {
        loading: false,
        address: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
        available: 100000000000n.toString(),
        delegations: null,
        debonding: null,
        total: null,
        transactions: [],
        accountError: undefined,
        transactionsError: undefined,
        pendingTransactions: {
          local: [],
          testnet: [],
          mainnet: [],
        },
      },
      staking: {
        delegations: [{ amount: 1111n.toString() }],
        debondingDelegations: [],
      },
      wallet: {
        selectedWallet: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
        wallets: {
          oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk: {
            address: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
          },
        },
      },
    }
    store = configureAppStore(state as any)
  })

  it('should match snapshot', async () => {
    const page = renderPage(store, ['/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'])
    const balance = await screen.findByTestId('account-balance-total')
    expect(balance).toHaveTextContent('100.000001111')
    expect(page.container.firstChild).toMatchSnapshot()
  })

  it('with missing delegations', async () => {
    store.dispatch(
      stakingActions.updateDelegationsError({
        code: WalletErrors.IndexerAPIError,
        message: 'Dummy error',
      }),
    )
    const page = renderPage(store, ['/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'])
    expect(page.container).toHaveTextContent('Oasis Scan API appears to be down')
    const balance = await screen.findByTestId('account-balance-total')
    expect(balance).toHaveTextContent('-')
    const balanceSummary = await screen.findByTestId('account-balance-summary')
    expect(balanceSummary.textContent).toMatchSnapshot()
    const tabs = await screen.findByRole('navigation')
    expect(tabs.textContent).toMatchSnapshot()
  })

  it('should sum total balance without losing precision', async () => {
    store = configureAppStore({
      ...store.getState(),
      account: {
        ...store.getState().account,
        available: 1563114365108133939632n.toString(),
      },
    })
    renderPage(store, ['/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'])
    const balance = await screen.findByTestId('account-balance-total')
    expect(balance).toHaveTextContent('1,563,114,365,108.133940743')
  })

  it('should render edit address variant', async () => {
    store = configureAppStore({
      ...store.getState(),
      account: {
        ...store.getState().account,
        available: 1563114365108133939632n.toString(),
      },
      persist: {
        hasPersistedProfiles: true,
        stringifiedEncryptionKey: 'unlockedProfile',
      } as PersistState,
    })
    renderPage(store, ['/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'])
    expect(screen.getByText('oasis1 qz0k 5q8v jqvu 4s4n wxyj 406y lnfl kc4v rcjg huwk')).toBeInTheDocument()
    expect(screen.getByTestId('editable-address-edit-button')).toBeInTheDocument()
  })

  it('should render edit name variant', async () => {
    store = configureAppStore({
      ...store.getState(),
      account: {
        ...store.getState().account,
        available: 1563114365108133939632n.toString(),
      },
      persist: {
        hasPersistedProfiles: true,
        stringifiedEncryptionKey: 'unlockedProfile',
      } as PersistState,
      wallet: {
        selectedWallet: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
        wallets: {
          oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk: {
            ...store.getState().wallet.wallets.oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk,
            address: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
            name: 'My Wallet',
          },
        },
      },
    })
    renderPage(store, ['/account/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk'])
    expect(
      screen.queryByText('oasis1 qz0k 5q8v jqvu 4s4n wxyj 406y lnfl kc4v rcjg huwk'),
    ).not.toBeInTheDocument()
    expect(screen.getByText('My Wallet')).toBeInTheDocument()
    expect(screen.getByTestId('editable-name-edit-button')).toBeInTheDocument()
  })
})
