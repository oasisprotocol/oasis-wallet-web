import { NewTransactionType } from 'app/state/transaction/types'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Text } from 'grommet'

interface Props {
  type: NewTransactionType
}

export const TransactionTypeFormatter = memo((props: Props) => {
  const { t } = useTranslation()
  const type = props.type

  const typeMap: { [type in NewTransactionType]: string } = {
    addEscrow: t('transaction.types.addEscrow', 'Delegating your tokens to a validator and generate rewards'),
    reclaimEscrow: t('transaction.types.reclaimEscrow', 'Reclaiming your tokens delegated to a validator'),
    transfer: t('transaction.types.transfer', 'Transferring tokens from your account to another'),
    burn: t('transaction.types.burn', 'Burn tokens in your account'),
  }

  const typeMessage = typeMap[type]
  return (
    <Box>
      <Text>{type}</Text>
      <Text size="small">({typeMessage})</Text>
    </Box>
  )
})
