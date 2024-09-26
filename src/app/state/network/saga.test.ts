import { expectSaga, testSaga } from 'redux-saga-test-plan'
import * as matchers from 'redux-saga-test-plan/matchers'
import { getChainContext, getEpoch, getOasisNic, networkSaga, selectNetwork } from './saga'
import { networkActions } from '.'

describe('Network Sagas', () => {
  const env = process.env

  afterEach(() => {
    process.env = { ...env }
  })

  // TODO: don't test implementation
  // https://github.com/oasisprotocol/wallet/pull/868#discussion_r903743398
  test.skip('networkSaga', () => {
    delete process.env.REACT_APP_LOCALNET

    testSaga(networkSaga)
      .next()
      .takeLatest(networkActions.selectNetwork, selectNetwork)
      .next()
      .put(networkActions.selectNetwork('mainnet'))
      .next()
      .isDone()
  })

  describe('getChainContext', () => {
    const mockChainContext = '0b91b8e4e44b2003a7c5e23ddadb5e14ef5345c0ebcb3ddcae07fa2f244cab76'
    const mockSelectedNetwork = 'testnet'
    const mockNic = {
      consensusGetChainContext: jest.fn().mockResolvedValue(mockChainContext),
    }

    it('should return existing chainContext if available', () => {
      return expectSaga(getChainContext)
        .withState({
          network: {
            chainContext: mockChainContext,
            selectedNetwork: mockSelectedNetwork,
          },
        })
        .returns(mockChainContext)
        .run()
    })

    it('should fetch and return chainContext when not present in state', () => {
      return expectSaga(getChainContext)
        .withState({
          network: {
            selectedNetwork: mockSelectedNetwork,
          },
        })
        .provide([
          [matchers.call.fn(getOasisNic), mockNic],
          [matchers.call.fn(mockNic.consensusGetChainContext), mockChainContext],
        ])
        .put(networkActions.setChainContext(mockChainContext))
        .returns(mockChainContext)
        .run()
    })
  })

  describe('getEpoch', () => {
    const mockEpoch = 35337
    const mockSelectedNetwork = 'testnet'
    const mockNic = {
      beaconGetEpoch: jest.fn().mockResolvedValue(mockEpoch),
    }

    it('should return existing epoch if available', () => {
      return expectSaga(getEpoch)
        .withState({
          network: {
            epoch: mockEpoch,
            selectedNetwork: mockSelectedNetwork,
          },
        })
        .returns(mockEpoch)
        .run()
    })

    it('should fetch and return epoch when it is missing in state', () => {
      return expectSaga(getEpoch)
        .withState({
          network: {
            selectedNetwork: mockSelectedNetwork,
          },
        })
        .provide([
          [matchers.call.fn(getOasisNic), mockNic],
          [matchers.call.fn(mockNic.beaconGetEpoch), mockEpoch],
        ])
        .put(networkActions.setEpoch(mockEpoch))
        .returns(mockEpoch)
        .run()
    })
  })
})
