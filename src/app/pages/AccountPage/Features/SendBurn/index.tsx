import { TransactionStatus } from 'app/components/TransactionStatus'
import { transactionActions } from 'app/state/transaction'
import { selectTransaction } from 'app/state/transaction/selectors'
import { Box, Button, Form, FormField, TextInput } from 'grommet'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { parseRoseStringToBaseUnitString } from 'app/lib/helpers'
import { useModal } from '../../../../components/Modal'

export interface SendBurnProps {
  isAddressInWallet: boolean
}

export function SendBurn(props: SendBurnProps) {
  if (!props.isAddressInWallet) {
    throw new Error('SendTransaction component should only appear on your accounts')
  }

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { launchModal } = useModal()
  const { error, success } = useSelector(selectTransaction)
  const [amount, setAmount] = useState('')
  const sendBurn = () =>
    dispatch(
      transactionActions.sendBurn({
        type: 'burn',
        amount: parseRoseStringToBaseUnitString(amount),
      }),
    )
  const onSubmit = () =>
    launchModal({
      title: t('account.sendBurn.confirmBurning.title', 'Are you sure you want to continue?'),
      description: t(
        'account.sendBurn.confirmBurning.description',
        'You are about to burn these tokens. You are not sending them anywhere, but destroying them. They will completely cease to exist, and there is no way to get them back.',
      ),
      handleConfirm: sendBurn,
      isDangerous: true,
    })

  // On successful transaction, clear the fields
  useEffect(() => {
    if (success) {
      setAmount('')
    }
  }, [success])

  // Cleanup effect - clear the transaction when the component unmounts
  useEffect(() => {
    return function cleanup() {
      dispatch(transactionActions.clearTransaction())
    }
  }, [dispatch])

  return (
    <Box border={{ color: 'background-front-border', size: '1px' }} round="5px" background="background-front">
      <Form>
        <Box fill gap="medium" pad="medium">
          <FormField htmlFor="amount-id" name="amount" label={t('burn.amount', 'Amount to burn')}>
            <TextInput
              id="amount-id"
              name="amount"
              placeholder="0"
              type="number"
              step="any"
              min="0"
              value={amount}
              onChange={event => setAmount(event.target.value)}
              required
            />
          </FormField>
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <Button type="submit" label={t('account.sendBurn.burn', 'Burn')} onClick={onSubmit} primary />
          </Box>
        </Box>
      </Form>
      <TransactionStatus error={error} success={success} />
    </Box>
  )
}
