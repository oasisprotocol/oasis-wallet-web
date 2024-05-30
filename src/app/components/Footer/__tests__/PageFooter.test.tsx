import { render, screen } from '@testing-library/react'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { configureAppStore } from 'store/configureStore'
import { Wallet } from 'app/state/wallet/types'
import { PageFooter } from '../PageFooter'

const renderComponent = (store: any, responsiveContext: string) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <ThemeProvider>
          <ResponsiveContext.Provider value={responsiveContext}>
            <PageFooter />
          </ResponsiveContext.Provider>
        </ThemeProvider>
      </MemoryRouter>
    </Provider>,
  )

describe('<PageFooter />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    jest.resetModules()

    store = configureAppStore({
      wallet: {
        selectedWallet: 'dummy',
        wallets: {
          dummy: {
            address: 'dummy',
          } as Wallet,
        },
      },
    })
  })

  it('should render mobile navigation without footer on mobile when account is open', () => {
    renderComponent(store, 'small')

    expect(screen.queryByTestId('footer')).not.toBeInTheDocument()
    expect(screen.getByTestId('mobile-footer-navigation')).toBeInTheDocument()
  })

  it('should render footer without mobile navigation on desktop when account is open', () => {
    renderComponent(store, 'large')

    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.queryByTestId('mobile-footer-navigation')).not.toBeInTheDocument()
  })

  it('should render footer without mobile navigation on mobile when account is not open', () => {
    const storeWithoutAccount = configureAppStore({})
    renderComponent(storeWithoutAccount, 'small')

    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.queryByTestId('mobile-footer-navigation')).not.toBeInTheDocument()
  })

  it('should render footer without mobile navigation on desktop when account is not open', () => {
    const storeWithoutAccount = configureAppStore({})
    renderComponent(storeWithoutAccount, 'large')

    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.queryByTestId('mobile-footer-navigation')).not.toBeInTheDocument()
  })
})
