import { test, expect } from '@playwright/test';
import { beginCalculation, gotoHome, screenshotIf } from './helpers';

test.describe('Accessibility', () => {
  test('meets basic a11y expectations in wizard', async ({ page }, testInfo) => {
    await gotoHome(page);

    await expect(
      page.getByRole('button', { name: /Begin Calculation/i })
    ).toBeVisible();
    await expect(page.getByRole('link', { name: /mal/i })).toBeVisible();

    await beginCalculation(page);
    await expect(page.getByRole('progressbar', { name: /Wizard progress/i })).toBeVisible();

    await page.getByRole('button', { name: /Cash & Savings/i }).click();
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    const focused = page.locator(':focus');
    await expect(focused).toBeVisible();

    await page.getByRole('button', { name: /Continue →/i }).click();
    const cashInput = page.getByLabel(/Total balance across all accounts/i);
    await expect(cashInput).toBeVisible();
    await cashInput.fill('1000000000');
    await expect(page.getByRole('alert').first()).toBeVisible();

    await screenshotIf(
      page,
      testInfo.project.name,
      'Desktop Chrome',
      'e2e/screenshots/12-accessibility.png'
    );
  });
});
