import * as React from 'react'
import { render, screen, waitFor } from '@testing-library/react'

import { TransactionHistory } from '..'
import { configureAppStore } from '../../../../../../store/configureStore'
import { Provider, useDispatch } from 'react-redux'
import { DeepPartialRootState, RootState } from '../../../../../../types/RootState'
import { Transaction, TransactionStatus, TransactionType } from 'app/state/transaction/types'

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(),
}))

const renderCmp = (store: ReturnType<typeof configureAppStore>) =>
  render(
    <Provider store={store}>
      <TransactionHistory />
    </Provider>,
  )

const getPendingTx = (hash: string): Transaction => ({
  hash,
  type: TransactionType.StakingTransfer,
  from: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
  amount: 1n.toString(),
  to: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuww',
  status: undefined,
  fee: undefined,
  level: undefined,
  round: undefined,
  runtimeId: undefined,
  runtimeName: undefined,
  timestamp: undefined,
  nonce: undefined,
})

const getTx = ({ hash = '', nonce = 0n, status = TransactionStatus.Successful } = {}): Transaction => ({
  ...getPendingTx(hash),
  status,
  nonce: nonce.toString(),
})

const getState = (
  partialState: { accountNonce?: bigint; pendingLocalTxs?: Transaction[]; accountTxs?: Transaction[] } = {},
) => {
  const accountNonce = partialState.accountNonce === undefined ? 0n : partialState.accountNonce
  const pendingLocalTransactions =
    partialState.pendingLocalTxs === undefined ? [] : partialState.pendingLocalTxs
  const accountTxs = partialState.accountTxs === undefined ? [] : partialState.accountTxs

  const state: DeepPartialRootState = {
    account: {
      loading: false,
      address: 'oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
      available: 100000000000n.toString(),
      delegations: null,
      debonding: null,
      total: null,
      transactions: [...accountTxs],
      accountError: undefined,
      transactionsError: undefined,
      pendingTransactions: {
        local: [...pendingLocalTransactions],
        testnet: [],
        mainnet: [],
      },
      nonce: accountNonce.toString(),
    },
    staking: {
      delegations: [],
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
  return configureAppStore(state as Partial<RootState>)
}

describe('<TransactionHistory  />', () => {
  beforeEach(() => {
    // Ignore dispatches to fetch account from AccountPage
    jest.mocked(useDispatch).mockImplementation(() => jest.fn())
  })

  it('should not display any pending or completed txs', async () => {
    renderCmp(getState())

    await waitFor(() => expect(() => screen.getByTestId('pending-txs')).toThrow())
    await waitFor(() => expect(() => screen.getByTestId('completed-txs')).toThrow())

    expect(await screen.queryByText('account.summary.someTxsInPendingState')).not.toBeInTheDocument()
    expect(await screen.findByText('account.summary.noTransactionFound')).toBeInTheDocument()
  })

  it('should display pending txs alert and no transactions', async () => {
    renderCmp(getState({ accountNonce: 1n }))

    await waitFor(() => expect(() => screen.getByTestId('pending-txs')).toThrow())
    await waitFor(() => expect(() => screen.getByTestId('completed-txs')).toThrow())

    expect(await screen.findByText('account.summary.someTxsInPendingState')).toBeInTheDocument()
    expect(await screen.findByText('account.summary.noTransactionFound')).toBeInTheDocument()
    expect(await screen.findByRole('link')).toHaveAttribute(
      'href',
      'http://localhost:9001/data/accounts/detail/oasis1qz0k5q8vjqvu4s4nwxyj406ylnflkc4vrcjghuwk',
    )
  })

  it('should display pending txs alert with single pending tx and no completed transactions', async () => {
    renderCmp(getState({ accountNonce: 0n, pendingLocalTxs: [getPendingTx('txHash1')] }))

    expect((await screen.getByTestId('pending-txs')).childElementCount).toBe(1)
    await waitFor(() => expect(() => screen.getByTestId('completed-txs')).toThrow())

    expect(await screen.findByText('account.summary.someTxsInPendingState')).toBeInTheDocument()
    expect(await screen.findByText('account.summary.noTransactionFound')).toBeInTheDocument()
    expect(await screen.findByText('txHash1')).toBeInTheDocument()
  })

  it('should display single pending and completed tx', async () => {
    renderCmp(
      getState({
        accountNonce: 2n,
        accountTxs: [getTx({ hash: 'txHash1', nonce: 0n })],
        pendingLocalTxs: [getPendingTx('txHash2')],
      }),
    )

    expect((await screen.getByTestId('pending-txs')).childElementCount).toBe(1)
    expect((await screen.getByTestId('completed-txs')).childElementCount).toBe(1)

    expect(await screen.findByText('txHash1')).toBeInTheDocument()
    expect(await screen.findByText('txHash2')).toBeInTheDocument()
  })

  it('should not display pending section in case of failed tx', async () => {
    renderCmp(
      getState({
        accountNonce: 1n,
        accountTxs: [getTx({ hash: 'txHash1', nonce: 0n, status: TransactionStatus.Failed })],
      }),
    )

    await waitFor(() => expect(() => screen.getByTestId('pending-txs')).toThrow())
    expect((await screen.getByTestId('completed-txs')).childElementCount).toBe(1)

    expect(await screen.findByText('txHash1')).toBeInTheDocument()

    await waitFor(() => expect(() => screen.getByText('account.summary.someTxsInPendingState')).toThrow())
  })

  it('should not display pending section on initial load', async () => {
    renderCmp(
      getState({
        accountNonce: 1n,
        accountTxs: [getTx({ hash: 'txHash1', nonce: 0n, status: TransactionStatus.Failed })],
      }),
    )

    await waitFor(() => expect(() => screen.getByTestId('pending-txs')).toThrow())
    expect((await screen.getByTestId('completed-txs')).childElementCount).toBe(1)

    expect(await screen.findByText('txHash1')).toBeInTheDocument()

    await waitFor(() => expect(() => screen.getByText('account.summary.someTxsInPendingState')).toThrow())
  })
})
