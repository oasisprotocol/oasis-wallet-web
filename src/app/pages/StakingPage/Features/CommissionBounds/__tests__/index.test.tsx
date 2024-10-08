import { act, render } from '@testing-library/react'
import { networkActions } from 'app/state/network'
import { NetworkState } from 'app/state/network/types'
import { CommissionBound as ICommissionBounds } from 'app/state/staking/types'
import * as React from 'react'
import { Provider } from 'react-redux'
import { configureAppStore } from 'store/configureStore'

import { CommissionBounds } from '..'

jest.unmock('react-i18next')

const renderComponent = (store: any, bounds?: ICommissionBounds[]) =>
  render(
    <Provider store={store}>
      <CommissionBounds bounds={bounds} />
    </Provider>,
  )

describe('<CommissionBounds  />', () => {
  let store: ReturnType<typeof configureAppStore>

  beforeEach(() => {
    store = configureAppStore({
      network: {
        epoch: 0,
      } as NetworkState,
    })
  })

  it('should match snapshot when empty', () => {
    const component = renderComponent(store)
    expect(component.baseElement).toMatchSnapshot()
  })

  it('should match snapshot with provided bounds', () => {
    const component = renderComponent(store, [{ epochStart: 0, lower: 0.1, upper: 0.2, epochEnd: 100 }])
    expect(component.baseElement).toMatchSnapshot()
  })

  it('should not have rounding issues', () => {
    const component = renderComponent(store, [{ epochStart: 0, lower: 0.14, upper: 0.28, epochEnd: 100 }])
    expect(component.container.textContent).toEqual('14% - 28% starting from Epoch 0')
  })

  it('should match snapshot with active bounds', () => {
    store = configureAppStore()
    const component = renderComponent(store, [{ epochStart: 0, lower: 0.1, upper: 0.2, epochEnd: 100 }])
    act(() => {
      store.dispatch(networkActions.setEpoch(50))
    })
    expect(component.baseElement).toMatchSnapshot()
  })
})
