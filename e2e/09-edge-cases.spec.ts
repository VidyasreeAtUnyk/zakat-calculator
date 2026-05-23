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

async function finishWithNoDebts(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: /Continue to debts/i }).click();
  await toggleNoDebts(page);
  await page.getByRole('button', { name: /See my Zakat result/i }).click();
}

test.describe('Edge cases', () => {
  test('covers boundary scenarios', async ({ page }, testInfo) => {
    await gotoHome(page);
    await beginCalculation(page);
    await selectAsset(page, 'Cash & Savings');
    await continueWizard(page);
    await fillCashAmount(page, '0');
    await finishWithNoDebts(page);
    await expect(page.getByText('No Zakat Due')).toBeVisible();

    await gotoHome(page);
    await beginCalculation(page);
    await selectAsset(page, 'Gold');
    await continueWizard(page);
    await expect(
      page.getByText(/How do you primarily use this gold/i)
    ).toBeVisible();
    await page.getByRole('button', { name: /I wear it regularly/i }).click();
    await finishWithNoDebts(page);
    await expect(page.getByText('No Zakat Due')).toBeVisible();

    await gotoHome(page);
    await beginCalculation(page);
    await selectAsset(page, 'Property');
    await continueWizard(page);
    await page.getByLabel(/My primary home/i).check();
    await finishWithNoDebts(page);
    await expect(page.getByText('No Zakat Due')).toBeVisible();

    await page.route('**/api.gold-api.com/**', (route) => route.abort());
    await gotoHome(page);
    await beginCalculation(page);
    await selectAsset(page, 'Cash & Savings');
    await continueWizard(page);
    await fillCashAmount(page, '27200');
    await finishWithNoDebts(page);
    await expect(page.getByText('Zakat is due on your wealth')).toBeVisible();

    await gotoHome(page);
    await beginCalculation(page);
    await selectAsset(page, 'Cash & Savings');
    await continueWizard(page);
    await fillCashAmount(page, '50000');
    await page.getByRole('button', { name: /Continue to debts/i }).click();
    await page.getByLabel(/Outstanding loans due this year/i).fill('50000');
    await page.getByRole('button', { name: /See my Zakat result/i }).click();
    await expect(page.getByText('No Zakat Due')).toBeVisible();

    await gotoHome(page);
    await beginCalculation(page);
    await selectAsset(page, 'Cash & Savings');
    await selectAsset(page, 'Investments');
    await continueWizard(page);
    await fillCashAmount(page, '500000000');
    await page.getByRole('button', { name: /Next asset/i }).click();
    await page.getByLabel(/Approximate current market value/i).fill('400000000');
    await finishWithNoDebts(page);
    await expect(page.getByText('Zakat is due on your wealth')).toBeVisible();

    await screenshotIf(
      page,
      testInfo.project.name,
      'Desktop Chrome',
      'e2e/screenshots/09-edge-cases.png'
    );
  });
});
