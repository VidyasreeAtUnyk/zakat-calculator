import { test, expect } from '@playwright/test';
import {
  beginCalculation,
  gotoHome,
  selectAsset,
  continueWizard,
  screenshotIf,
} from './helpers';

test.describe('Gold asset flow', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    await beginCalculation(page);
    await selectAsset(page, 'Gold');
    await continueWizard(page);
  });

  test('handles worn and stored gold paths', async ({ page }, testInfo) => {
    await expect(
      page.getByText(/How do you primarily use this gold/i)
    ).toBeVisible();

    await page.getByRole('button', { name: /I wear it regularly/i }).click();
    await expect(
      page.getByText(/Worn gold is generally exempt from Zakat/i)
    ).toBeVisible();

    await screenshotIf(
      page,
      testInfo.project.name,
      'Desktop Chrome',
      'e2e/screenshots/04-gold-worn.png'
    );

    await page
      .getByRole('button', { name: /stored or held as investment/i })
      .click();
    await expect(page.getByLabel(/Weight in grams/i)).toBeVisible();
    await expect(page.getByText(/gold price/i)).toBeVisible();

    await page.getByLabel(/Weight in grams/i).fill('50');
    await expect(page.getByText(/Estimated value:/i)).toBeVisible();

    await page.getByLabel(/Weight in grams/i).fill('100001');
    await expect(page.getByText(/Maximum value is 100,000g/i)).toBeVisible();

    await screenshotIf(
      page,
      testInfo.project.name,
      'Desktop Chrome',
      'e2e/screenshots/04-gold-stored.png'
    );
  });
});
