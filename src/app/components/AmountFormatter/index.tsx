/**
 *
 * AmountFormatter
 *
 */
import { selectTicker } from 'app/state/network/selectors'
import * as React from 'react'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { Text } from 'grommet'

export interface AmountFormatterProps {
  amount: string | number | null
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  hideTicker?: boolean
  size?: string
  smallTicker?: boolean
}

export const AmountFormatter = memo((props: AmountFormatterProps) => {
  const amount = Number(props.amount) / 10 ** 9
  const amountString = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: props.minimumFractionDigits ?? 1,
    maximumFractionDigits: props.maximumFractionDigits ?? 15,
  }).format(amount)

  const ticker = useSelector(selectTicker)
  const tickerProps = props.smallTicker
    ? {
        size: 'xsmall',
        weight: 600,
        color: '#a3a3a3',
      }
    : {}
  if (props.amount == null) return <>-</>

  return (
    <>
      {amountString}
      {!props.hideTicker && (
        <Text margin={{ left: 'xxsmall' }} size={props.size} {...tickerProps}>
          {ticker}
        </Text>
      )}
    </>
  )
})
