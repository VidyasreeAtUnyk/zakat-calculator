import { test, expect } from '@playwright/test';
import { completeCashOnly, screenshotIf } from './helpers';

test.describe('Ineligible result', () => {
  test('shows no zakat due below nisab', async ({ page }, testInfo) => {
    await completeCashOnly(page, '1000');

    await expect(page.getByText('No Zakat Due')).toBeVisible();
    await expect(page.getByText(/below the Nisab threshold/i)).toBeVisible();

    await page.getByRole('button', { name: /Recalculate/i }).click();
    await expect(
      page.getByRole('heading', { name: /What assets do you own/i })
    ).toBeVisible();

    await screenshotIf(
      page,
      testInfo.project.name,
      'Desktop Chrome',
      'e2e/screenshots/08-result-ineligible.png'
    );
  });
});
