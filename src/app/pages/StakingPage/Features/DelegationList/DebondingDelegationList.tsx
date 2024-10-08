import { useEffect } from 'react'
import { selectDebondingDelegations } from 'app/state/staking/selectors'
import { Box } from 'grommet/es6/components/Box'
import { useDispatch, useSelector } from 'react-redux'

import { DelegationList } from '.'
import { StakeSubnavigation } from '../../../AccountPage/Features/StakeSubnavigation'
import { networkActions } from '../../../../../app/state/network'
import { selectEpoch } from '../../../../../app/state/network/selectors'

export const DebondingDelegationList = () => {
  const dispatch = useDispatch()
  const delegations = useSelector(selectDebondingDelegations)
  const currentEpoch = useSelector(selectEpoch)

  useEffect(() => {
    return () => {
      dispatch(networkActions.getEpoch())
    }
  }, [dispatch])

  return (
    <>
      <StakeSubnavigation />
      <Box as="section" data-testid="debonding-delegations">
        <Box pad="medium" background="background-front">
          <DelegationList currentEpoch={currentEpoch} type="debonding" delegations={delegations ?? []} />
        </Box>
      </Box>
    </>
  )
}
