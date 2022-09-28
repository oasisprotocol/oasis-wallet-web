import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { transactionActions } from 'app/state/transaction'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { SendBurn } from '..'

const renderComponent = (store: any) =>
  render(
    <Provider store={store}>
      <SendBurn isAddressInWallet />
    </Provider>,
  )

describe('<SendBurn />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should dispatch sendBurn action on submit', () => {
    const spy = jest.spyOn(store, 'dispatch')
    renderComponent(store)

    userEvent.type(screen.getByPlaceholderText('0'), '10')
    userEvent.click(screen.getByRole('button'))

    expect(spy).toHaveBeenCalledWith({
      payload: {
        amount: '10000000000',
        type: 'burn',
      },
      type: 'transaction/sendBurn',
    } as ReturnType<typeof transactionActions.sendBurn>)
  })
})
