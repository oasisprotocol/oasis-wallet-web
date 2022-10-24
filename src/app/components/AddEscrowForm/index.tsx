/**
 *
 * AddEscrowForm
 *
 */
import { Modal } from '../Modal/slice/types'
import { modalActions } from '../Modal/slice'
import { parseRoseStringToBaseUnitString } from 'app/lib/helpers'
import { selectMinStaking } from 'app/state/network/selectors'
import { Validator } from 'app/state/staking/types'
import { transactionActions } from 'app/state/transaction'
import { selectTransaction } from 'app/state/transaction/selectors'
import { Box, Button, CheckBox, Form, TextInput } from 'grommet'
import React, { memo, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'

import { TransactionStatus } from '../TransactionStatus'

interface Props {
  validatorAddress: string
  validatorStatus: Validator['status']
  validatorRank: number
}

export const AddEscrowForm = memo((props: Props) => {
  const { t } = useTranslation()
  const launchModal = (modal: Modal) => dispatch(modalActions.launch(modal))
  const { error, success } = useSelector(selectTransaction)
  const isTop20 = props.validatorRank <= 20
  const [showNotice, setShowNotice] = useState(isTop20)
  const [amount, setAmount] = useState('')
  const dispatch = useDispatch()
  const minStaking = useSelector(selectMinStaking)

  const delegate = () => {
    dispatch(
      transactionActions.addEscrow({
        type: 'addEscrow',
        amount: parseRoseStringToBaseUnitString(amount),
        validator: props.validatorAddress,
      }),
    )
  }
  const submit = () => {
    if (props.validatorStatus !== 'active') {
      launchModal({
        title: t('account.addEscrow.confirmDelegatingToInactive.title', 'Are you sure you want to continue?'),
        description: t(
          'account.addEscrow.confirmDelegatingToInactive.description',
          'Status of this validator is {{validatorStatus}}. Your delegation might not generate any rewards.',
          { validatorStatus: props.validatorStatus },
        ),
        handleConfirm: delegate,
        isDangerous: true,
      })
    } else {
      delegate()
    }
  }

  useEffect(() => {
    return () => {
      dispatch(transactionActions.clearTransaction())
    }
  }, [dispatch])

  return (
    <>
      {showNotice && (
        <Box pad={{ vertical: 'medium' }} gap="xsmall">
          {t(
            'account.addEscrow.confirmDelegatingToTop.description',
            'This validator is ranked in the top 20 by stake. Please consider delegating to a smaller validator to increase network security and decentralization.',
          )}
          <CheckBox
            label={t('account.addEscrow.confirmDelegatingToTop.acknowledge', 'Delegate anyway')}
            checked={!showNotice}
            onChange={event => setShowNotice(!event.target.checked)}
          />
        </Box>
      )}
      {!showNotice && (
        <Form onSubmit={submit}>
          <Box direction="row" gap="small" pad={{ top: 'small' }}>
            <Box background="background-front">
              <TextInput
                data-testid="amount"
                id="amount-id"
                name="amount"
                placeholder={t('common.amount')}
                type="number"
                step="any"
                min={minStaking}
                value={amount}
                onChange={event => setAmount(event.target.value)}
                required
              />
            </Box>
            <Button label={t('account.addEscrow.delegate', 'Delegate')} type="submit" primary />
          </Box>
          <TransactionStatus error={error} success={success} />
        </Form>
      )}
    </>
  )
})
