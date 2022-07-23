/**
 *
 * Transaction
 *
 */
import { Anchor, Box, Card, CardBody, CardFooter, CardHeader, Grid, ResponsiveContext, Text } from 'grommet'
import {
  Package,
  Clock,
  ContactInfo,
  Cube,
  FormNext,
  Money,
  LineChart,
  New,
  LinkPrevious,
  LinkNext,
} from 'grommet-icons/icons'
import type { Icon } from 'grommet-icons/icons'
import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { AmountFormatter } from '../AmountFormatter'
import { DateFormatter } from '../DateFormatter'
import { ShortAddress } from '../ShortAddress'
import { InfoBox } from './InfoBox'
import * as transactionTypes from 'app/state/transaction/types'
import { NetworkType } from 'app/state/network/types'
import { config } from 'config'
import { backend } from 'vendors/backend'

export enum TransactionSide {
  Sent = 'sent',
  Received = 'received',
}

type TransactionDictionary = {
  [type in transactionTypes.TransactionType]: {
    [side in TransactionSide]: {
      icon: Icon
      header: () => React.ReactNode
      designation: string
    }
  }
}

const StyledCardBody = styled(CardBody)`
  flex-direction: row;

  @media only screen and (min-width: ${({ theme }) =>
      // TODO: extend theme global breakpoints with more breakpoints or at least with 1024px. Requires Sidebar refactor and Grommet lib validation
      `${theme.global?.breakpoints?.small?.value}px`}) and (max-width: 1024px) {
    flex-direction: column-reverse;
    align-items: flex-end;

    > * {
      width: 100%;
    }
  }
`

interface TransactionProps {
  referenceAddress: string
  transaction: transactionTypes.Transaction
  network: NetworkType
}

