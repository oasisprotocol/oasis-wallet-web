import { ReclaimEscrowForm } from 'app/components/ReclaimEscrowForm'
import { DebondingDelegation, Delegation, ValidatorDetails } from 'app/state/staking/types'
import { Box } from 'grommet/es6/components/Box'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { ValidatorInformations } from '../ValidatorList/ValidatorInformations'
import { AddressBox } from '../../../../components/AddressBox'

interface DelegationProps {
  data: Delegation | DebondingDelegation
  validatorDetails: ValidatorDetails | null
  canReclaim: boolean
}

export const DelegationItem = memo((props: DelegationProps) => {
  const { t } = useTranslation()
  const delegation = props.data
  const validator = props.data.validator
  const canReclaim = props.canReclaim
  const details = props.validatorDetails

  return (
    <Box pad={{ vertical: 'medium' }} data-testid="validator-item">
      <Box style={{ maxWidth: '85vw' }}>
        {validator && <ValidatorInformations validator={validator} details={details} />}
        {!validator && (
          <div>
            <AddressBox address={delegation.validatorAddress} trimMobile />
            {t('validator.unknownValidator', 'Unknown validator')}
          </div>
        )}
        {canReclaim && (
          <ReclaimEscrowForm
            address={delegation.validatorAddress}
            maxAmount={delegation.amount}
            maxShares={delegation.shares}
          />
        )}
      </Box>
    </Box>
  )
})
