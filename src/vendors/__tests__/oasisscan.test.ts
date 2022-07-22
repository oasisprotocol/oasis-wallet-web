import { OperationsRowMethodEnum, ParaTimeCtxRowMethodEnum } from 'vendors/oasisscan/index'
import {
  parseValidatorsList,
  parseAccount,
  parseTransactionsList,
  parseDelegations,
  parseDebonding,
} from '../oasisscan'

describe('oasisscan', () => {
  test('parse account', () => {
    expect(
      // https://api.oasisscan.com/mainnet/chain/account/info/oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe
      parseAccount({
        rank: 0,
        address: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
        available: '756.455428396',
        escrow: '1460535.533308247',
        debonding: '0',
        total: '1461291.988735606',
        nonce: 2,
        allowances: [],
      }),
    ).toMatchSnapshot()
  })

  test('parse validators', () => {
    expect(
      // https://api.oasisscan.com/mainnet/validator/list?pageSize=3
      parseValidatorsList([
        {
          rank: 1,
          entityId: 'eZuacXy5s3/nolB/E3gF4vqUYdvfOlVaaBXGfZcGwKc=',
          entityAddress: 'oasis1qq3xrq0urs8qcffhvmhfhz4p0mu7ewc8rscnlwxe',
          nodeId: 'ked2iuR80WQdb4g7l+PqbQKGJAvD4+KVPFwuDc5nU6M=',
          nodeAddress: 'oasis1qrg52ccz4ts6cct2qu4retxn7kkdlusjh5pe74ar',
          name: 's',
          icon: 'https://s3.amazonaws.com/s.jpg',
          website: 'https://s.f',
          twitter: 'https://twitter.com/s',
          keybase: 'b',
          email: 's@s.f',
          description: null,
          escrow: '336904789.68',
          escrowChange24: '834847.28',
          escrowPercent: 0.0594,
          balance: '756.46',
          totalShares: '274945347.23',
          signs: 6662666,
          proposals: 195817,
          nonce: 0,
          score: 7054300,
          delegators: 8244,
          nodes: null,
          uptime: '100%',
          active: true,
          commission: 0.05,
          bound: null,
          rates: null,
          bounds: null,
          escrowSharesStatus: null,
          escrowAmountStatus: null,
          status: true,
        },
        {
          rank: 2,
          entityId: '9sAhd+Wi6tG5nAr3LwXD0y9mUKLYqfAbS2+7SZdNHB4=',
          entityAddress: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
          nodeId: '6wbL5/OxvFGxi55o7AxcwKmfjXbXGC1hw4lfnEZxBXA=',
          nodeAddress: 'oasis1qqp0h2h92eev7nsxgqctvuegt8ge3vyg0qyluc4k',
          name: 'b',
          icon: null,
          website: 'https://www.b.com',
          twitter: null,
          keybase: null,
          email: null,
          description: null,
          escrow: '326477290.61',
          escrowChange24: '396083.29',
          escrowPercent: 0.0575,
          balance: '37793.61',
          totalShares: '292703052.04',
          signs: 4524240,
          proposals: 263109,
          nonce: 0,
          score: 5050458,
          delegators: 10510,
          nodes: null,
          uptime: '100%',
          active: false,
          commission: 0.1,
          bound: null,
          rates: null,
          bounds: null,
          escrowSharesStatus: null,
          escrowAmountStatus: null,
          status: false,
        },
        {
          rank: 3,
          entityId: 'kfr2A6K6TlvhQm4nz88Hczzkd2Aq5PlkxSpnmUUBAFs=',
          entityAddress: 'oasis1qr0jwz65c29l044a204e3cllvumdg8cmsgt2k3ql',
          nodeId: 'lbxs4hlud9XNloIOdhJPaCahd7HtiY8QATCgGnFfCM0=',
          nodeAddress: 'oasis1qp0lt6y2kq8g7ffzy49acga2l8uefngz0yf9v0jk',
          name: 'Staking Fund',
          icon: 'https://s3.amazonaws.com/keybase_processed_uploads/d48739023a250815c4ac564c9870ec05_360_360.jpg',
          website: 'https://staking.fund',
          twitter: 'StakingFund',
          keybase: 'StakingFund',
          email: 'go@staking.fund',
          description: null,
          escrow: '261889743.04',
          escrowChange24: '84921.18',
          escrowPercent: 0.046,
          balance: '259.66',
          totalShares: '216965001.92',
          signs: 6988187,
          proposals: 366109,
          nonce: 0,
          score: 7720405,
          delegators: 1142,
          nodes: null,
          uptime: '100%',
          active: true,
          commission: 0.15,
          bound: null,
          rates: null,
          bounds: null,
          escrowSharesStatus: null,
          escrowAmountStatus: null,
          status: true,
        },
      ]),
    ).toMatchSnapshot()
  })

  test('parse transaction list', () => {
    expect(
      parseTransactionsList([
        // Emerald ParaTime Object
        // https://api.oasisscan.com/mainnet/runtime/transaction/info?id=000000000000000000000000000000000000000000000000e2eaa99fc008f87f&hash=25b84ca4582f6e3140c384ad60b98415d2c3079d1fc5f2221e45da7b13c70817
        {
          ctx: {
            amount: '200',
            method: 'consensus.Deposit' as ParaTimeCtxRowMethodEnum,
            from: 'oasis1qqnk4au603zs94k0d0n7c0hkx8t4p6r87s60axru',
            to: 'oasis1qzgc7dvlls36q47z5y6dvu6ylaa78rkrduqtxgdr',
            nonce: 4,
          },
          runtimeName: 'Emerald',
          runtimeId: '000000000000000000000000000000000000000000000000e2eaa99fc008f87f',
          round: 997775,
          timestamp: 1649604086,
          txHash: '25b84ca4582f6e3140c384ad60b98415d2c3079d1fc5f2221e45da7b13c70817',
          result: true,
          message: 'null',
          type: 'regular',
          etx: null,
          events: {
            type: 'deposit',
            tx_hash: '0000000000000000000000000000000000000000000000000000000000000000',
            round: 997776,
            position: 0,
            i: 0,
            from: 'oasis1qqnk4au603zs94k0d0n7c0hkx8t4p6r87s60axru',
            to: 'oasis1qzgc7dvlls36q47z5y6dvu6ylaa78rkrduqtxgdr',
            owner: null,
            nonce: 4,
            amount: [],
            error: null,
          },
        },

        // https://api.oasisscan.com/mainnet/chain/transactions?size=200&runtime=false&method=staking.Transfer&address=oasis1qz086axf5hreqpehv5hlgmtw7sfem79gz55v68wp
        {
          txHash: 'b831c4b2aa3188058717250cba279795d907e581bb4d7d40d9dc358d37a56254',
          height: 7381105,
          method: 'staking.Transfer' as OperationsRowMethodEnum,
          fee: '0.000002',
          amount: '116.90',
          shares: null,
          add: true,
          timestamp: 1645644903,
          time: 96605,
          status: true,
          from: 'oasis1qz086axf5hreqpehv5hlgmtw7sfem79gz55v68wp',
          to: 'oasis1qpm97z4c28juhdea220jtq2e3mz4gruyg54xktlm',
        },

        // https://api.oasisscan.com/mainnet/chain/transactions?size=200&runtime=false&method=staking.AddEscrow&address=oasis1qz0rx0h3v8fyukfrr0npldrrzvpdg4wj2qxvg0kj
        {
          txHash: 'e67c4331aa79c85736c4d96cd7b1f3eaad80301bb8d5c181c67482e57ebf0565',
          height: 7381138,
          method: 'staking.AddEscrow' as OperationsRowMethodEnum,
          fee: '0',
          amount: '500.10',
          shares: '0.00',
          add: true,
          timestamp: 1645645107,
          time: 96659,
          status: true,
          from: 'oasis1qz0rx0h3v8fyukfrr0npldrrzvpdg4wj2qxvg0kj',
          to: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
        },

        // https://api.oasisscan.com/mainnet/chain/transactions?size=200&runtime=false&method=staking.ReclaimEscrow&address=oasis1qzah5wn48ekakmq5405qvcg4czp8hjvrcvcywvhp
        {
          txHash: '0558d39e2c5ebe187fc2802ab442faa548013b247b5de1fb1ef75862dad4fb23',
          height: 7380979,
          method: 'staking.ReclaimEscrow' as OperationsRowMethodEnum,
          fee: '0',
          amount: '363.94',
          shares: '326.24',
          add: false,
          timestamp: 1645644147,
          time: 97859,
          status: true,
          from: 'oasis1qzah5wn48ekakmq5405qvcg4czp8hjvrcvcywvhp',
          to: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
        },

        // https://api.oasisscan.com/mainnet/chain/transactions?size=200&runtime=false&method=staking.AmendCommissionSchedule&address=oasis1qzl58e7v7pk50h66s2tv3u9rzf87twp7pcv7hul6
        {
          txHash: 'ba8e25c66ae31fa0a0837a414359bc2318c6c849515ca3dc1ffa9eb0a1ab92b3',
          height: 7361579,
          method: 'staking.AmendCommissionSchedule' as OperationsRowMethodEnum,
          fee: '0.000002',
          amount: null,
          shares: null,
          add: true,
          timestamp: 1645526644,
          time: 215523,
          status: true,
          from: 'oasis1qzl58e7v7pk50h66s2tv3u9rzf87twp7pcv7hul6',
          to: null,
        },

        // https://api.oasisscan.com/mainnet/chain/transactions?size=200&runtime=false&method=staking.Allow&address=oasis1qq3833fnmkqe94h0ca6w8qa84sq8pu92qsjmfayj
        {
          txHash: '8894b8e9866f66efe291155646f1c09d69d7221449a8d9f758ad1d31f504df03',
          height: 7381163,
          method: 'staking.Allow' as OperationsRowMethodEnum,
          fee: '0',
          amount: '1714.90',
          shares: null,
          add: true,
          timestamp: 1645645260,
          time: 96865,
          status: true,
          from: 'oasis1qq3833fnmkqe94h0ca6w8qa84sq8pu92qsjmfayj',
          to: 'oasis1qzvlg0grjxwgjj58tx2xvmv26era6t2csqn22pte',
        },

        // https://api.oasisscan.com/mainnet/chain/transactions?size=200&runtime=false&method=roothash.ExecutorCommit&address=oasis1qzr9p9fpjqekr8dev66wuaedcpq5n09hwvpkd4pg
        {
          txHash: 'd6298496fc19fd95fa1e2b245d1c33661b9ebd7ffb184280c363a31d13210c2a',
          height: 7381204,
          method: 'roothash.ExecutorCommit' as OperationsRowMethodEnum,
          fee: '0',
          amount: null,
          shares: null,
          add: true,
          timestamp: 1645645506,
          time: 96862,
          status: true,
          from: 'oasis1qzr9p9fpjqekr8dev66wuaedcpq5n09hwvpkd4pg',
          to: null,
        },

        // https://api.oasisscan.com/mainnet/chain/transactions?size=200&runtime=false&method=roothash.ExecutorProposerTimeout&address=oasis1qz6k3gky5d43h70xh2c5vk5fztmzmxmmhc6rh72x
        {
          txHash: '46583095fd80becc2683aacc67684170de8d6bc6eca5103d7ac543106d729a8f',
          height: 7381052,
          method: 'roothash.ExecutorProposerTimeout' as OperationsRowMethodEnum,
          fee: '0',
          amount: null,
          shares: null,
          add: true,
          timestamp: 1645644585,
          time: 97844,
          status: false,
          from: 'oasis1qz6k3gky5d43h70xh2c5vk5fztmzmxmmhc6rh72x',
          to: null,
        },

        // https://api.oasisscan.com/mainnet/chain/transactions?size=200&runtime=false&method=registry.RegisterEntity&address=oasis1qpdlqz373hcqvafadd3lxptj42x84sws35s02r4r
        {
          txHash: '5378750685efed957417abea41e7d96804264cb51d85dcee45494ef0ca2f31c7',
          height: 7368263,
          method: 'registry.RegisterEntity' as OperationsRowMethodEnum,
          fee: '0.000001',
          amount: null,
          shares: null,
          add: true,
          timestamp: 1645567265,
          time: 175214,
          status: true,
          from: 'oasis1qpdlqz373hcqvafadd3lxptj42x84sws35s02r4r',
          to: null,
        },

        // https://api.oasisscan.com/mainnet/chain/transactions?size=200&runtime=false&method=registry.RegisterNode&address=oasis1qzwl8jlxzwjgz2m6d3ns0vt9hzfp2h63qsxs76ys
        {
          txHash: '86a303d9891bbefb0984b82dcc0a51ec190d383248b536dcb8bc9ca0404824f4',
          height: 7381231,
          method: 'registry.RegisterNode' as OperationsRowMethodEnum,
          fee: '0',
          amount: null,
          shares: null,
          add: true,
          timestamp: 1645645670,
          time: 96855,
          status: true,
          from: 'oasis1qzwl8jlxzwjgz2m6d3ns0vt9hzfp2h63qsxs76ys',
          to: null,
        },

        // https://api.oasisscan.com/mainnet/chain/transactions?size=200&runtime=false&method=registry.RegisterRuntime&address=oasis1qrvmxhcjpjvgel9dqfs6zrnza3hqjpa6ug2arc0d
        {
          txHash: '2ac0a88ab2c85cef69905c8c9b3f639c5b3b15b969c334df5dcc4fa54f183a8a',
          height: 6251849,
          method: 'registry.RegisterRuntime' as OperationsRowMethodEnum,
          fee: '0',
          amount: null,
          shares: null,
          add: true,
          timestamp: 1638867315,
          time: 6875238,
          status: true,
          from: 'oasis1qrvmxhcjpjvgel9dqfs6zrnza3hqjpa6ug2arc0d',
          to: null,
        },

        // https://api.oasisscan.com/mainnet/chain/transactions?size=200&runtime=false&method=governance.CastVote&address=oasis1qp3rhyfjagkj65cnn6lt8ej305gh3kamsvzspluq
        {
          txHash: 'a62ebc4d30bc045f129f33a14d4019ec88e48c150980ed388d5f64b6e9476059',
          height: 4726356,
          method: 'governance.CastVote' as OperationsRowMethodEnum,
          fee: '0.000004',
          amount: null,
          shares: null,
          add: true,
          timestamp: 1629793437,
          time: 15949163,
          status: true,
          from: 'oasis1qp3rhyfjagkj65cnn6lt8ej305gh3kamsvzspluq',
          to: null,
        },

        // https://api.oasisscan.com/mainnet/chain/transactions?size=200&runtime=false&method=beacon.PVSSCommit&address=oasis1qrd64zucfaugv677fwkhynte4dz450yffgp0k06t
        {
          txHash: '09bfc632625d44fe96d4d31bacd12ed889231f77ed898cbcccf0dea7527a6237',
          height: 7396874,
          method: 'beacon.PVSSCommit' as OperationsRowMethodEnum,
          fee: '0',
          amount: null,
          shares: null,
          add: true,
          timestamp: 1645740165,
          time: 2485,
          status: true,
          from: 'oasis1qrd64zucfaugv677fwkhynte4dz450yffgp0k06t',
          to: null,
        },

        // https://api.oasisscan.com/mainnet/chain/transactions?size=200&runtime=false&method=beacon.PVSSReveal&address=oasis1qptn9zmdn5ksvq85vxg2mg84e9m6jp2875dyfl73
        {
          txHash: '9c9fd0d2588a0108ec5f277f476483f17e2d8429e947c83f0096b0a7c351aa51',
          height: 7381114,
          method: 'beacon.PVSSReveal' as OperationsRowMethodEnum,
          fee: '0',
          amount: null,
          shares: null,
          add: true,
          timestamp: 1645644962,
          time: 97720,
          status: true,
          from: 'oasis1qptn9zmdn5ksvq85vxg2mg84e9m6jp2875dyfl73',
          to: null,
        },
      ]),
    ).toMatchSnapshot()
  })

  test('parse delegations', () => {
    expect({
      // https://api.oasisscan.com/mainnet/chain/account/delegations?address=oasis1..&size=500
      delegations: parseDelegations([
        {
          validatorAddress: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
          validatorName: 'BinanceStaking',
          icon: null,
          entityAddress: null,
          shares: '0.000080078',
          amount: '0.000089387',
          active: true,
        },
      ]),
      // https://api.oasisscan.com/mainnet/chain/account/debonding?address=oasis1..&size=500
      debonding: parseDebonding([
        {
          validatorAddress: 'oasis1qqekv2ymgzmd8j2s2u7g0hhc7e77e654kvwqtjwm',
          validatorName: 'BinanceStaking',
          icon: null,
          shares: '363.94',
          debondEnd: 12626,
          epochLeft: 283,
        },
      ]),
    }).toMatchSnapshot()
  })
})
