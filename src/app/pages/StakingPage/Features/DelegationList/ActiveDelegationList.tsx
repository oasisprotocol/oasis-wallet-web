import { Header } from 'app/components/Header'
import { selectActiveDelegations } from 'app/state/staking/selectors'
import { Box } from 'grommet/es6/components/Box'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { DelegationList } from '.'
import { AccountSubnavigation } from '../../../AccountPage/Features/AccountSubnavigation'

export const ActiveDelegationList = () => {
  const { t } = useTranslation()
  const delegations = useSelector(selectActiveDelegations)
  return (
    <>
      <AccountSubnavigation />
      <Box pad="medium" background="background-front">
        <Header level={2}>{t('delegations.activeDelegations', 'Active delegations')}</Header>
        <DelegationList type="active" delegations={delegations ?? []} />
      </Box>
    </>
  )
}
