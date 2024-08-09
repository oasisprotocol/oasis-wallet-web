/**
 *
 * AmountFormatter
 *
 */
import { selectTicker } from 'app/state/network/selectors'
import * as React from 'react'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import { StringifiedBigInt } from 'types/StringifiedBigInt'
import { formatBaseUnitsAsRose, formatWeiAsWrose } from 'app/lib/helpers'
import { NoTranslate } from '../NoTranslate'

export interface AmountFormatterProps {
  amount: StringifiedBigInt | null
  amountUnit?: 'baseUnits' | 'wei'
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  hideTicker?: boolean
  size?: string
  smallTicker?: boolean
  plainTicker?: boolean
}

/**
 * Formats base unit amounts to ROSEs
 */
export const AmountFormatter = memo(
  ({
    amount,
    amountUnit = 'baseUnits',
    minimumFractionDigits,
    maximumFractionDigits,
    hideTicker,
    size,
    smallTicker,
    plainTicker,
  }: AmountFormatterProps) => {
    const ticker = useSelector(selectTicker)
    const isUsingBaseUnits = amountUnit === 'baseUnits'
    if (amount == null) return <span>-</span>

    const formatter = isUsingBaseUnits ? formatBaseUnitsAsRose : formatWeiAsWrose
    const amountString = formatter(amount, {
      minimumFractionDigits: minimumFractionDigits ?? 1,
      maximumFractionDigits: maximumFractionDigits ?? (isUsingBaseUnits ? 15 : 18),
    })

    const tickerProps = smallTicker
      ? {
          size: 'xsmall',
          weight: 600,
        }
      : {}
    const colorProps = plainTicker ? {} : { color: 'ticker' }

    return (
      <span>
        <Box
          style={{
            display: 'inline-flex',
            whiteSpace: 'nowrap',
            fontFamily: '"Roboto mono", monospace',
            letterSpacing: 0,
          }}
        >
          {amountString}
        </Box>
        {!hideTicker && (
          <Text size={size} {...tickerProps} {...colorProps}>
            <NoTranslate>{` ${ticker}`}</NoTranslate>
          </Text>
        )}
      </span>
    )
  },
)
