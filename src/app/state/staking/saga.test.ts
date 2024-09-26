import * as oasis from '@oasisprotocol/client'
import { expectSaga, testSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { EffectProviders, StaticProvider } from 'redux-saga-test-plan/providers'
import { DeepPartialRootState } from 'types/RootState'
import { WalletError, WalletErrors } from 'types/errors'

import { initialState, stakingActions, stakingReducer } from '.'
import { getExplorerAPIs, getOasisNic } from '../network/saga'
import { selectEpoch } from '../network/selectors'
import {
  fetchAccount,
  getMainnetDumpValidators,
  getValidatorDetails,
  refreshValidators,
  now,
  stakingSaga,
} from './saga'
import { DebondingDelegation, Delegation, StakingState, Validator } from './types'
import { parseValidatorsList } from 'vendors/oasisscan'
import { ValidatorRow } from 'vendors/oasisscan/models'

const qty = (number: number) => oasis.quantity.fromBigInt(BigInt(number))

describe('Staking Sagas', () => {
  const getAllValidators = jest.fn()
  const getDelegations = jest.fn()
  const nic = {
    stakingAccount: jest.fn(),
    stakingDebondingDelegationInfosFor: jest.fn(),
    stakingDelegationInfosFor: jest.fn(),
    schedulerGetValidators: jest.fn(),
  }

  const providers: (EffectProviders | StaticProvider)[] = [
    [matchers.call.fn(getExplorerAPIs), { getAllValidators, getDelegations }],
    [matchers.call.fn(getOasisNic), nic],
    [matchers.call.fn(now), new Date('2022').getTime()],
  ]
  const validAddress = 'oasis1qqty93azxp4qeft3krvv23ljyj57g3tzk56tqhqe'

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('Fetch Account', () => {
    it('Should load the delegations and validators', () => {
      getAllValidators.mockResolvedValue([
        { address: 'oasis1qqzz2le7nua2hvrkjrc9kc6n08ycs9a80chejmr7', escrow: 1000n.toString() },
        { address: 'dummy', escrow: 2000n.toString() },
      ] as Validator[])

      getDelegations.mockResolvedValue({
        delegations: [{ validatorAddress: 'dummy', amount: 100n.toString(), shares: 100n.toString() }],
        debonding: [
          { validatorAddress: 'dummy', amount: 100n.toString(), shares: 100n.toString(), epoch: 1234 },
        ],
      } as {
        delegations: Delegation[]
        debonding: DebondingDelegation[]
      })

      return (
        expectSaga(fetchAccount, stakingActions.fetchAccount(validAddress))
          .withState({})
          .provide(providers)
          .put.actionType(stakingActions.updateValidators.type)
          //@TODO check that we're loading everything in state
          .run()
      )
    })
  })

  describe('Validator details', () => {
    it('Should load the details regarding the selected validator', () => {
      nic.stakingAccount.mockResolvedValue({})

      return expectSaga(stakingSaga)
        .withState({
          network: {
            epoch: 35337,
          },
        })
        .provide(providers)
        .dispatch(stakingActions.validatorSelected('oasis1qqzz2le7nua2hvrkjrc9kc6n08ycs9a80chejmr7'))
        .put.actionType(stakingActions.updateValidatorDetails.type)
        .silentRun()
    })

    it('Should keep and augment relevant bounds', async () => {
      nic.stakingAccount.mockResolvedValue({
        escrow: {
          commission_schedule: {
            bounds: [
              {
                rate_min: qty(1000),
                rate_max: qty(2000),
                start: 500,
              },
              {
                rate_min: qty(1000),
                rate_max: qty(2000),
                start: 200,
              },
              {
                rate_min: qty(1000),
                rate_max: qty(2000),
                start: 0,
              },
            ],
          },
        },
      })

      const result = await expectSaga(stakingSaga)
        .withState(initialState)
        .withReducer(stakingReducer)
        .provide([...providers, [matchers.select.selector(selectEpoch), 300]])
        .dispatch(stakingActions.validatorSelected('oasis1qqzz2le7nua2hvrkjrc9kc6n08ycs9a80chejmr7'))
        .put.actionType(stakingActions.updateValidatorDetails.type)
        .silentRun()

      const finalState: StakingState = result.storeState
      const bounds = finalState.selectedValidatorDetails!.scheduledCommissionBounds

      // The "older" 0-200 bounds should have been filtered out
      expect(bounds).toHaveLength(2)
      expect(bounds).toEqual([
        { epochEnd: 499, epochStart: 200, lower: 0.01, upper: 0.02 },
        { epochEnd: undefined, epochStart: 500, lower: 0.01, upper: 0.02 },
      ])
    })
  })

  describe('Fetch validators fallbacks', () => {
    it('should load validators when switching network', () => {
      getAllValidators.mockResolvedValue([{ address: 'fromApi' }] as Validator[])
      return expectSaga(refreshValidators)
        .withState<DeepPartialRootState>({
          network: { selectedNetwork: 'testnet' },
          staking: { validators: { network: 'mainnet', list: [{ address: 'existing' }] } },
        })
        .provide(providers)
        .put(
          stakingActions.updateValidators({
            timestamp: new Date('2022').getTime(),
            network: 'testnet',
            list: [{ address: 'fromApi' }] as Validator[],
          }),
        )
        .run()
    })

    it('should use fallback on mainnet', () => {
      getAllValidators.mockRejectedValue(new WalletError(WalletErrors.IndexerAPIError, 'Request failed'))
      const getMainnetDumpValidatorsMock = {
        dump_timestamp: 1647996761337,
        dump_timestamp_iso: '2022-03-23T00:52:41.337Z',
        list: [
          {
            rank: 1,
            entityAddress: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
            name: 'stakefish',
            nodeAddress: 'oasis1qrg52ccz4ts6cct2qu4retxn7kkdlusjh5pe74ar',
            escrow: '0.2',
            status: true,
            _expectedStatus: true,
          },
          {
            rank: 2,
            entityAddress: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
            name: 'BinanceStaking',
            nodeAddress: 'oasis1qqp0h2h92eev7nsxgqctvuegt8ge3vyg0qyluc4k',
            escrow: '0.1',
            status: true,
            _expectedStatus: false,
          },
        ],
      }
      nic.schedulerGetValidators.mockResolvedValue([
        {
          // oasis1qrg52ccz4ts6cct2qu4retxn7kkdlusjh5pe74ar
          id: oasis.misc.fromHex('91e7768ae47cd1641d6f883b97e3ea6d0286240bc3e3e2953c5c2e0dce6753a3'),
          voting_power: 1,
        },
      ] as oasis.types.SchedulerValidator[])
      jest
        .spyOn(console, 'error')
        .mockImplementationOnce(message => expect(message).toBe('get validators list failed'))

      return expectSaga(refreshValidators)
        .withState<DeepPartialRootState>({
          network: { selectedNetwork: 'mainnet' },
        })
        .provide([...providers, [matchers.call.fn(getMainnetDumpValidators), getMainnetDumpValidatorsMock]])
        .put(
          stakingActions.updateValidatorsError({
            error: {
              code: WalletErrors.IndexerAPIError,
              message: 'Request failed',
            },
            validators: {
              timestamp: getMainnetDumpValidatorsMock.dump_timestamp,
              network: 'mainnet',
              list: parseValidatorsList(
                getMainnetDumpValidatorsMock.list.map(({ _expectedStatus, ...v }) => ({
                  ...v,
                  status: _expectedStatus,
                })) as ValidatorRow[],
              ),
            },
          }),
        )
        .run()
    })
  })

  test('stakingSaga', () => {
    testSaga(stakingSaga)
      .next()
      .takeLatest(stakingActions.fetchAccount, fetchAccount)
      .next()
      .takeLatest(stakingActions.validatorSelected, getValidatorDetails)
      .next()
      .isDone()
  })
})