export function Transaction(props: TransactionProps) {
  const { t } = useTranslation()
  const isMobile = React.useContext(ResponsiveContext) === 'small'
  const transaction = props.transaction
  const referenceAddress = props.referenceAddress
  const amount = <AmountFormatter amount={transaction.amount!} size={isMobile ? '16px' : 'medium'} />

  let side: TransactionSide
  let otherAddress = ''

  if (transaction.from === referenceAddress) {
    side = TransactionSide.Sent
    otherAddress = transaction.to!
  } else {
    side = TransactionSide.Received
    otherAddress = transaction.from!
  }

  const unrecognizedTransaction: TransactionDictionary[transactionTypes.TransactionType][TransactionSide] = {
    designation: t('account.otherTransaction.designation', 'Other address'),
    icon: New,
    header: () => (
      <Trans
        i18nKey="account.otherTransaction.header"
        t={t}
        values={{ method: transaction.type }}
        defaults="Unrecognized transaction, method '{{method}}'"
      />
    ),
  }

  // @TODO: This could probably cleverly be moved outside of the component
  //for better readability and marginal performance gain, but for now
  //the translation keys need to be read by i18next extraction
  const transactionDictionary: TransactionDictionary = {
    [transactionTypes.TransactionType.StakingTransfer]: {
      [TransactionSide.Received]: {
        designation: t('common.from', 'From'),
        icon: LinkPrevious,
        header: () => (
          <Trans
            i18nKey="account.transaction.transfer.received"
            t={t}
            components={[amount]}
            defaults="Received <0></0>"
          />
        ),
      },
      [TransactionSide.Sent]: {
        designation: t('common.to', 'To'),
        icon: LinkNext,
        header: () => (
          <Trans
            i18nKey="account.transaction.transfer.sent.header"
            t={t}
            components={[amount]}
            defaults="Sent <0></0>"
          />
        ),
      },
    },
    [transactionTypes.TransactionType.StakingAddEscrow]: {
      [TransactionSide.Received]: {
        designation: t('common.delegator', 'Delegator'),
        icon: LineChart,
        header: () => (
          <Trans
            i18nKey="account.transaction.addEscrow.received"
            t={t}
            components={[amount]}
            defaults="Received <0></0> delegation in escrow"
          />
        ),
      },
      [TransactionSide.Sent]: {
        designation: t('common.validator', 'Validator'),
        icon: LineChart,
        header: () => (
          <Trans
            i18nKey="account.transaction.addEscrow.sent"
            t={t}
            components={[amount]}
            defaults="Delegated <0></0> to validator"
          />
        ),
      },
    },
    [transactionTypes.TransactionType.StakingReclaimEscrow]: {
      [TransactionSide.Received]: {
        designation: t('common.delegator', 'Delegator'),
        icon: Money,
        header: () => (
          <Trans
            i18nKey="account.transaction.reclaimEscrow.received"
            t={t}
            components={[amount]}
            defaults="<0></0> reclaimed by delegator"
          />
        ),
      },
      [TransactionSide.Sent]: {
        designation: t('common.validator', 'Validator'),
        icon: Money,
        header: () => (
          <Trans
            i18nKey="account.transaction.reclaimEscrow.sent"
            t={t}
            components={[amount]}
            defaults="Reclaimed <0></0> from validator"
          />
        ),
      },
    },
    [transactionTypes.TransactionType.StakingAmendCommissionSchedule]: {
      [TransactionSide.Received]: unrecognizedTransaction,
      [TransactionSide.Sent]: unrecognizedTransaction,
    },
    [transactionTypes.TransactionType.StakingAllow]: {
      [TransactionSide.Received]: unrecognizedTransaction,
      [TransactionSide.Sent]: unrecognizedTransaction,
    },
    [transactionTypes.TransactionType.StakingWithdraw]: {
      [TransactionSide.Received]: unrecognizedTransaction,
      [TransactionSide.Sent]: unrecognizedTransaction,
    },
    [transactionTypes.TransactionType.RoothashExecutorCommit]: {
      [TransactionSide.Received]: unrecognizedTransaction,
      [TransactionSide.Sent]: unrecognizedTransaction,
    },
    [transactionTypes.TransactionType.RoothashExecutorProposerTimeout]: {
      [TransactionSide.Received]: unrecognizedTransaction,
      [TransactionSide.Sent]: unrecognizedTransaction,
    },
    [transactionTypes.TransactionType.RegistryRegisterEntity]: {
      [TransactionSide.Received]: unrecognizedTransaction,
      [TransactionSide.Sent]: unrecognizedTransaction,
    },
    [transactionTypes.TransactionType.RegistryRegisterNode]: {
      [TransactionSide.Received]: unrecognizedTransaction,
      [TransactionSide.Sent]: unrecognizedTransaction,
    },
    [transactionTypes.TransactionType.RegistryRegisterRuntime]: {
      [TransactionSide.Received]: unrecognizedTransaction,
      [TransactionSide.Sent]: unrecognizedTransaction,
    },
    [transactionTypes.TransactionType.GovernanceCastVote]: {
      [TransactionSide.Received]: unrecognizedTransaction,
      [TransactionSide.Sent]: unrecognizedTransaction,
    },
    [transactionTypes.TransactionType.GovernanceSubmitProposal]: {
      [TransactionSide.Received]: unrecognizedTransaction,
      [TransactionSide.Sent]: unrecognizedTransaction,
    },
    [transactionTypes.TransactionType.BeaconPvssCommit]: {
      [TransactionSide.Received]: unrecognizedTransaction,
      [TransactionSide.Sent]: unrecognizedTransaction,
    },
    [transactionTypes.TransactionType.BeaconPvssReveal]: {
      [TransactionSide.Received]: unrecognizedTransaction,
      [TransactionSide.Sent]: unrecognizedTransaction,
    },
    [transactionTypes.TransactionType.BeaconVrfProve]: {
      [TransactionSide.Received]: unrecognizedTransaction,
      [TransactionSide.Sent]: unrecognizedTransaction,
    },
  }

  const isTypeRecognized = (type: string | undefined): type is transactionTypes.TransactionType =>
    type ? type in transactionDictionary : false

  const matchingConfiguration = isTypeRecognized(transaction.type)
    ? transactionDictionary[transaction.type][side]
    : unrecognizedTransaction

  const Icon = matchingConfiguration.icon
  const header = matchingConfiguration.header()
  const designation = matchingConfiguration.designation
  const blockExplorerLink = config[props.network][backend()]?.blockExplorer

  return (
    <Card
      pad={isMobile ? { horizontal: 'small', top: 'medium', bottom: 'small' } : 'small'}
      round="xsmall"
      elevation="none"
      background="background-front"
    >
      <CardHeader
        margin={{ bottom: 'medium' }}
        pad={{ bottom: isMobile ? 'medium' : 'small' }}
        border={{ color: 'background-front-border', side: 'bottom' }}
        direction="row"
        align="center"
        justify="start"
        gap="small"
      >
        <Icon size={isMobile ? '20px' : 'medium'} color="brand" />
        <Text weight="bold" size={isMobile ? '16px' : 'medium'}>
          {header}
        </Text>
      </CardHeader>
      <StyledCardBody margin={{ bottom: 'small' }}>
        <Box width="75%">
          {isMobile && (
            <Box pad={{ left: 'small' }}>
              <Text size="16px" margin={{ bottom: 'xsmall' }}>
                {otherAddress ? (
                  <ShortAddress address={otherAddress} />
                ) : (
                  t('common.unavailable', 'Unavailable')
                )}
              </Text>
              <Text size="small">
                <DateFormatter date={transaction.timestamp!} />
              </Text>
            </Box>
          )}

          {!isMobile && (
            <Grid columns={{ count: 'fit', size: 'xsmall' }} gap="none">
              <Box pad="none">
                {otherAddress && (
                  <NavLink data-testid="external-wallet-address" to={`/account/${otherAddress}`}>
                    <InfoBox
                      icon={ContactInfo}
                      label={designation}
                      value={<ShortAddress address={otherAddress} />}
                    />
                  </NavLink>
                )}
                {!otherAddress && (
                  <InfoBox
                    icon={ContactInfo}
                    label={designation}
                    value={t('common.unavailable', 'Unavailable')}
                  />
                )}
                <InfoBox
                  icon={Package}
                  label={t('common.hash', 'Tx Hash')}
                  value={<ShortAddress address={transaction.hash} />}
                />
              </Box>

              <Box pad="none">
                <InfoBox
                  icon={Clock}
                  label={t('common.time', 'Time')}
                  value={<DateFormatter date={transaction.timestamp!} />}
                />

                <InfoBox icon={Cube} label={t('common.block', 'Block')} value={transaction.level} />
              </Box>
            </Grid>
          )}
        </Box>
        <Box width="25%" align="end" pad={{ right: 'small' }}>
          <Text weight="bold" size={isMobile ? 'medium' : 'xlarge'}>
            <AmountFormatter amount={transaction.amount!} smallTicker />
          </Text>
          <Text
            color={transaction.status ? 'successful-label' : 'status-error'}
            size={isMobile ? 'xsmall' : 'small'}
            weight="bold"
          >
            {transaction.status
              ? t('account.transaction.successful', 'Successful')
              : t('account.transaction.failed', 'Failed')}
          </Text>
        </Box>
      </StyledCardBody>
      <CardFooter justify="center" fill="horizontal">
        <Anchor
          href={blockExplorerLink.replace('{{txHash}}', encodeURIComponent(transaction.hash))}
          target="_blank"
          rel="noopener"
          data-testid="explorer-link"
          color="brand"
        >
          <Text size={isMobile ? 'xsmall' : 'small'}>
            {t('account.transaction.explorerLink', 'View transaction records through explorer')}
          </Text>
          <FormNext color="brand" size="20px" />
        </Anchor>
      </CardFooter>
    </Card>
  )
}
