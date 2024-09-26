import { consensus, quantity } from '@oasisprotocol/client'
import { SchedulerValidator } from '@oasisprotocol/client/dist/types'
import { PayloadAction } from '@reduxjs/toolkit'
import { addressToPublicKey, publicKeyToAddress } from 'app/lib/helpers'
import { NetworkType } from 'app/state/network/types'
import { call, put, select, takeLatest } from 'typed-redux-saga'
import { WalletError, WalletErrors } from 'types/errors'
import { parseValidatorsList } from 'vendors/oasisscan'

import { stakingActions } from '.'
import { getEpoch, getExplorerAPIs, getOasisNic } from '../network/saga'
import { selectSelectedNetwork } from '../network/selectors'
import { selectValidators, selectValidatorsNetwork } from './selectors'
import { CommissionBound, DebondingDelegation, Delegation, Validators } from './types'

function* loadDelegations(address: string) {
  const nic = yield* call(getOasisNic)
  const { getDelegations } = yield* call(getExplorerAPIs)
  const validators = yield* select(selectValidators)

  try {
    const delegationsResponse = yield* call(getDelegations, { accountId: address, nic: nic })
    const delegations: Delegation[] = delegationsResponse.delegations.map(delegation => ({
      ...delegation,
      validator: validators.find(v => v.address === delegation.validatorAddress),
    }))
    const debondingDelegations: DebondingDelegation[] = delegationsResponse.debonding.map(delegation => ({
      ...delegation,
      validator: validators.find(v => v.address === delegation.validatorAddress),
    }))

    yield* put(stakingActions.updateDelegations({ delegations, debondingDelegations }))
  } catch (e: any) {
    console.error('get delegations failed, continuing without updated list.', e)
    if (e instanceof WalletError) {
      yield* put(stakingActions.updateDelegationsError({ code: e.type, message: e.message }))
    } else {
      yield* put(
        stakingActions.updateDelegationsError({ code: WalletErrors.UnknownError, message: e.message }),
      )
    }
  }
}

export function* refreshValidators() {
  const existingValidators = yield* select(selectValidators)
  const existingValidatorsNetwork = yield* select(selectValidatorsNetwork)
  const network = yield* select(selectSelectedNetwork)

  // Skip if validators are already in store, and network didn't change
  if (existingValidators.length > 0 && network === existingValidatorsNetwork) return

  const { getAllValidators } = yield* call(getExplorerAPIs)
  try {
    const validators = yield* call(getAllValidators)
    yield* put(
      stakingActions.updateValidators({
        timestamp: yield* call(now),
        network: network,
        list: validators,
      }),
    )
  } catch (errorApi: any) {
    console.error('get validators list failed', errorApi)

    const fallback = yield* call(getFallbackValidators, network, errorApi)
    yield* put(
      stakingActions.updateValidatorsError({
        error: {
          code: fallback.error instanceof WalletError ? fallback.error.type : WalletErrors.UnknownError,
          message: fallback.error.message,
        },
        validators: fallback.validators,
      }),
    )
  }
}

function* getFallbackValidators(network: NetworkType, errorApi: Error) {
  let fallbackValidators: Validators = {
    timestamp: yield* call(now),
    network: network,
    list: [],
  }
  // If API fails on testnet/local, fall back to empty list
  if (network !== 'mainnet') {
    return {
      error: errorApi,
      validators: fallbackValidators,
    }
  }

  try {
    const dump_validators = yield* call(getMainnetDumpValidators)
    fallbackValidators = {
      timestamp: dump_validators.dump_timestamp,
      network: 'mainnet',
      list: parseValidatorsList(dump_validators.list).map(v => {
        return {
          ...v,
          status: 'unknown',
        }
      }),
    }
  } catch (errorDumpValidators) {
    // If fetching dump_validators fails, fall back to empty list
    return {
      error: new WalletError(WalletErrors.DisconnectedError, 'Lost connection'),
      validators: fallbackValidators,
    }
  }

  // If API fails on mainnet, fall back to dump_validators, and refresh validators' status with RPC
  const nic = yield* call(getOasisNic)
  let rpcActiveValidators: SchedulerValidator[]
  try {
    rpcActiveValidators = yield* call([nic, nic.schedulerGetValidators], consensus.HEIGHT_LATEST)
  } catch (errorRpc) {
    // If RPC fails, fall back to dump_validators with unknown validators' status
    return {
      error: errorApi,
      validators: fallbackValidators,
    }
  }

  // Fall back to dump_validators with refreshed validators' status from RPC
  const activeNodes: { [nodeAddress: string]: true } = {}
  for (const rpcValidator of rpcActiveValidators) {
    const nodeAddress = yield* call(publicKeyToAddress, rpcValidator.id)
    activeNodes[nodeAddress] = true
  }
  fallbackValidators = {
    ...fallbackValidators,
    list: fallbackValidators.list.map(v => {
      return {
        ...v,
        status: activeNodes[v.nodeAddress] ? ('active' as const) : ('inactive' as const),
      }
    }),
  }
  return {
    error: errorApi,
    validators: fallbackValidators,
  }
}

export function now() {
  return Date.now()
}

export async function getMainnetDumpValidators() {
  return await import('vendors/oasisscan/dump_validators.json')
}

export function* getValidatorDetails({ payload: address }: PayloadAction<string>) {
  const nic = yield* call(getOasisNic)
  const publicKey = yield* call(addressToPublicKey, address)
  const account = yield* call([nic, nic.stakingAccount], { owner: publicKey, height: 0 })
  const currentEpoch = yield* call(getEpoch)

  let rawBounds = account.escrow?.commission_schedule?.bounds
  if (!rawBounds) {
    rawBounds = []
  }

  const bounds: CommissionBound[] = rawBounds
    .map(b => ({
      epochStart: b.start ? Number(b.start) : 0,
      lower: b.rate_min ? Number(quantity.toBigInt(b.rate_min)) / 100_000 : 0,
      upper: b.rate_max ? Number(quantity.toBigInt(b.rate_max)) / 100_000 : 0,
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

  yield* put(
    stakingActions.updateValidatorDetails({
      scheduledCommissionBounds: bounds,
    }),
  )
}

export function* fetchAccount({ payload: address }: PayloadAction<string>) {
  yield* put(stakingActions.setLoading(true))
  yield* call(refreshValidators)

  yield* call(loadDelegations, address)

  yield* put(stakingActions.setLoading(false))
}

export function* stakingSaga() {
  yield* takeLatest(stakingActions.fetchAccount, fetchAccount)
  yield* takeLatest(stakingActions.validatorSelected, getValidatorDetails)
}
