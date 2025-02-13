import { test, expect } from '@playwright/test'

test.describe('Standard Set Detail Page', () => {
  test('should navigate and display correct details', async ({ page }) => {
    // Navigate to the listing page
    await page.goto('/standards/standard-sets')

    // Click on the standard set link 'Test Standards'
    await page.getByRole('link', { name: 'Test Standards' }).click()
    await expect(page).toHaveURL(/\/standards\/standard-sets\/.*/)

    // Verify header displays the standard set name
    await expect(
      page.getByRole('heading', { name: 'Test Standards' })
    ).toBeVisible()

    // Verify the repository URL link
    const repoLink = page.getByRole('link', {
      name: 'https://github.com/ee-todd/test-standards-set/'
    })
    await expect(repoLink).toBeVisible()
    await expect(repoLink).toHaveAttribute(
      'href',
      'https://github.com/ee-todd/test-standards-set/'
    )
    await expect(repoLink).toHaveAttribute('target', '_blank')

    // Verify the standards table is visible
    const table = page.getByRole('table')
    await expect(table).toBeVisible()

    // Locate the row containing the standard 'Java Coding Standards'
    const standardRow = table.locator('tr:has-text("Java Coding Standards")')
    await expect(standardRow).toBeVisible()

    // Locate the details component within the row and expand it if not already open
    const details = standardRow.locator(
      'details:has-text("Java Coding Standards")'
    )
    if (!(await details.getAttribute('open'))) {
      // Click on the summary to expand the details component
      const summary = details.locator('.govuk-details__summary')
      await summary.click()
    }
    // Verify the details component is expanded using the open attribute and contains the title 'Java Coding Standards'
    await expect(details).toHaveAttribute('open', '')
    await expect(details).toContainText('Java Coding Standards')

    // Verify the classification tag 'Java' is visible and has the blue tag class
    const classificationTag = standardRow.locator('.govuk-tag:has-text("Java")')
    await expect(classificationTag).toBeVisible()
    await expect(classificationTag).toHaveClass(/govuk-tag--blue/)
  })

  test('should display error message when API fails', async ({ page }) => {
    // Intercept the API call for standard set details to simulate an error
    await page.route('**/api/v1/standard-sets/**', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
        headers: { 'Content-Type': 'application/json' }
      })
    })

    // Navigate directly to a detail page
    await page.goto('/standards/standard-sets/error-id')

    // Verify that the error summary is displayed with the appropriate message
    const errorSummary = page.locator('.govuk-error-summary')
    await expect(errorSummary).toBeVisible()
    await expect(errorSummary).toContainText(
      'Unable to fetch standard set details. Please try again later.'
    )
  })
})
