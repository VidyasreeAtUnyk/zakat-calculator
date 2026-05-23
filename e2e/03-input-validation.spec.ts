import { test, expect } from '@playwright/test';
import {
  beginCalculation,
  gotoHome,
  selectAsset,
  continueWizard,
  screenshotIf,
} from './helpers';

test.describe('Cash input validation', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    await beginCalculation(page);
    await selectAsset(page, 'Cash & Savings');
    await continueWizard(page);
  });

  test('sanitizes and validates numeric input', async ({ page }, testInfo) => {
    const input = page.getByLabel(/Total balance across all accounts/i);

    await input.fill('abc');
    await expect(input).toHaveValue('0');

    await input.fill('-100');
    await expect(input).toHaveValue('0');

    await input.fill('1000000000');
    await expect(page.getByText(/Maximum value is AED 999,999,999/i)).toBeVisible();

    await screenshotIf(
      page,
      testInfo.project.name,
      'Desktop Chrome',
      'e2e/screenshots/03-validation.png'
    );

    await input.fill('');
    await input.fill('1,000,000');
    await expect(input).toHaveValue('1000000');

    await input.fill('1e10');
    await expect(input).toHaveValue('110');

    await input.fill('100.999');
    await expect(input).toHaveValue('100.99');

    await input.fill('');
    await expect(input).toHaveValue('0');
  });
});
