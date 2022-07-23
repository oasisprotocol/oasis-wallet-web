import { render, screen } from '@testing-library/react'

import { ShortAddress } from '..'

describe('<ShortAddress  />', () => {
  it('should render short address', () => {
    render(<ShortAddress address="qwertyuiopasdfghjkl" />)
    expect(screen.getByText('qwertyuiop...sdfghjkl')).toBeInTheDocument()
  })

  it('should render hash', () => {
    render(<ShortAddress address="6557c86267761b845aa00dac39e892ca58922305c883965f4b0b67a009b0d8d3" />)
    expect(screen.getByText('6557c86267...09b0d8d3')).toBeInTheDocument()
  })

  it('should fallback to unavailable label when short address cannot be created', () => {
    render(<ShortAddress address="" />)
    expect(screen.getByText('common.unavailable')).toBeInTheDocument()
  })
})
