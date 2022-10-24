import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModalContainer } from 'app/components/Modal'
import { Validator } from 'app/state/staking/types'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { transactionActions } from 'app/state/transaction'
import { WalletErrors } from 'types/errors'
import { AddEscrowForm } from '..'

const renderComponent = (store: any, address: string, validatorStatus: Validator['status']) =>
  render(
    <Provider store={store}>
      <AddEscrowForm validatorAddress={address} validatorStatus={validatorStatus} validatorRank={21} />
      <ModalContainer />
    </Provider>,
  )

describe('<AddEscrowForm />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore()
  })

  it('should match snapshot', () => {
    const component = renderComponent(store, 'dummy-address', 'active')
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should dispatch an addEscrow transaction', async () => {
    const spy = jest.spyOn(store, 'dispatch')
    renderComponent(store, 'dummy-address', 'active')

    await userEvent.type(screen.getByTestId('amount'), '1000')
    await userEvent.click(screen.getByRole('button'))

    expect(spy).toHaveBeenCalledWith({
      payload: {
        amount: '1000000000000',
        type: 'addEscrow',
        validator: 'dummy-address',
      },
      type: transactionActions.addEscrow.type,
    })
  })

  it('should render error indicator', () => {
    const storeWithError = configureAppStore({
      transaction: {
        active: true,
        error: {
          code: WalletErrors.NoOpenWallet,
          message: 'message',
        },
        success: false,
      },
    })

    renderComponent(storeWithError, 'dummy-address', 'active')

    expect(screen.getByText('errors.noOpenWallet')).toBeInTheDocument()
  })

  it('should warn before addEscrow to inactive validator', async () => {
    renderComponent(store, 'dummy-address', 'inactive')

    await userEvent.type(screen.getByTestId('amount'), '1000')
    await userEvent.click(screen.getByRole('button'))

    expect(screen.getByText('account.addEscrow.confirmDelegatingToInactive.title')).toBeInTheDocument()
  })
})
