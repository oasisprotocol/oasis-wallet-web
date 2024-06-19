import { BrowserContext, Page } from '@playwright/test'
import type { AccountsRow } from '../../src/vendors/oasisscan/index'

export async function mockApi(context: BrowserContext | Page, balance: number) {
  await context.route('**/chain/account/info/*', route => {
    route.fulfill({
      body: JSON.stringify({
        code: 0,
        data: {
          rank: 0,
          address: route.request().url().split('/chain/account/info/')[1],
          available: balance.toString(),
          escrow: '0',
          debonding: '0',
          total: balance.toString(),
          nonce: 1,
          allowances: [],
        } satisfies AccountsRow,
      }),
    })
  })
  await context.route('**/chain/account/delegations?*', route => {
    route.fulfill({
      body: JSON.stringify({ code: 0, data: { list: [], page: 1, size: 500, maxPage: 0, totalSize: 0 } }),
    })
  })
  await context.route('**/chain/account/debonding?*', route => {
    route.fulfill({
      body: JSON.stringify({ code: 0, data: { list: [], page: 1, size: 500, maxPage: 0, totalSize: 0 } }),
    })
  })
  await context.route('**/chain/transactions?*', route => {
    route.fulfill({
      body: JSON.stringify({
        code: 0,
        data: {
          list: [],
          page: 1,
          size: 20,
          maxPage: 1,
          totalSize: 0,
        },
      }),
    })
  })
  await context.route('**/validator/list?*', route => {
    route.fulfill({
      body: JSON.stringify({
        code: 0,
        data: {
          list: [],
          active: 120,
          delegators: 49619,
          inactive: 82,
        },
      }),
    })
  })

  await context.route('**/oasis-core.Consensus/GetChainContext', route => {
    route.fulfill({
      contentType: 'application/grpc-web-text+proto',
      body: 'AAAAAEJ4QGIxMWIzNjllMGRhNWJiMjMwYjIyMDEyN2Y1ZTdiMjQyZDM4NWVmOGM2ZjU0OTA2MjQzZjMwYWY2M2M4MTU1MzU=gAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=',
    })
  })
  await context.route('**/oasis-core.Beacon/GetEpoch', route => {
    route.fulfill({
      contentType: 'application/grpc-web-text+proto',
      body: 'AAAAAAMZR8Q=gAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=',
    })
  })
  await context.route('**/oasis-core.Staking/Account', route => {
    route.fulfill({
      contentType: 'application/grpc-web-text+proto',
      body: 'AAAAAAGggAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=',
    })
  })
  await context.route('**/oasis-core.Consensus/GetSignerNonce', route => {
    route.fulfill({
      contentType: 'application/grpc-web-text+proto',
      body: 'AAAAAAIYKQ==gAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=',
    })
  })
  await context.route('**/oasis-core.Consensus/EstimateGas', route => {
    route.fulfill({
      contentType: 'application/grpc-web-text+proto',
      body: 'AAAAAAMZBPE=gAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=',
    })
  })
  await context.route('**/oasis-core.Consensus/SubmitTx', route => {
    route.fulfill({
      contentType: 'application/grpc-web-text+proto',
      body: 'AAAAAAA=gAAAAB5ncnBjLXN0YXR1czowDQpncnBjLW1lc3NhZ2U6DQo=',
    })
  })

  // Inside Transak iframe
  await context.route('https://sentry.io/**', route => route.fulfill({ body: '' }))
  await context.route('https://cdn.segment.com/**', route => route.fulfill({ body: '' }))
  await context.route('https://api.segment.io/**', route => route.fulfill({ body: '' }))
  await context.route('https://api.sardine.ai/**', route => route.fulfill({ body: '' }))
}
