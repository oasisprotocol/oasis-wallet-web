import { render, act, screen } from '@testing-library/react'
import { FromLedger } from '..'
import { MemoryRouter } from 'react-router-dom'

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}))

jest.mock('../../../../../lib/ledger', () => ({
  ...jest.requireActual('../../../../../lib/ledger'),
  // Throws BLE not supported
  canAccessBle: () => jest.fn().mockReturnValue(false),
}))

const renderComponent = () =>
  render(
    <MemoryRouter>
      <FromLedger />
    </MemoryRouter>,
  )

describe('<FromLedger />', () => {
  it('should render component', async () => {
    const { container } = renderComponent()

    await act(() => Promise.resolve())

    expect(container).toMatchSnapshot()

    expect(screen.getByText('errors.usbTransportNotSupported')).toBeInTheDocument()
    expect(screen.getByText('errors.bluetoothTransportNotSupported')).toBeInTheDocument()
  })

  it('should render component with an ledger access button', async () => {
    renderComponent()

    await act(() => Promise.resolve())

    expect(screen.queryByText('openWallet.importAccounts.usbLedger')).toBeInTheDocument()
    expect(screen.queryByText('openWallet.importAccounts.bluetoothLedger')).toBeInTheDocument()
  })
})
