/**
 *
 * AccountDetails
 *
 */
import { Box } from 'grommet'
import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { TransactionHistory } from '../TransactionHistory'
import { selectIsAddressInWallet } from 'app/state/selectIsAddressInWallet'
import { SendBurn } from '../SendBurn'

interface Props {}

export const AccountTokenBurning = memo((props: Props) => {
  const isAddressInWallet = useSelector(selectIsAddressInWallet)

  return (
    <Box direction="row-responsive" gap="small">
      {isAddressInWallet && (
        <Box flex basis="1/4" width={{ min: '300px' }}>
          <SendBurn isAddressInWallet={isAddressInWallet} />
        </Box>
      )}
      <Box flex basis="3/4">
        <TransactionHistory />
      </Box>
    </Box>
  )
})
