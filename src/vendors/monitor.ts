import * as oasis from '@oasisprotocol/client'
import { StakingDebondingDelegationInfo, StakingDelegationInfo } from '@oasisprotocol/client/dist/types'
import { Account } from 'app/state/account/types'
import { DebondingDelegation, Delegation, Validator } from 'app/state/staking/types'
import { Transaction, TransactionType } from 'app/state/transaction/types'
import {
  AccountsApi,
  AccountsRow,
  BlocksApi,
  Configuration,
  OperationsListApi,
  OperationsRow,
  OperationsRowTypeEnum,
  ValidatorCommissionScheduleRates,
  ValidatorRow,
} from 'vendors/explorer'
import { addressToPublicKey } from 'app/lib/helpers'

import { sortByStatus, throwAPIErrors } from './helpers'

export function getMonitorAPIs(url: string | 'https://monitor.oasis.dev') {
  const explorerConfig = new Configuration({
    basePath: url,
    ...throwAPIErrors,
  })

  const accounts = new AccountsApi(explorerConfig)
  const blocks = new BlocksApi(explorerConfig)
  const operations = new OperationsListApi(explorerConfig)

  async function getAccount(address: string): Promise<Account> {
    const account = await accounts.getAccount({ accountId: address })
    return parseAccount(account)
  }

  async function getAllValidators(): Promise<Validator[]> {
    const validators = await accounts.getValidatorsList({ limit: 500 })
    return parseValidatorsList(validators)
  }

  async function getTransactionsList(params: { accountId: string; limit: number }): Promise<Transaction[]> {
    const transactions = await operations.getTransactionsList({
      accountId: params.accountId,
      limit: params.limit,
    })
    return parseTransactionsList(transactions)
  }

  async function getDelegations(params: { accountId: string; nic: oasis.client.NodeInternal }): Promise<{
    delegations: Delegation[]
    debonding: DebondingDelegation[]
  }> {
    // TODO: convert to explorer API
    const nic = params.nic
    const publicKey = await addressToPublicKey(params.accountId)
    const [delegationsResponse, debondingResponse] = await Promise.all([
      nic.stakingDelegationInfosFor({ owner: publicKey, height: 0 }),
      nic.stakingDebondingDelegationInfosFor({ owner: publicKey, height: 0 }),
    ])

    return {
      delegations: parseDelegations(delegationsResponse),
      debonding: parseDebonding(debondingResponse),
    }
  }

  return { accounts, blocks, getAccount, getAllValidators, getTransactionsList, getDelegations }
}

export function parseAccount(account: AccountsRow): Account {
  return {
    address: account.address,
    available: BigInt(account.liquid_balance).toString(),
    delegations: null,
    debonding: null,
    total: null,
  }
}

export function parseValidatorsList(validators: ValidatorRow[]): Validator[] {
  return (
    validators
      // Always clone before sort so it doesn't mutate source
      .slice()
      .sort((a, b) => b.escrow_balance - a.escrow_balance)
      .map((v, index) => {
        const parsed: Validator = {
          address: v.account_id,
          name: v.account_name,
          nodeAddress: v.node_id,
          escrow: BigInt(v.escrow_balance).toString(),
          current_rate: computeCurrentRate(v.current_epoch!, v.commission_schedule?.rates ?? []),
          status: v.status,
          media: v.media_info,
          rank: index + 1,
        }
        return parsed
      })
      .sort(sortByStatus)
  )
}

function computeCurrentRate(currentEpoch: number, rawRates: ValidatorCommissionScheduleRates[]) {
  const rates = rawRates
    .map(r => ({
      epochStart: r.start ? Number(r.start) : 0,
      rate: Number(r.rate!) / 100_000,
    }))
    // Always clone before sort so it doesn't mutate source
    .slice()
    .sort((a, b) => a.epochStart - b.epochStart)
    // If we have another bound after this one, attach the epochEnd to this one
    .map((b, i, array) => ({
      ...b,
      epochEnd: array[i + 1] ? array[i + 1].epochStart - 1 : undefined,
    }))

    // Filter out bounds that ended in the past
    .filter(b => !b.epochEnd || b.epochEnd > currentEpoch)

  if (!rates.length) {
    return 0
  }
  return rates[rates.length - 1].rate
}

