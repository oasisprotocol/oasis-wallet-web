import { render } from '@testing-library/react'

import { TimeToEpoch } from '..'

const renderComponent = (currentEpoch: number, epoch: number) =>
  render(<TimeToEpoch currentEpoch={currentEpoch} epoch={epoch} />)

describe('<TimeToEpoch />', () => {
  it('should estimate debonding times', () => {
    expect(renderComponent(10000, 10336).container.textContent).toEqual('in 14 days')
    expect(renderComponent(10000, 10306).container.textContent).toEqual('in 13 days')
    expect(renderComponent(10000, 10086).container.textContent).toEqual('in 4 days')
    expect(renderComponent(10000, 10047).container.textContent).toEqual('in 47 hours')
    expect(renderComponent(10000, 10001).container.textContent).toEqual('in 1 hour')
  })
})
