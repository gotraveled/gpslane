import { test, expect } from '@playwright/test'

test.describe('Frontend', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('http://localhost:3000')
    await expect(page).toHaveTitle(/GPSLane/i)
  })
})
