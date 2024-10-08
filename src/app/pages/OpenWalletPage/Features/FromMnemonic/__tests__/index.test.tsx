import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { configureAppStore } from 'store/configureStore'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'styles/theme/ThemeProvider'
import { FromMnemonic } from '..'

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}))

const renderPage = (store: any) =>
  render(
    <Provider store={store}>
      <ThemeProvider>
        <FromMnemonic />
      </ThemeProvider>
    </Provider>,
  )

describe('<FromMnemonic/>', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  // @todo this has a random mnemonic...
  it('should match snapshot', () => {
    const page = renderPage(store)
    expect(page.container.firstChild).toMatchSnapshot()
  })

  it('should display an error on invalid mnemonic', async () => {
    renderPage(store)
    const textbox = screen.getByRole('textbox') as HTMLInputElement
    const button = screen.getByRole('button')
    await userEvent.type(textbox, 'hello')
    await userEvent.click(button)
    const errorElem = screen.getByText('openWallet.mnemonic.error')
    expect(errorElem).toBeInTheDocument()

    // A valid phrase should remove the error
    await userEvent.clear(textbox)
    await userEvent.type(textbox, 'echo toward hold roast rather reduce cute civil equal whale wait conduct')
    await userEvent.click(button)
    expect(errorElem).not.toBeInTheDocument()
  })

  it('newlines in mnemonic should be valid', async () => {
    renderPage(store)
    const textbox = screen.getByRole('textbox')
    const button = screen.getByRole('button', { name: 'openWallet.mnemonic.import' })
    await userEvent.type(
      textbox,
      'echo\ntoward hold   roast\n rather reduce cute civil equal whale wait conduct',
    )
    await userEvent.click(button)
    const errorElem = screen.queryByText('openWallet.mnemonic.error')
    expect(errorElem).toBeNull()
  })

  it('should call the success handler and dispatch Redux action', async () => {
    renderPage(store)
    const textbox = screen.getByRole('textbox') as HTMLInputElement
    const button = screen.getByRole('button', { name: 'openWallet.mnemonic.import' })

    await userEvent.type(textbox, 'echo toward hold roast rather reduce cute civil equal whale wait conduct')
    await userEvent.click(button)

    expect(mockDispatch).toHaveBeenCalledWith({
      payload: 'echo toward hold roast rather reduce cute civil equal whale wait conduct',
      type: 'importAccounts/enumerateAccountsFromMnemonic',
    })
  })
})
