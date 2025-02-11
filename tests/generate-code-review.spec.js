import { test, expect } from '@playwright/test'
import { navigateToHome, getGdsComponentText } from './test-helpers/index.js'

test.describe('Home Page - Generate Code Review', () => {
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

  test('should display navigation links', async ({ page }) => {
    const navigation = page.getByRole('navigation')
    await expect(
      navigation.getByRole('link', { name: 'Generate code review' })
    ).toBeVisible()
    await expect(
      navigation.getByRole('link', { name: 'View code reviews' })
    ).toBeVisible()
    await expect(
      navigation.getByRole('link', { name: 'Standards' })
    ).toBeVisible()
  })

  test('should display main content elements', async ({ page }) => {
    // Check headings
    await expect(
      page.getByRole('heading', { name: 'Generate Code Review', level: 1 })
    ).toBeVisible()

    // Check descriptive text
    await expect(
      page.getByText('Submit a git repository for code review')
    ).toBeVisible()

    // Check repository URL input
    const repoUrlInput = page.getByLabel('Repository URL')
    await expect(repoUrlInput).toBeVisible()
    await expect(repoUrlInput).toBeEmpty()

    // Check standards section
    await expect(page.getByRole('group', { name: 'Standards' })).toBeVisible()

    // Check checkboxes and their associated links
    await expect(
      page.getByLabel('DEFRA Software Development Standards')
    ).toBeVisible()
    await expect(
      page.getByRole('link', {
        name: 'DEFRA Software Development Standards (opens in new tab)'
      })
    ).toBeVisible()

    await expect(page.getByLabel('Test Standards')).toBeVisible()
    await expect(
      page.getByRole('link', { name: 'Test Standards (opens in new tab)' })
    ).toBeVisible()

    // Check generate button
    await expect(
      page.getByRole('button', { name: 'Generate code review' })
    ).toBeVisible()
  })

  test('should have working form submission', async ({ page }) => {
    const repoUrlInput = page.getByLabel('Repository URL')
    await repoUrlInput.fill('https://github.com/test/repo')

    // Select both standards
    await page.getByLabel('DEFRA Software Development Standards').check()
    await page.getByLabel('Test Standards').check()

    // Verify checkboxes are checked
    await expect(
      page.getByLabel('DEFRA Software Development Standards')
    ).toBeChecked()
    await expect(page.getByLabel('Test Standards')).toBeChecked()
  })
})
