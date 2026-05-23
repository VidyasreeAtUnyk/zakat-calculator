import { test, expect } from '@playwright/test';
import { beginCalculation, gotoHome, screenshotIf } from './helpers';

const ASSETS = [
  'Cash & Savings',
  'Gold',
  'Silver',
  'Investments & Stocks',
  'Property',
  'Business Assets',
  'Money Owed To You',
];

test.describe('Asset selector', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    await beginCalculation(page);
  });

  test('renders asset grid and selection states', async ({ page }, testInfo) => {
    await expect(
      page.getByRole('heading', { name: /What assets do you own/i })
    ).toBeVisible();

    for (const asset of ASSETS) {
      await expect(page.getByRole('button', { name: new RegExp(asset, 'i') })).toBeVisible();
    }

    const continueBtn = page.getByRole('button', { name: /Continue →/i });
    await expect(continueBtn).toBeDisabled();

    await page.getByRole('button', { name: /Cash & Savings/i }).click();
    await expect(continueBtn).toBeEnabled();
    await expect(
      page.getByRole('button', { name: /Cash & Savings/i })
    ).toHaveAttribute('aria-pressed', 'true');

    await page.getByRole('button', { name: /Gold/i }).click();
    await expect(
      page.getByRole('button', { name: /Gold/i })
    ).toHaveAttribute('aria-pressed', 'true');

    await expect(page.getByRole('progressbar')).toBeVisible();

    await screenshotIf(
      page,
      testInfo.project.name,
      'Desktop Chrome',
      'e2e/screenshots/02-asset-selector.png'
    );

    await screenshotIf(
      page,
      testInfo.project.name,
      'Desktop Chrome',
      'e2e/screenshots/02-asset-selected.png'
    );
  });
});
