import { TransactionStatus } from 'app/components/TransactionStatus'
import { modalActions } from '../../../../components/Modal/slice'
import { transactionActions } from 'app/state/transaction'
import { selectTransaction } from 'app/state/transaction/selectors'
import { selectValidators } from 'app/state/staking/selectors'
import { Box, Button, Form, FormField, TextInput } from 'grommet'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { parseRoseStringToBaseUnitString } from 'app/lib/helpers'
import { Modal } from '../../../../components/Modal/slice/types'

export interface SendTransactionProps {
  isAddressInWallet: boolean
}

export function SendTransaction(props: SendTransactionProps) {
  if (!props.isAddressInWallet) {
    throw new Error('SendTransaction component should only appear on your accounts')
  }

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const launchModal = (modal: Modal) => dispatch(modalActions.launch(modal))
  const { error, success } = useSelector(selectTransaction)
  const validators = useSelector(selectValidators)
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const sendTransaction = () =>
    dispatch(
      transactionActions.sendTransaction({
        type: 'transfer',
        amount: parseRoseStringToBaseUnitString(amount),
        to: recipient.replaceAll(' ', ''),
      }),
    )
  const onSubmit = () => {
    if (validators?.some(validator => validator.address === recipient)) {
      launchModal({
        title: t(
          'account.sendTransaction.confirmSendingToValidator.title',
          'Are you sure you want to continue?',
        ),
        description: t(
          'account.sendTransaction.confirmSendingToValidator.description',
          'This is a validator address. Transfers to this address do not stake your funds with the validator.',
        ),
        handleConfirm: sendTransaction,
        isDangerous: true,
      })
    } else {
      sendTransaction()
    }
  }

  // On successful transaction, clear the fields
  useEffect(() => {
    if (success) {
      setRecipient('')
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
      <Form onSubmit={onSubmit}>
        <Box fill gap="medium" pad="medium">
          <FormField
            htmlFor="recipient-id"
            name="recipient"
            label={t('account.sendTransaction.recipient', 'Recipient')}
          >
            <TextInput
              id="recipient-id"
              name="recipient"
              value={recipient}
              placeholder={t('account.sendTransaction.enterAddress', 'Enter an address')}
              onChange={event => setRecipient(event.target.value)}
              required
            />
          </FormField>
          <FormField htmlFor="amount-id" name="amount" label={t('common.amount', 'Amount')}>
            <TextInput
              id="amount-id"
              name="amount"
              placeholder={t('account.sendTransaction.enterAmount', 'Enter an amount')}
              type="number"
              step="any"
              min="0"
              value={amount}
              onChange={event => setAmount(event.target.value)}
              required
            />
          </FormField>
          <Box direction="row" justify="between" margin={{ top: 'medium' }}>
            <Button type="submit" label={t('account.sendTransaction.send', 'Send')} primary />
          </Box>
        </Box>
      </Form>
      <TransactionStatus error={error} success={success} />
    </Box>
  )
}
