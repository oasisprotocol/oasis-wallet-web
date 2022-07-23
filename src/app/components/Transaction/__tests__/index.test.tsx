import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { selectTicker } from 'app/state/network/selectors'
import { when } from 'jest-when'
import * as React from 'react'
import { Router } from 'react-router'
import { createMemoryHistory } from 'history'
import { Provider, useSelector } from 'react-redux'
import { configureAppStore } from 'store/configureStore'
import { BackendAPIs, backend } from 'vendors/backend'

import { Transaction } from '..'
import * as transactionTypes from 'app/state/transaction/types'
import { NetworkType } from 'app/state/network/types'
import type { UseTranslationResponse, Trans } from 'react-i18next'

type TransType = typeof Trans
jest.mock('react-i18next', () => ({
  Trans: (({ i18nKey }) => <>{i18nKey}</>) as TransType,
  useTranslation: () => {
    return {
      t: str => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    } as UseTranslationResponse<'translation'>
  },
}))

jest.mock('vendors/backend')
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}))

const history = createMemoryHistory()
const pushSpy = jest.spyOn(history, 'push')
const renderComponent = (
  store: any,
  ref: any,
  transaction: transactionTypes.Transaction,
  network: NetworkType,
) =>
  render(
    <Router history={history}>
      <Provider store={store}>
        <Transaction referenceAddress={ref} transaction={transaction} network={network} />
      </Provider>
    </Router>,
  )

describe('<Transaction  />', () => {
  let store: ReturnType<typeof configureAppStore>
  const ref = 'sourceAddr'
  const transaction = {
    amount: 1000000,
    timestamp: 1618018255,
    from: 'source',
    to: 'destination',
    type: transactionTypes.TransactionType.StakingTransfer,
    hash: 'ff1234',
    status: true,
  } as transactionTypes.Transaction
  const network = 'mainnet'

  beforeEach(() => {
    jest.mocked(backend).mockImplementation(() => BackendAPIs.OasisScan)
    store = configureAppStore()

    when(useSelector as any)
      .calledWith(selectTicker)
      .mockReturnValue('TEST')
  })

  it('should match snapshot', () => {
    const component = renderComponent(store, ref, transaction, network)
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should redirect user when clicking on address section', () => {
    renderComponent(store, ref, transaction, network)

    userEvent.click(screen.getByLabelText('ContactInfo'))
    expect(pushSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        pathname: `/account/${transaction.from}`,
      }),
    )
  })

  it('should not redirect user when clicking on amount or block section', () => {
    renderComponent(store, ref, transaction, network)

    userEvent.click(screen.getByLabelText('Cube'))
    expect(pushSpy).not.toHaveBeenCalled()
  })

  it('should mark failed transactions', () => {
    renderComponent(store, ref, { ...transaction, status: false }, network)
    expect(screen.getByText('account.transaction.failed')).toBeInTheDocument()
  })

  it('should handle unknown transaction types gracefully', () => {
    const component = renderComponent(
      store,
      'sourceAddr',
      {
        amount: 1000000,
        timestamp: 1618018255,
        from: 'source',
        to: 'destination',
        type: 'turboencabulate' as transactionTypes.TransactionType,
        hash: 'ff1234',
        fee: undefined,
        level: undefined,
        status: true,
      },
      network,
    )
    expect(component.container.firstChild).toMatchSnapshot()
  })

  it('should not render a link when address is undefined', () => {
    renderComponent(
      store,
      'sourceAddr',
      {
        amount: 1000000,
        timestamp: 1618018255,
        from: 'sourceAddr',
        to: undefined,
        type: 'anyType' as transactionTypes.TransactionType,
        hash: 'ff1234',
        fee: undefined,
        level: undefined,
        status: true,
      },
      network,
    )

    expect(screen.queryByTestId('external-wallet-address')).not.toBeInTheDocument()
    expect(screen.getByText('common.unavailable')).toBeInTheDocument()
  })

  it('should render testnet link', () => {
    renderComponent(store, ref, transaction, 'testnet')
    expect(screen.getByTestId('explorer-link')).toHaveAttribute(
      'href',
      'https://testnet.oasisscan.com/transactions/ff1234',
    )
  })

  it('should render monitor link', () => {
    jest.mocked(backend).mockImplementation(() => BackendAPIs.OasisMonitor)
    renderComponent(store, ref, transaction, network)
    expect(screen.getByTestId('explorer-link')).toHaveAttribute(
      'href',
      'https://oasismonitor.com/operation/ff1234',
    )
  })

  it('should render testnet monitor link', () => {
    jest.mocked(backend).mockImplementation(() => BackendAPIs.OasisMonitor)
    renderComponent(store, ref, transaction, 'testnet')
    expect(screen.getByTestId('explorer-link')).toHaveAttribute(
      'href',
      'https://testnet.oasismonitor.com/operation/ff1234',
    )
  })
})
