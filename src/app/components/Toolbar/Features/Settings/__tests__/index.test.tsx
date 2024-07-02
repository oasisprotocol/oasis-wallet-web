import { render, screen } from '@testing-library/react'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { configureAppStore } from 'store/configureStore'
import { Settings } from '..'

const renderComponent = (store: any, responsiveContext: string) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <ResponsiveContext.Provider value={responsiveContext}>
          <Settings />
        </ResponsiveContext.Provider>
      </ThemeProvider>
    </Provider>,
  )

describe('<Settings />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    jest.resetModules()

    store = configureAppStore({
      theme: {
        selected: 'system',
      },
    })
  })

  it('should not render footer on desktop', () => {
    renderComponent(store, 'large')

    expect(screen.queryByTestId('footer')).not.toBeInTheDocument()
  })

  it('should render footer on mobile', () => {
    renderComponent(store, 'small')

    expect(screen.getByTestId('footer')).toBeInTheDocument()
    expect(screen.queryByTestId('mobile-footer-navigation')).not.toBeInTheDocument()
  })
})
