/**
 *
 * Transaction
 *
 */
import { Anchor } from 'grommet/es6/components/Anchor'
import { Box } from 'grommet/es6/components/Box'
import { Card } from 'grommet/es6/components/Card'
import { CardBody } from 'grommet/es6/components/CardBody'
import { CardFooter } from 'grommet/es6/components/CardFooter'
import { CardHeader } from 'grommet/es6/components/CardHeader'
import { Grid } from 'grommet/es6/components/Grid'
import { ResponsiveContext } from 'grommet/es6/contexts/ResponsiveContext'
import { Text } from 'grommet/es6/components/Text'

import { Package } from 'grommet-icons/es6/icons/Package'
import { Clock } from 'grommet-icons/es6/icons/Clock'
import { ContactInfo } from 'grommet-icons/es6/icons/ContactInfo'
import { Cube } from 'grommet-icons/es6/icons/Cube'
import { FormNext } from 'grommet-icons/es6/icons/FormNext'
import { Money } from 'grommet-icons/es6/icons/Money'
import { Inherit } from 'grommet-icons/es6/icons/Inherit'
import { LineChart } from 'grommet-icons/es6/icons/LineChart'
import { New } from 'grommet-icons/es6/icons/New'
import { LinkPrevious } from 'grommet-icons/es6/icons/LinkPrevious'
import { LinkNext } from 'grommet-icons/es6/icons/LinkNext'
import { Atm } from 'grommet-icons/es6/icons/Atm'
import { Alert } from 'grommet-icons/es6/icons/Alert'
import { MuiLocalFireDepartmentIcon } from '../../../styles/theme/icons/mui-icons/MuiLocalFireDepartmentIcon'
// eslint-disable-next-line no-restricted-imports
import type { Icon } from 'grommet-icons/es6/icons'
import * as React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { AmountFormatter } from '../AmountFormatter'
import { intlDateTimeFormat } from '../DateFormatter/intlDateTimeFormat'
import { trimLongString } from '../ShortAddress/trimLongString'
import { InfoBox } from './InfoBox'
import * as transactionTypes from 'app/state/transaction/types'
import { TransactionStatus } from 'app/state/transaction/types'
import { NetworkType } from 'app/state/network/types'
import { config } from 'config'
import { backend } from 'vendors/backend'
import { AddressFormatter } from '../AddressFormatter'

enum TransactionSide {
  Sent = 'sent',
  Received = 'received',
}

