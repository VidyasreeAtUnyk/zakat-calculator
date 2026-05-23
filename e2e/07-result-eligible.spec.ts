import { test, expect } from '@playwright/test';
import { completeCashOnly, screenshotIf } from './helpers';

test.describe('Eligible result', () => {
  test('shows zakat due for wealth above nisab', async ({ page }, testInfo) => {
    await completeCashOnly(page, '100000');

    await expect(page.getByText('Zakat is due on your wealth')).toBeVisible();
    await expect(page.getByText('AED 2,500.00').first()).toBeVisible();
    await expect(page.getByText('Cash & Savings')).toBeVisible();
    await expect(page.getByLabel('Zakatable').first()).toBeVisible();
    await expect(page.getByText(/lunar year \(Hawl\)/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Download Summary/i })
    ).toBeVisible();
    await expect(page.getByRole('button', { name: /Recalculate/i })).toBeVisible();

    await page.waitForTimeout(500);
    await screenshotIf(
      page,
      testInfo.project.name,
      'Desktop Chrome',
      'e2e/screenshots/07-result-eligible.png'
    );

    await page.getByRole('button', { name: /Recalculate/i }).click();
    await expect(
      page.getByRole('heading', { name: /What assets do you own/i })
    ).toBeVisible();
  });
});
