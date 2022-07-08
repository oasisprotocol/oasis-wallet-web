/**
 *
 * Transaction
 *
 */
import { Box, Button, Card, CardBody, CardFooter, CardHeader, Grid, Text } from 'grommet'
import {
  CircleInformation,
  ContactInfo,
  Cube,
  Money,
  Inherit,
  LineChart,
  New,
  LinkPrevious,
  LinkNext,
} from 'grommet-icons/icons'
import * as React from 'react'
import { NavLink } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'

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
      icon: () => React.ReactNode
      header: () => React.ReactNode
      designation: string
    }
  }
}

interface TransactionProps {
  referenceAddress: string
  transaction: transactionTypes.Transaction
  network: NetworkType
}

export function Transaction(props: TransactionProps) {
  const { t } = useTranslation()
  const transaction = props.transaction
  const referenceAddress = props.referenceAddress
  const amount = <AmountFormatter amount={transaction.amount!} />

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
    icon: () => <New />,
    header: () => (
      <Trans
        i18nKey="account.otherTransaction.header"
        t={t}
        values={{ method: transaction.method }}
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
        icon: () => <LinkPrevious />,
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
        icon: () => <LinkNext />,
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
        icon: () => <LineChart />,
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
        icon: () => <LineChart />,
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
        icon: () => <Money />,
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
        icon: () => <Money />,
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
    [transactionTypes.TransactionType.ConsensusDeposit]: {
      [TransactionSide.Received]: unrecognizedTransaction,
      [TransactionSide.Sent]: {
        designation: t('common.to', 'To'),
        icon: () => <Inherit />,
        header: () => (
          <Trans
            i18nKey="account.transaction.consensusDeposit.sent"
            t={t}
            values={{ runtimeName: transaction.runtimeName }}
            defaults={`{{runtimeName}} deposit`}
          />
        ),
      },
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

  const icon = matchingConfiguration.icon()
  const header = matchingConfiguration.header()
  const designation = matchingConfiguration.designation
  const backendLinks = config[props.network][backend()]
  const blockExplorerLink = backendLinks?.blockExplorer
  const blockExplorerParatimesLink = backendLinks?.blockExplorerParatimes

  return (
    <Card round="small" background="background-front" gap="none" elevation="xsmall">
      <CardHeader
        pad={{ horizontal: 'medium', vertical: 'small' }}
        gap="none"
        background={transaction.status ? (transaction.runtimeName ? 'accent-4' : 'brand') : 'status-error'}
        wrap={true}
      >
        <Box direction="row" gap="small">
          {icon}
          <Text>{header}</Text>
        </Box>
        {!transaction.status && (
          <Text weight="bold">{t('account.transaction.transactionFailed', 'Failed')}</Text>
        )}
      </CardHeader>
      <CardBody pad={{ horizontal: 'none', vertical: 'none' }}>
        <Grid columns={{ count: 'fit', size: 'xsmall' }} gap="none">
          <InfoBox icon={<Money color="brand" />} label={t('common.amount', 'Amount')} value={amount} />
          {otherAddress && (
            <NavLink data-testid="external-wallet-address" to={`/account/${otherAddress}`}>
              <InfoBox
                icon={<ContactInfo color="brand" />}
                label={designation}
                value={<ShortAddress address={otherAddress} />}
              />
            </NavLink>
          )}
          {!otherAddress && (
            <InfoBox
              icon={<ContactInfo color="brand" />}
              label={designation}
              value={t('common.unavailable', 'Unavailable')}
            />
          )}
          {transaction.runtimeName ? (
            <InfoBox label="Round" value={transaction.round} />
          ) : (
            <InfoBox
              icon={<Cube color="brand" />}
              label={t('common.block', 'Block')}
              value={transaction.level}
            />
          )}
        </Grid>
      </CardBody>
      <CardFooter background="background-contrast" pad={{ horizontal: 'medium' }}>
        <Text size="small">
          <DateFormatter date={transaction.timestamp!} />
        </Text>
        <Box direction="row">
          <Button
            icon={<CircleInformation color="dark-3" />}
            hoverIndicator
            href={
              transaction.runtimeId
                ? blockExplorerParatimesLink
                    ?.replace('{{txHash}}', encodeURIComponent(transaction.hash))
                    .replace('{{runtimeId}}', encodeURIComponent(transaction.runtimeId))
                : blockExplorerLink.replace('{{txHash}}', encodeURIComponent(transaction.hash))
            }
            target="_blank"
            rel="noopener"
            data-testid="explorer-link"
          />
        </Box>
      </CardFooter>
    </Card>
  )
}
