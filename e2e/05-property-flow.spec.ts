import { test, expect } from '@playwright/test';
import {
  beginCalculation,
  gotoHome,
  selectAsset,
  continueWizard,
  screenshotIf,
} from './helpers';

test.describe('Property asset flow', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    await beginCalculation(page);
    await selectAsset(page, 'Property');
    await continueWizard(page);
  });

  test('handles property types and multiple properties', async ({ page }, testInfo) => {
    await expect(
      page.getByText(/What type of property is this/i)
    ).toBeVisible();

    await page.getByLabel(/My primary home/i).check();
    await expect(
      page.getByText(/Primary residence is excluded from Zakat/i)
    ).toBeVisible();

    await page.getByLabel(/Investment property/i).check();
    await expect(
      page.getByLabel(/Approximate market value/i)
    ).toBeVisible();
    await page.getByLabel(/Approximate market value/i).fill('500000');

    await page.getByRole('button', { name: /Add another property/i }).click();
    await expect(page.getByText('Property 2')).toBeVisible();

    const rentalLabels = page.getByLabel(/Rental property/i);
    await rentalLabels.nth(1).check();
    await page.getByLabel(/Annual rental income/i).fill('120000');

    await screenshotIf(
      page,
      testInfo.project.name,
      'Desktop Chrome',
      'e2e/screenshots/05-property.png'
    );
  });
});
