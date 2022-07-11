import * as monitor from 'vendors/monitor'
import * as oasisscan from 'vendors/oasisscan'
import {
  OperationsRowMethodEnum,
} from 'vendors/oasisscan/index'


function ignoreTimeoutError() {
  // Note: This is strongly discouraged. If it stops working, we converted to
  // jest in https://github.com/oasisprotocol/oasis-wallet-web/pull/736
  cy.on('fail', error => {
    if (error.name === 'CypressError' && error.message.includes('timed out waiting')) {
      return false
    }
    throw error
  })
}

describe('check all transaction methods from API are mapped in transactionMethodMap', () => {
  it('by parsing latest transactions on oasismonitor', () => {
    ignoreTimeoutError() // Ignore if API is not responding

    cy.request({
      url: 'https://monitor.oasis.dev/data/transactions?limit=2000',
      retryOnNetworkFailure: false,
      failOnStatusCode: false,
      timeout: 5000,
    }).should(response => {
      if (!response.isOkStatusCode) return // Ignore if API is broken

      response.body.forEach(transactionFromApi => {
        const [parsedTransaction] = monitor.parseTransactionsList([transactionFromApi])
        expect(parsedTransaction.type).to.be.a('string', `parse transaction type "${transactionFromApi.type}" to a string`)
      })
    })
  })

  it('by comparing list of methods from oasisscan', () => {
    ignoreTimeoutError() // Ignore if API is not responding

    cy.request({
      url: 'https://api.oasisscan.com/mainnet/chain/methods', // does not include consensus methods
      retryOnNetworkFailure: false,
      failOnStatusCode: false,
      timeout: 5000,
    }).should(response => {
      if (!response.isOkStatusCode) return // Ignore if API is broken

      const allApiMethods = response.body.data.list

      expect(allApiMethods).to.have.length(Object.keys(OperationsRowMethodEnum).length)
      expect(oasisscan.transactionMethodMap).to.include.keys(allApiMethods)
    })
  })
})
