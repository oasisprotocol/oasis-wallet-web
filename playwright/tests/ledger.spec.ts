import { test, expect } from '@playwright/test'
import { expectNoErrorsInConsole } from '../utils/expectNoErrorsInConsole'

test.describe('Ledger', () => {
  test('Permissions-Policy should allow USB', async ({ page }) => {
    expect((await page.request.head('/')).headers()).toHaveProperty('permissions-policy')
    await expectNoErrorsInConsole(page)

    await page.goto('/open-wallet/ledger/usb')
    await page.getByRole('button', { name: 'Select accounts to open' }).click()
    await expect(page.getByText('error').or(page.getByText('fail'))).toBeHidden()
  })
})
