import * as oasis from '@oasisprotocol/client'
import { Account } from 'app/state/account/types'
import { DebondingDelegation, Delegation, Validator } from 'app/state/staking/types'
import { Transaction, TransactionStatus, TransactionType } from 'app/state/transaction/types'
import { parseRoseStringToBaseUnitString } from 'app/lib/helpers'
import {
  AccountsApi,
  AccountsRow,
  Configuration,
  DelegationRow,
  DebondingDelegationRow,
  OperationsListApi,
  RuntimeApi,
  ValidatorRow,
  OperationsRow,
  OperationsRowMethodEnum,
  ParaTimeCtxRowMethodEnum,
  RuntimeTransactionInfoRow,
  OperationsEntityApi,
  OperationsEntity,
} from 'vendors/oasisscan/index'

import { throwAPIErrors } from './helpers'

export function getOasisscanAPIs(url: string | 'https://api.oasisscan.com/mainnet') {
  const explorerConfig = new Configuration({
    basePath: url,
    ...throwAPIErrors,
  })

  const accounts = new AccountsApi(explorerConfig)
  const operations = new OperationsListApi(explorerConfig)
  const operationsEntity = new OperationsEntityApi(explorerConfig)
  const runtime = new RuntimeApi(explorerConfig)

  async function getAccount(address: string, { includeNonce = true } = {}): Promise<Account> {
    const account = await accounts.getAccount({ accountId: address })
    if (!account || account.code !== 0) throw new Error('Wrong response code') // TODO
    return parseAccount(account.data, { includeNonce })
  }

  async function getAllValidators(): Promise<Validator[]> {
    const validators = await accounts.getValidatorsList({ pageSize: 500 })
    if (!validators || validators.code !== 0) throw new Error('Wrong response code') // TODO
    return parseValidatorsList(validators.data.list)
  }

  async function getRuntimeTransactionInfo(tx: OperationsRow) {
    const { data } = await runtime.getRuntimeTransactionInfo({
      id: tx.runtimeId!,
      hash: tx.txHash,
    })
    return data
  }

  async function getTransaction({ hash }: { hash: string }) {
    const transaction = await operationsEntity.getTransaction({
      hash,
    })

    const [parsedTx] = parseTransactionsList([transaction.data])
    return parsedTx
  }

  async function getTransactionsList(params: { accountId: string; limit: number }) {
    const transactionsList = await operations.getTransactionsList({
      address: params.accountId,
      size: params.limit,
      runtime: true,
    })
    if (!transactionsList || transactionsList.code !== 0) throw new Error('Wrong response code') // TODO

    const list = await Promise.all(
      transactionsList.data.list.map(async tx => (tx.runtimeId ? getRuntimeTransactionInfo(tx) : tx)),
    )

    return parseTransactionsList(list)
  }

  async function getDelegations(params: { accountId: string; nic: oasis.client.NodeInternal }): Promise<{
    delegations: Delegation[]
    debonding: DebondingDelegation[]
  }> {
    const delegations = await accounts.getDelegations({ address: params.accountId, size: 500 })
    const debonding = await accounts.getDebondingDelegations({ address: params.accountId, size: 500 })
    if (!delegations || delegations.code !== 0) throw new Error('Wrong response code') // TODO
    if (!debonding || debonding.code !== 0) throw new Error('Wrong response code') // TODO

    return {
      delegations: parseDelegations(delegations.data.list),
      debonding: parseDebonding(debonding.data.list),
    }
  }

  return {
    accounts,
    operations,
    getAccount,
    getAllValidators,
    getTransaction,
    getTransactionsList,
    getDelegations,
  }
}

export function parseAccount(account: AccountsRow, { includeNonce = true } = {}): Account {
  return {
    address: account.address,
    allowances: account.allowances.map(allowance => ({
      ...allowance,
      amount: parseRoseStringToBaseUnitString(allowance.amount),
    })),
    available: parseRoseStringToBaseUnitString(account.available),
    delegations: parseRoseStringToBaseUnitString(account.escrow),
    debonding: parseRoseStringToBaseUnitString(account.debonding),
    total: parseRoseStringToBaseUnitString(account.total),
    ...(includeNonce ? { nonce: BigInt(account.nonce ?? 0).toString() } : {}),
  }
}

export function parseValidatorsList(validators: ValidatorRow[]): Validator[] {
  return validators.map(v => {
    const parsed: Validator = {
      address: v.entityAddress,
      name: v.name ?? undefined,
      nodeAddress: v.nodeAddress,
      escrow: parseRoseStringToBaseUnitString(v.escrow),
      current_rate: v.commission,
      status: v.status ? 'active' : 'inactive',
      media: {
        email_address: v.email ?? undefined,
        logotype: v.icon ?? undefined,
        twitter_acc: v.twitter ?? undefined,
        website_link: v.website ?? undefined,
      },
      rank: v.rank,
    }
    return parsed
  })
}

