import * as React from 'react'
import { render } from '@testing-library/react'
import { FromUsbLedger } from '..'

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}))

describe('<FromUsbLedger />', () => {
  it('should render component', () => {
    const { container } = render(<FromUsbLedger />)

    expect(container).toMatchSnapshot()
  })
})
