import { test, expect } from '@playwright/test';
import {
  beginCalculation,
  gotoHome,
  selectAsset,
  continueWizard,
  fillCashAmount,
  screenshotIf,
  toggleNoDebts,
} from './helpers';

test.describe('Liabilities step', () => {
  test.beforeEach(async ({ page }) => {
    await gotoHome(page);
    await beginCalculation(page);
    await selectAsset(page, 'Cash & Savings');
    await continueWizard(page);
    await fillCashAmount(page, '100000');
    await page.getByRole('button', { name: /Continue to debts/i }).click();
  });

  test('debt inputs and no-debts toggle', async ({ page }, testInfo) => {
    await expect(
      page.getByRole('heading', { name: /Do you have any debts/i })
    ).toBeVisible();
    await expect(
      page.getByLabel(/Outstanding loans due this year/i)
    ).toBeVisible();
    await expect(
      page.getByLabel(/Rent or mortgage payments due/i)
    ).toBeVisible();
    await expect(page.getByLabel(/Other immediate debts/i)).toBeVisible();

    await toggleNoDebts(page);
    await expect(
      page.getByLabel(/Outstanding loans due this year/i)
    ).not.toBeVisible();

    await toggleNoDebts(page);
    await page.getByLabel(/Outstanding loans due this year/i).fill('10000');
    await page.getByRole('button', { name: /See my Zakat result/i }).click();
    await expect(
      page.getByRole('heading', { name: /Your Zakat Summary/i })
    ).toBeVisible();
    await expect(
      page.getByText('Net Zakatable Wealth', { exact: true })
    ).toBeVisible();
    await expect(page.getByText(/AED 90,000/)).toBeVisible();

    await screenshotIf(
      page,
      testInfo.project.name,
      'Desktop Chrome',
      'e2e/screenshots/06-liabilities.png'
    );

    await page.getByRole('button', { name: /Recalculate/i }).click();
    await page.getByRole('button', { name: /Continue →/i }).click();
    await fillCashAmount(page, '100000');
    await page.getByRole('button', { name: /Continue to debts/i }).click();
    await page.getByLabel(/Outstanding loans due this year/i).fill('200000');
    await page.getByRole('button', { name: /See my Zakat result/i }).click();
    await expect(page.getByText('No Zakat Due')).toBeVisible();
  });
});
