import { formatCommissionPercent } from 'app/lib/helpers'
import { selectEpoch } from 'app/state/network/selectors'
import { CommissionBound as ICommissionBounds } from 'app/state/staking/types'
import { Box } from 'grommet/es6/components/Box'
import { Text } from 'grommet/es6/components/Text'
import React, { memo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

interface CommissionBoundProps {
  bound: ICommissionBounds
}

const CommissionBound = memo((props: CommissionBoundProps) => {
  const { t } = useTranslation()
  const epoch = useSelector(selectEpoch)
  if (typeof epoch !== 'number') {
    return null
  }
  const bound = props.bound
  const isCurrentBounds = epoch > bound.epochStart && (!bound.epochEnd || epoch < bound.epochEnd)

  const component = isCurrentBounds ? (
    <Trans
      i18nKey="validator.commissionBounds.current"
      t={t}
      defaults="<strong>{{lowerBound}}% - {{upperBound}}%</strong> at current Epoch {{epoch}}"
      values={{
        lowerBound: formatCommissionPercent(bound.lower),
        upperBound: formatCommissionPercent(bound.upper),
        epoch: epoch,
      }}
    />
  ) : (
    <Trans
      i18nKey="validator.commissionBounds.future"
      t={t}
      defaults="{{lowerBound}}% - {{upperBound}}% starting from Epoch {{epoch}}"
      values={{
        lowerBound: formatCommissionPercent(bound.lower),
        upperBound: formatCommissionPercent(bound.upper),
        epoch: bound.epochStart,
      }}
    />
  )

  return (
    <Box as="li">
      <Text size="inherit">{component}</Text>
    </Box>
  )
})

interface Props {
  bounds?: ICommissionBounds[]
}

export const CommissionBounds = memo((props: Props) => {
  const { t } = useTranslation()

  if (props.bounds && props.bounds.length > 0) {
    const items = props.bounds
      // Always clone before sort so it doesn't mutate source
      .slice()
      .sort((a, b) => a.epochStart - b.epochStart)
      .map((b, i) => <CommissionBound bound={b} key={i} />)
    return (
      <Box as="ul" margin="none" pad="none">
        {items}
      </Box>
    )
  } else {
    return <span>{t('validator.boundsNotSet', 'No bounds set (0% - 100%)')}</span>
  }
})
