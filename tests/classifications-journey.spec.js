import { test, expect } from '@playwright/test'

test.describe('Classifications', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/standards')
  })

  test.describe('Classification Management Journey', () => {
    test('should create, view and delete a classification', async ({
      page
    }) => {
      // Navigate to classifications page
      await page.getByRole('link', { name: 'Classifications' }).click()
      await expect(
        page.getByRole('heading', { name: 'Manage Classifications' })
      ).toBeVisible()

      // Verify table headers
      await expect(
        page.getByRole('columnheader', { name: 'Name' })
      ).toBeVisible()
      await expect(
        page.getByRole('columnheader', { name: 'Creation date' })
      ).toBeVisible()
      await expect(
        page.getByRole('columnheader', { name: 'Actions' })
      ).toBeVisible()

      // Verify existing classifications
      const existingClassifications = ['Javascript', 'Java', 'Node.js', 'C#']
      for (const classification of existingClassifications) {
        await expect(
          page.getByRole('cell', { name: classification, exact: true })
        ).toBeVisible()
      }
      await expect(page.getByRole('cell', { name: '.Net' })).not.toBeVisible()

      // Add new classification .Net
      await page.getByLabel('Add new classification').fill('.Net')
      await page.getByRole('button', { name: 'Add classification' }).click()

      // Verify new classification in list
      await expect(
        page.getByRole('cell', { name: '.Net', exact: true })
      ).toBeVisible()

      // Delete the classification
      await page
        .getByRole('button', { name: 'Delete .Net classification' })
        .click()

      // Verify deletion
      await expect(page.getByRole('cell', { name: '.Net' })).not.toBeVisible()
    })
  })
})