const transactionMethodMap: { [k in OperationsRowTypeEnum]: TransactionType } = {
  [OperationsRowTypeEnum.Transfer]: TransactionType.StakingTransfer,
  [OperationsRowTypeEnum.Addescrow]: TransactionType.StakingAddEscrow,
  [OperationsRowTypeEnum.Reclaimescrow]: TransactionType.StakingReclaimEscrow,
  [OperationsRowTypeEnum.Amendcommissionschedule]: TransactionType.StakingAmendCommissionSchedule,
  [OperationsRowTypeEnum.Allow]: TransactionType.StakingAllow,
  [OperationsRowTypeEnum.Withdraw]: TransactionType.StakingWithdraw,
  [OperationsRowTypeEnum.Executorcommit]: TransactionType.RoothashExecutorCommit,
  [OperationsRowTypeEnum.Executorproposertimeout]: TransactionType.RoothashExecutorProposerTimeout,
  [OperationsRowTypeEnum.Registerentity]: TransactionType.RegistryRegisterEntity,
  [OperationsRowTypeEnum.Registernode]: TransactionType.RegistryRegisterNode,
  [OperationsRowTypeEnum.Registerruntime]: TransactionType.RegistryRegisterRuntime,
  [OperationsRowTypeEnum.Castvote]: TransactionType.GovernanceCastVote,
  [OperationsRowTypeEnum.Submitproposal]: TransactionType.GovernanceSubmitProposal,
  [OperationsRowTypeEnum.Pvsscommit]: TransactionType.BeaconPvssCommit,
  [OperationsRowTypeEnum.Pvssreveal]: TransactionType.BeaconPvssReveal,
  [OperationsRowTypeEnum.Vrfprove]: TransactionType.BeaconVrfProve,
  [OperationsRowTypeEnum.Burn]: TransactionType.StakingBurn,
}

export function parseTransactionsList(transactionsList: OperationsRow[]): Transaction[] {
  return transactionsList.map(t => {
    const amount = t.escrow_amount ?? t.reclaim_escrow_amount ?? t.amount
    const parsed: Transaction = {
      amount: amount == null ? undefined : BigInt(amount).toString(),
      fee: t.fee == null ? undefined : BigInt(t.fee).toString(),
      from: t.from,
      hash: t.hash!,
      level: t.level,
      status: t.status,
      timestamp: t.timestamp == null ? undefined : t.timestamp * 1000,
      to: t.to,
      type: transactionMethodMap[t.type!],
      runtimeName: undefined,
      runtimeId: undefined,
      round: undefined,
    }
    return parsed
  })
}

function parseDelegation(
  bytesAddress: Uint8Array,
  delegation: StakingDelegationInfo | StakingDebondingDelegationInfo,
): Delegation {
  const address = oasis.address.toBech32('oasis', bytesAddress)

  const poolAmount = oasis.quantity.toBigInt(delegation.pool.balance!)
  const poolShares = oasis.quantity.toBigInt(delegation.pool.total_shares!)
  const shares = oasis.quantity.toBigInt(delegation.shares)
  const amount = (shares * poolAmount) / poolShares

  return {
    validatorAddress: address,
    amount: amount.toString(),
    shares: shares.toString(),
  }
}

export function parseDelegations(
  delegationsResponse: Awaited<ReturnType<oasis.client.NodeInternal['stakingDelegationInfosFor']>>,
): Delegation[] {
  const delegations = [...delegationsResponse.entries()].map(([validatorPublicKey, rawDelegation]) =>
    parseDelegation(validatorPublicKey, rawDelegation),
  )
  return delegations
}

export function parseDebonding(
  debondingResponse: Awaited<ReturnType<oasis.client.NodeInternal['stakingDebondingDelegationInfosFor']>>,
): DebondingDelegation[] {
  const debonding = [...debondingResponse.entries()].flatMap(
    ([validatorPublicKey, rawDebondingDelegations]) => {
      return rawDebondingDelegations.map(rawDebonding => {
        return {
          ...parseDelegation(validatorPublicKey, rawDebonding),
          epoch: Number(rawDebonding.debond_end),
        }
      })
    },
  )
  return debonding
}
