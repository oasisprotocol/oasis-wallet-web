/**
 *
 * ReclaimEscrowForm
 *
 */
import { transactionActions } from 'app/state/transaction'
import { selectTransaction } from 'app/state/transaction/selectors'
import { Box, Button, Form, TextInput, Text } from 'grommet'
import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { TransactionStatus } from '../TransactionStatus'

interface Props {
  /** Currently delegated amount */
  maxAmount: string

  /** Target validator address */
  address: string

  /** Current shares corresponding to maxAmount */
  shares: string
}

export const ReclaimEscrowForm = memo((props: Props) => {
  const { t } = useTranslation()
  const { error, success } = useSelector(selectTransaction)
  const [amount, setAmount] = useState('')
  const [shares, setShares] = useState(0)
  const dispatch = useDispatch()

  // Escrow tokens to shares conversion rate
  const rate = Number(props.maxAmount) / Number(props.shares)

  useEffect(() => {
    return () => {
      dispatch(transactionActions.clearTransaction())
    }
  }, [dispatch])

  const amountChanged = (amount: string) => {
    const shares = Number(amount) / Number(rate)
    setAmount(amount)
    setShares(shares)
  }

  const submit = () => {
    dispatch(
      transactionActions.reclaimEscrow({
        type: 'reclaimEscrow',
        amount: Number(amount),
        shares: shares,
        validator: props.address,
      }),
    )
  }

  const reclaimAll = () => {
    dispatch(
      transactionActions.reclaimEscrow({
        type: 'reclaimEscrow',
        amount: Number(props.maxAmount) / 10 ** 9,
        shares: Number(props.shares) / 10 ** 9,
        validator: props.address,
      }),
    )
  }

  return (
    <Form onSubmit={submit}>
      <Box direction="row" gap="small" pad={{ top: 'small' }}>
        <Box background="background-front">
          <Box width="small">
            <TextInput
              data-testid="amount"
              id="amount-id"
              name="amount"
              placeholder={t('common.amount')}
              type="number"
              step="any"
              min={0.0001}
              max={Number(props.maxAmount) / 10 ** 9}
              size="medium"
              value={amount}
              onChange={event => amountChanged(event.target.value)}
              required
            />
          </Box>
        </Box>
        <Button
          label={t('account.reclaimEscrow.reclaim', 'Reclaim')}
          type="submit"
          primary
          style={{ borderRadius: '4px' }}
        />
        <Button
          label={t('account.reclaimEscrow.reclaimAll', 'Reclaim all')}
          onClick={reclaimAll}
          style={{ borderRadius: '4px' }}
        />
      </Box>
      {shares > 0 && (
        <Text size="small" data-testid="numberOfShares">
          Corresponding number of shares: {shares}
        </Text>
      )}
      <TransactionStatus error={error} success={success} />
    </Form>
  )
})
