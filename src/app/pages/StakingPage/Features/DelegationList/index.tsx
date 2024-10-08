/**
 *
 * DelegationList
 *
 */
import { AmountFormatter } from 'app/components/AmountFormatter'
import { ShortAddress } from 'app/components/ShortAddress'
import { TimeToEpoch } from 'app/components/TimeToEpoch'
import { formatCommissionPercent } from 'app/lib/helpers'
import { ValidatorStatus } from 'app/pages/StakingPage/Features/ValidatorList/ValidatorStatus'
import { selectIsAddressInWallet } from 'app/state/selectIsAddressInWallet'
import { stakingActions } from 'app/state/staking'
import { selectSelectedAddress, selectValidatorDetails } from 'app/state/staking/selectors'
import { DebondingDelegation, Delegation } from 'app/state/staking/types'
import { Text } from 'grommet/es6/components/Text'
import { Down } from 'grommet-icons/es6/icons/Down'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { dataTableCustomStyles } from 'styles/theme/dataTableTheme'
import { TypeSafeDataTable, ITypeSafeDataTableColumn } from 'types/TypeSafeDataTable'
import { isWebUri } from 'valid-url'

import { DelegationItem } from './DelegationItem'

type Props =
  | {
      type: 'active'
      delegations: Delegation[]
    }
  | {
      type: 'debonding'
      currentEpoch?: number
      delegations: DebondingDelegation[]
    }

/**
 * Renders the list of delegations
 */
export const DelegationList = memo((props: Props) => {
  const type = props.type

  // Create a combined unique key because validatorAddress is not unique in debondings
  const delegations = props.delegations.map(delegation => ({
    ...delegation,
    uniqueKey:
      type === 'active'
        ? delegation.validatorAddress
        : `${delegation.validatorAddress}+${(delegation as DebondingDelegation).epoch}`,
  }))

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const validatorDetails = useSelector(selectValidatorDetails)
  const selectedAddress = useSelector(selectSelectedAddress)

  const isAddressInWallet = useSelector(selectIsAddressInWallet)
  const canReclaim = type === 'active' && isAddressInWallet

  const rowClicked = (row: Delegation | DebondingDelegation) => {
    if (selectedAddress === row.validatorAddress) {
      dispatch(stakingActions.validatorDeselected())
    } else {
      dispatch(stakingActions.validatorSelected(row.validatorAddress))
    }
  }

  const columnTypes: Record<
    'icon' | 'status' | 'name' | 'amount' | 'fee' | 'debondingTimeEnd',
    ITypeSafeDataTableColumn<Delegation>
  > = {
    icon: {
      name: '',
      id: 'icon',
      cell: datum =>
        datum.validator?.media?.logotype &&
        isWebUri(datum.validator?.media.logotype) && (
          <img src={datum.validator?.media.logotype} loading="lazy" className={'logotype-small'} alt="" />
        ),
      width: '34px',
    },
    status: {
      name: '',
      id: 'status',
      cell: datum =>
        datum.validator && (
          <ValidatorStatus status={datum.validator.status} showLabel={false}></ValidatorStatus>
        ),
      width: '34px',
    },
    name: {
      name: t('validator.name', 'Name'),
      id: 'name',
      selector: 'name',
      maxWidth: '40ex',
      minWidth: '15ex',
      cell: datum =>
        datum.validator?.name ?? (
          <Text data-tag="allowRowEvents">
            <ShortAddress address={datum.validatorAddress} />
          </Text>
        ),
      sortable: true,
      sortFunction: (row1, row2) =>
        (row1.validator?.name ?? row1.validatorAddress).localeCompare(
          row2.validator?.name ?? row2.validatorAddress,
        ),
    },
    amount: {
      name:
        type === 'active'
          ? t('delegations.delegatedAmount', 'Delegated amount')
          : t('delegations.reclaimedAmount', 'Amount to reclaim'),
      id: 'amount',
      selector: 'amount',
      width: '28ex',
      right: true,
      cell: datum =>
        datum.amount && (
          <AmountFormatter amount={datum.amount} maximumFractionDigits={2} minimumFractionDigits={2} />
        ),
      sortable: true,
      sortFunction: (row1, row2) => Number(BigInt(row1.amount) - BigInt(row2.amount)),
    },
    fee: {
      name: t('validator.fee', 'Fee'),
      id: 'fee',
      selector: 'fee',
      width: '100px',
      right: true,
      hide: 'sm',
      cell: datum =>
        datum.validator?.current_rate !== undefined
          ? `${formatCommissionPercent(datum.validator.current_rate)}%`
          : 'Unknown',
      sortable: true,
      sortFunction: (row1, row2) => (row1.validator?.current_rate ?? 0) - (row2.validator?.current_rate ?? 0),
    },
    debondingTimeEnd: {
      name: t('delegations.debondingTimeEnd', 'End of debonding'),
      id: 'debondingTimeEnd',
      selector: 'epoch',
      sortable: true,
      cell: datum => {
        if ('currentEpoch' in props) {
          return (
            <TimeToEpoch currentEpoch={props.currentEpoch} epoch={(datum as DebondingDelegation).epoch} />
          )
        }
      },
    },
  }

  const columns =
    type === 'active'
      ? [columnTypes.icon, columnTypes.status, columnTypes.name, columnTypes.amount, columnTypes.fee]
      : [columnTypes.icon, columnTypes.name, columnTypes.amount, columnTypes.debondingTimeEnd]

  const defaultSortField: undefined | keyof DebondingDelegation = type === 'active' ? undefined : 'epoch'

  return (
    <TypeSafeDataTable
      noHeader={true}
      noDataComponent={
        type === 'active'
          ? t(
              'account.emptyActiveDelegationsList',
              'There are currently no active delegations for this account.',
            )
          : t('account.emptyDebondingDelegationsList', 'There are no debonding delegations for this account.')
      }
      columns={columns}
      data={delegations}
      defaultSortField={defaultSortField}
      keyField="uniqueKey"
      style={{}}
      customStyles={dataTableCustomStyles}
      expandableRowsHideExpander
      expandableRows={true}
      expandableRowsComponent={
        <DelegationItem
          data={{} as any}
          validatorDetails={validatorDetails}
          canReclaim={canReclaim}
          type={type}
        />
      }
      expandableRowExpanded={row => row.validatorAddress === selectedAddress}
      sortIcon={<Down />}
      theme="blank"
      onRowClicked={rowClicked}
      highlightOnHover
      pointerOnHover
    />
  )
})
