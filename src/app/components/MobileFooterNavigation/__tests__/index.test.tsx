import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { Wallet } from 'app/state/wallet/types'
import { MobileFooterNavigation } from '..'

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <MemoryRouter>
        <MobileFooterNavigation />
      </MemoryRouter>
    </Provider>,
  )

describe('<MobileFooterNavigation />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
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

  it('should render mobile navigation', () => {
    renderComponent(store)

    const walletLink = screen.getByRole('link', { name: /menu.wallet/ })
    expect(walletLink).toHaveAttribute('href', '/account/dummy')

    const stakeLink = screen.getByRole('link', { name: /menu.stake/ })
    expect(stakeLink).toHaveAttribute('href', '/account/dummy/stake')

    const paraTimesLink = screen.getByRole('link', { name: /menu.paraTimes/ })
    expect(paraTimesLink).toHaveAttribute('href', '/account/dummy/paratimes')

    const buyLink = screen.getByRole('link', { name: /menu.fiatOnramp-mobile/ })
    expect(buyLink).toHaveAttribute('href', '/account/dummy/fiat')
  })
})
