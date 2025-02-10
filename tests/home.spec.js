import { test, expect } from '@playwright/test'
import { navigateToHome, getGdsComponentText } from './test-helpers/index.js'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToHome(page)
  })

  test('should have GOV.UK header', async ({ page }) => {
    // Check for GOV.UK header
    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('link', { name: 'GOV.UK' })).toBeVisible()

    // Check service name
    const serviceName = await getGdsComponentText(
      page,
      '.govuk-header__service-name'
    )
    await expect(serviceName).toContain('Intelligent Code Reviewer')
  })

  test('should have the correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Intelligent Code Reviewer/)
  })
})