export const transactionMethodMap: {
  [k in OperationsRowMethodEnum | ParaTimeCtxRowMethodEnum]: TransactionType
} = {
  [OperationsRowMethodEnum.StakingTransfer]: TransactionType.StakingTransfer,
  [OperationsRowMethodEnum.StakingAddEscrow]: TransactionType.StakingAddEscrow,
  [OperationsRowMethodEnum.StakingReclaimEscrow]: TransactionType.StakingReclaimEscrow,
  [OperationsRowMethodEnum.StakingAmendCommissionSchedule]: TransactionType.StakingAmendCommissionSchedule,
  [OperationsRowMethodEnum.StakingAllow]: TransactionType.StakingAllow,
  [OperationsRowMethodEnum.StakingWithdraw]: TransactionType.StakingWithdraw,
  [OperationsRowMethodEnum.StakingBurn]: TransactionType.StakingBurn,
  [OperationsRowMethodEnum.RoothashExecutorCommit]: TransactionType.RoothashExecutorCommit,
  [OperationsRowMethodEnum.RoothashExecutorProposerTimeout]: TransactionType.RoothashExecutorProposerTimeout,
  [OperationsRowMethodEnum.RoothashSubmitMsg]: TransactionType.RoothashSubmitMsg,
  [OperationsRowMethodEnum.RegistryDeregisterEntity]: TransactionType.RegistryDeregisterEntity,
  [OperationsRowMethodEnum.RegistryRegisterEntity]: TransactionType.RegistryRegisterEntity,
  [OperationsRowMethodEnum.RegistryRegisterNode]: TransactionType.RegistryRegisterNode,
  [OperationsRowMethodEnum.RegistryRegisterRuntime]: TransactionType.RegistryRegisterRuntime,
  [OperationsRowMethodEnum.RegistryUnfreezeNode]: TransactionType.RegistryUnfreezeNode,
  [OperationsRowMethodEnum.GovernanceCastVote]: TransactionType.GovernanceCastVote,
  [OperationsRowMethodEnum.GovernanceSubmitProposal]: TransactionType.GovernanceSubmitProposal,
  [OperationsRowMethodEnum.BeaconPvssCommit]: TransactionType.BeaconPvssCommit,
  [OperationsRowMethodEnum.BeaconPvssReveal]: TransactionType.BeaconPvssReveal,
  [OperationsRowMethodEnum.BeaconVrfProve]: TransactionType.BeaconVrfProve,
  [OperationsRowMethodEnum.ConsensusMeta]: TransactionType.ConsensusMeta,
  [OperationsRowMethodEnum.VaultCreate]: TransactionType.VaultCreate,
  [ParaTimeCtxRowMethodEnum.ConsensusDeposit]: TransactionType.ConsensusDeposit,
  [ParaTimeCtxRowMethodEnum.ConsensusWithdraw]: TransactionType.ConsensusWithdraw,
  [ParaTimeCtxRowMethodEnum.ConsensusAccountsParameters]: TransactionType.ConsensusAccountsParameters,
  [ParaTimeCtxRowMethodEnum.ConsensusBalance]: TransactionType.ConsensusBalance,
  [ParaTimeCtxRowMethodEnum.ConsensusAccount]: TransactionType.ConsensusAccount,
}

export function parseTransactionsList(
  list: (OperationsRow | RuntimeTransactionInfoRow | OperationsEntity)[],
): Transaction[] {
  return list.map(t => {
    if ('ctx' in t) {
      const parsed: Transaction = {
        amount: t.ctx.amount == null ? undefined : parseRoseStringToBaseUnitString(t.ctx.amount),
        fee: undefined,
        from: t.ctx.from,
        hash: t.txHash,
        level: undefined,
        status: t.result ? TransactionStatus.Successful : TransactionStatus.Failed,
        timestamp: t.timestamp * 1000,
        to: t.ctx.to ?? undefined,
        type: transactionMethodMap[t.ctx.method] ?? t.ctx.method,
        runtimeName: t.runtimeName,
        runtimeId: t.runtimeId,
        round: t.round,
        nonce: undefined,
      }
      return parsed
    } else {
      const parsed: Transaction = {
        amount: t.amount == null ? undefined : parseRoseStringToBaseUnitString(t.amount),
        fee: t.fee ? parseRoseStringToBaseUnitString(t.fee) : undefined,
        from: t.from,
        hash: t.txHash,
        level: t.height,
        status: t.status ? TransactionStatus.Successful : TransactionStatus.Failed,
        timestamp: t.timestamp * 1000,
        to: t.to ?? undefined,
        type: transactionMethodMap[t.method] ?? t.method,
        runtimeName: undefined,
        runtimeId: undefined,
        round: undefined,
        nonce:
          (t as OperationsEntity).nonce >= 0 ? BigInt((t as OperationsEntity).nonce).toString() : undefined,
      }
      return parsed
    }
  })
}

export function parseDelegations(delegations: DelegationRow[]): Delegation[] {
  return delegations.map(delegation => {
    const parsed: Delegation = {
      amount: parseRoseStringToBaseUnitString(delegation.amount),
      shares: parseRoseStringToBaseUnitString(delegation.shares),
      validatorAddress: delegation.validatorAddress,
    }
    return parsed
  })
}
export function parseDebonding(debonding: DebondingDelegationRow[]): DebondingDelegation[] {
  return debonding.map(debonding => {
    const parsed: DebondingDelegation = {
      // TODO: use amount field, or share price when it is available. Until then,
      // using shares is inaccurate if debonding pool gets slashed.
      amount: parseRoseStringToBaseUnitString(debonding.shares),
      shares: parseRoseStringToBaseUnitString(debonding.shares),
      validatorAddress: debonding.validatorAddress,
      epoch: debonding.debondEnd,
    }
    return parsed
  })
}