type TransactionDictionary = {
  [type in transactionTypes.TransactionType]: {
    [side in TransactionSide]: {
      icon: Icon
      header: () => React.ReactNode
      destination: string
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
  const Amount = (
    <AmountFormatter amount={transaction.amount!} size={isMobile ? '16px' : 'medium'} plainTicker />
  )
  let side: TransactionSide
  let otherAddress = ''

  if (transaction.from === referenceAddress) {
    side = TransactionSide.Sent
    otherAddress = transaction.to!
  } else {
    side = TransactionSide.Received
    otherAddress = transaction.from!
  }

  const genericTransaction: TransactionDictionary[transactionTypes.TransactionType][TransactionSide] = {
    destination: t('account.transaction.genericTransaction.destination', 'Other address'),
    icon: New,
    header: () => (
      <Trans
        i18nKey="account.transaction.genericTransaction.header"
        t={t}
        values={{ method: transaction.type }}
        defaults="Method '{{method}}'"
      />
    ),
  }

  const unrecognizedTransaction: TransactionDictionary[transactionTypes.TransactionType][TransactionSide] = {
    destination: t('account.transaction.unrecognizedTransaction.destination', 'Other address'),
    icon: Alert,
    header: () => (
      <Trans
        i18nKey="account.transaction.unrecognizedTransaction.header"
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
        destination: t('common.from', 'From'),
        icon: LinkPrevious,
        header: () => (
          <Trans
            i18nKey="account.transaction.transfer.received"
            t={t}
            components={{ Amount }}
            defaults="Received <Amount/>"
          />
        ),
      },
      [TransactionSide.Sent]: {
        destination: t('common.to', 'To'),
        icon: LinkNext,
        header: () => (
          <Trans
            i18nKey="account.transaction.transfer.sent.header"
            t={t}
            components={{ Amount }}
            defaults="Sent <Amount/>"
          />
        ),
      },
    },
    [transactionTypes.TransactionType.StakingAddEscrow]: {
      [TransactionSide.Received]: {
        destination: t('common.delegator', 'Delegator'),
        icon: LineChart,
        header: () => (
          <Trans
            i18nKey="account.transaction.addEscrow.received"
            t={t}
            components={{ Amount }}
            defaults="Received <Amount> delegation in escrow"
          />
        ),
      },
      [TransactionSide.Sent]: {
        destination: t('common.validator', 'Validator'),
        icon: LineChart,
        header: () => (
          <Trans
            i18nKey="account.transaction.addEscrow.sent"
            t={t}
            components={{ Amount }}
            defaults="Delegated <Amount/> to validator"
          />
        ),
      },
    },
    [transactionTypes.TransactionType.StakingReclaimEscrow]: {
      [TransactionSide.Received]: {
        destination: t('common.delegator', 'Delegator'),
        icon: Money,
        header: () => (
          <Trans
            i18nKey="account.transaction.reclaimEscrow.received"
            t={t}
            components={{ Amount }}
            defaults="<Amount/> reclaimed by delegator"
          />
        ),
      },
      [TransactionSide.Sent]: {
        destination: t('common.validator', 'Validator'),
        icon: Money,
        header: () => (
          <Trans
            i18nKey="account.transaction.reclaimEscrow.sent"
            t={t}
            components={{ Amount }}
            defaults="Reclaimed <Amount/> from validator"
          />
        ),
      },
    },
    [transactionTypes.TransactionType.ConsensusDeposit]: {
      [TransactionSide.Received]: {
        destination: t('common.from', 'From'),
        icon: () => <Inherit color="#FFCA58" />,
        header: () => (
          <Trans
            i18nKey="account.transaction.consensusDeposit.received"
            t={t}
            values={{ runtimeName: transaction.runtimeName }}
            components={{ Amount }}
            defaults="Received <Amount/> deposit into {{runtimeName}} ParaTime"
          />
        ),
      },
      [TransactionSide.Sent]: {
        destination: t('common.to', 'To'),
        icon: () => <Inherit color="#FFCA58" />,
        header: () => (
          <Trans
            i18nKey="account.transaction.consensusDeposit.sent"
            t={t}
            values={{ runtimeName: transaction.runtimeName }}
            components={{ Amount }}
            defaults="Deposited <Amount/> into {{runtimeName}} ParaTime"
          />
        ),
      },
    },
    [transactionTypes.TransactionType.ConsensusWithdraw]: {
      [TransactionSide.Received]: {
        destination: t('common.from', 'From'),
        icon: () => <Inherit color="#FFCA58" />,
        header: () => (
          <Trans
            i18nKey="account.transaction.consensusWithdraw.received"
            t={t}
            values={{ runtimeName: transaction.runtimeName }}
            components={{ Amount }}
            defaults="Withdrew <Amount/> out of {{runtimeName}} ParaTime"
          />
        ),
      },
      [TransactionSide.Sent]: {
        destination: t('common.to', 'To'),
        icon: () => <Inherit color="#FFCA58" />,
        header: () => (
          <Trans
            i18nKey="account.transaction.consensusWithdraw.sent"
            t={t}
            values={{ runtimeName: transaction.runtimeName }}
            components={{ Amount }}
            defaults="Received <Amount/> from withdrawal out of {{runtimeName}} ParaTime"
          />
        ),
      },
    },
    [transactionTypes.TransactionType.StakingAllow]: {
      [TransactionSide.Received]: {
        destination: t('common.from', 'From'),
        icon: Atm,
        header: () => (
          <Trans
            i18nKey="account.transaction.stakingAllow.received"
            t={t}
            components={{ Amount }}
            defaults="Received <Amount/> allowance"
          />
        ),
      },
      [TransactionSide.Sent]: {
        destination: t('common.to', 'To'),
        icon: Atm,
        header: () => (
          <Trans
            i18nKey="account.transaction.stakingAllow.sent"
            t={t}
            components={{ Amount }}
            // TODO: try to resolve destination to a runtime name
            defaults="Set <Amount/> allowance"
          />
        ),
      },
    },
    [transactionTypes.TransactionType.StakingBurn]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: {
        destination: t('account.transaction.genericTransaction.destination', 'Other address'),
        icon: MuiLocalFireDepartmentIcon,
        header: () => (
          <Trans
            i18nKey="account.transaction.stakingBurn.sent"
            t={t}
            components={{ Amount }}
            defaults="Burned <Amount/>"
          />
        ),
      },
    },

    [transactionTypes.TransactionType.StakingAmendCommissionSchedule]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
    [transactionTypes.TransactionType.StakingWithdraw]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
    [transactionTypes.TransactionType.RoothashExecutorCommit]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
    [transactionTypes.TransactionType.RoothashExecutorProposerTimeout]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
    [transactionTypes.TransactionType.RoothashSubmitMsg]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
    [transactionTypes.TransactionType.RegistryDeregisterEntity]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
    [transactionTypes.TransactionType.RegistryRegisterEntity]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
    [transactionTypes.TransactionType.RegistryRegisterNode]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
    [transactionTypes.TransactionType.RegistryRegisterRuntime]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
    [transactionTypes.TransactionType.RegistryUnfreezeNode]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
    [transactionTypes.TransactionType.GovernanceCastVote]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
    [transactionTypes.TransactionType.GovernanceSubmitProposal]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
    [transactionTypes.TransactionType.BeaconPvssCommit]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
    [transactionTypes.TransactionType.BeaconPvssReveal]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
    [transactionTypes.TransactionType.BeaconVrfProve]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
    [transactionTypes.TransactionType.ConsensusMeta]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
    [transactionTypes.TransactionType.ConsensusAccountsParameters]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
    [transactionTypes.TransactionType.ConsensusBalance]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
    [transactionTypes.TransactionType.ConsensusAccount]: {
      [TransactionSide.Received]: genericTransaction,
      [TransactionSide.Sent]: genericTransaction,
    },
  }

  const isTypeRecognized = (type: string | undefined): type is transactionTypes.TransactionType =>
    type ? type in transactionDictionary : false

  const matchingConfiguration = isTypeRecognized(transaction.type)
    ? transactionDictionary[transaction.type][side]
    : unrecognizedTransaction

  const Icon = matchingConfiguration.icon
  const header = matchingConfiguration.header()
  const destination = matchingConfiguration.destination
  const backendLinks = config[props.network][backend()]
  const externalExplorerLink = transaction.runtimeId
    ? backendLinks.blockExplorerParatimes
        ?.replace('{{txHash}}', encodeURIComponent(transaction.hash))
        .replace('{{runtimeId}}', encodeURIComponent(transaction.runtimeId))
    : backendLinks.blockExplorer.replace('{{txHash}}', encodeURIComponent(transaction.hash))

  return (
    <Card
      pad={isMobile ? { horizontal: 'small', top: 'medium', bottom: 'small' } : 'small'}
      round="xsmall"
      elevation="none"
      background="background-front"
    >
      <CardHeader
        margin={{ bottom: 'small' }}
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
                  <AddressFormatter address={otherAddress} />
                ) : (
                  <span>{t('common.unavailable', 'Unavailable')}</span>
                )}
              </Text>
              <Text size="small">{intlDateTimeFormat(transaction.timestamp!)}</Text>
            </Box>
          )}

          {!isMobile && (
            <Grid columns={{ count: 'fit', size: 'xsmall' }} gap="none">
              <Box pad="none">
                <InfoBox copyToClipboardValue={otherAddress} icon={ContactInfo} label={destination}>
                  {otherAddress ? (
                    <AddressFormatter address={otherAddress} />
                  ) : (
                    <span>{t('common.unavailable', 'Unavailable')}</span>
                  )}
                </InfoBox>
                <InfoBox
                  copyToClipboardValue={transaction.hash}
                  icon={Package}
                  label={t('common.hash', 'Tx Hash')}
                >
                  <Text>{trimLongString(transaction.hash)}</Text>
                </InfoBox>
              </Box>

              <Box pad="none">
                {transaction.timestamp && (
                  <InfoBox icon={Clock} label={t('common.time', 'Time')}>
                    {intlDateTimeFormat(transaction.timestamp)}
                  </InfoBox>
                )}

                {!transaction.runtimeId && transaction.level && (
                  <InfoBox icon={Cube} label={t('common.block', 'Block')}>
                    {transaction.level.toString()}
                  </InfoBox>
                )}

                {transaction.runtimeId && transaction.round && (
                  <InfoBox icon={Cube} label={t('common.round', 'Round')}>
                    {transaction.round.toString()}
                  </InfoBox>
                )}
              </Box>
            </Grid>
          )}
        </Box>
        <Box width="25%" align="end" pad={{ right: 'small' }} margin={{ top: 'xsmall' }}>
          <Text weight="bold" size={isMobile ? 'medium' : 'xlarge'}>
            <AmountFormatter amount={transaction.amount!} smallTicker />
          </Text>
          <Text
            color={(() => {
              switch (transaction.status) {
                case TransactionStatus.Successful:
                  return 'successful-label'
                case TransactionStatus.Pending:
                  return 'status-warning'
                case TransactionStatus.Failed:
                default:
                  return 'status-error'
              }
            })()}
            size="small"
            weight="bold"
          >
            {(() => {
              switch (transaction.status) {
                case TransactionStatus.Successful:
                  return <span>{t('account.transaction.successful', 'Successful')}</span>
                case TransactionStatus.Pending:
                  return <span>{t('account.transaction.pending', 'Pending')}</span>
                case TransactionStatus.Failed:
                default:
                  return <span>{t('account.transaction.failed', 'Failed')}</span>
              }
            })()}
          </Text>
        </Box>
      </StyledCardBody>
      <CardFooter justify="center" fill="horizontal">
        <Anchor
          href={externalExplorerLink}
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
