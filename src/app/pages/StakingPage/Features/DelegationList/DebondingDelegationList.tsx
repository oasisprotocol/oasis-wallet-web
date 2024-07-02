import { Header } from 'app/components/Header'
import { selectDebondingDelegations } from 'app/state/staking/selectors'
import { Box } from 'grommet/es6/components/Box'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { DelegationList } from '.'
import { AccountSubnavigation } from '../../../AccountPage/Features/AccountSubnavigation'

export const DebondingDelegationList = () => {
  const { t } = useTranslation()
  const delegations = useSelector(selectDebondingDelegations)
  return (
    <>
      <AccountSubnavigation />
      <Box pad="medium" background="background-front">
        <Header level={2}>{t('delegations.debondingDelegations', 'Debonding delegations')}</Header>
        <DelegationList type="debonding" delegations={delegations ?? []} />
      </Box>
    </>
  )
}
