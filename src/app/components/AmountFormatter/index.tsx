/**
 *
 * AmountFormatter
 *
 */
import { selectTicker } from 'app/state/network/selectors'
import * as React from 'react'
import { memo } from 'react'
import { useSelector } from 'react-redux'

interface Props {
  amount: string | number
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  hideTicker?: boolean
}

export const AmountFormatter = memo((props: Props) => {
  const amount = Number(props.amount) / 10 ** 9

  const amountParts = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: props.minimumFractionDigits ?? 1,
    maximumFractionDigits: props.maximumFractionDigits ?? 15,
  }).formatToParts(amount)

  let decimalIx = amountParts.findIndex(({ type }) => type === 'decimal')
  if (decimalIx < 0) decimalIx = Infinity
  const amountPartsValues = amountParts.map(({ value }) => value)

  const amountInteger = amountPartsValues.slice(0, decimalIx).join('')
  const amountFraction = amountPartsValues.slice(decimalIx).join('')

  const ticker = useSelector(selectTicker)

  if (props.amount == null) return <>-</>
  return (
    <span>
      {amountInteger}
      <span style={{ fontSize: '70%' }}>{amountFraction}</span>&nbsp;{!props.hideTicker && <>{ticker}</>}
    </span>
  )
})
