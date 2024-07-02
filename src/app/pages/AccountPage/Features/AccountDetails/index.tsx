/**
 *
 * AccountDetails
 *
 */
import { Box } from 'grommet/es6/components/Box'
import { memo } from 'react'
import { useSelector } from 'react-redux'
import { SendTransaction } from '../SendTransaction'
import { TransactionHistory } from '../TransactionHistory'
import { selectIsAddressInWallet } from 'app/state/selectIsAddressInWallet'
import { AccountSubnavigation } from '../AccountSubnavigation'

interface Props {}

export const AccountDetails = memo((props: Props) => {
  const isAddressInWallet = useSelector(selectIsAddressInWallet)

  return (
    <>
      <AccountSubnavigation />
      <Box direction="row" wrap style={{ gap: '24px' }}>
        {isAddressInWallet && (
          <Box flex={{ grow: 1 }} basis="32ex" width={{ max: '100%' }}>
            <SendTransaction isAddressInWallet={isAddressInWallet} />
          </Box>
        )}
        <Box flex={{ grow: 3 }} basis="80ex" width={{ max: '100%' }}>
          <TransactionHistory />
        </Box>
      </Box>
    </>
  )
})
