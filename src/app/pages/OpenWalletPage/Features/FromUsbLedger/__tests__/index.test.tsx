import * as React from 'react'
import { render } from '@testing-library/react'
import { FromLedger } from '..'

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}))

describe('<FromUsbLedger />', () => {
  it('should render component', () => {
    const { container } = render(<FromLedger />)

    expect(container).toMatchSnapshot()
  })
})
