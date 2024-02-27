import React from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { when } from 'jest-when'
import { selectShowAccountsSelectionModal } from 'app/state/importaccounts/selectors'
import { canAccessNavigatorUsb } from 'app/lib/ledger'
import { SelectOpenMethod } from '..'

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}))
jest.mock('app/lib/ledger')

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const renderComponent = (webExtensionLedgerAccess?: () => void) =>
  render(
    <MemoryRouter>
      <SelectOpenMethod webExtensionLedgerAccess={webExtensionLedgerAccess} />
    </MemoryRouter>,
  )

describe('<SelectOpenMethod />', () => {
  beforeEach(() => {
    jest.mocked(canAccessNavigatorUsb).mockResolvedValue(false)
  })

  it('should render component', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  it('should redirect user to ledger page', () => {
    when(useSelector as any)
      .calledWith(selectShowAccountsSelectionModal)
      .mockReturnValue(true)

    renderComponent(() => {})

    expect(mockNavigate).toHaveBeenCalledWith('/open-wallet/ledger/usb')
  })
})
