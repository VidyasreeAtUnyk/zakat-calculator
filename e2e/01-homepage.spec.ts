import { test, expect } from '@playwright/test';
import { gotoHome, isDesktopChrome, screenshotIf } from './helpers';

test.describe('Homepage', () => {
  const consoleErrors: string[] = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors.length = 0;
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    await gotoHome(page);
  });

  test('displays landing content and nisab banner', async ({ page }, testInfo) => {
    await expect(
      page.getByRole('heading', { name: 'Calculate Your Zakat' })
    ).toBeVisible();
    await expect(page.getByText(/Current Nisab \(85g gold\)/i)).toBeVisible();
    await expect(
      page.getByText(/Live price|Estimated price|Loading/i).first()
    ).toBeVisible();
    await expect(page.getByText(/AED/i).first()).toBeVisible();

    const nisabText = await page
      .getByText(/Current Nisab \(85g gold\)/i)
      .textContent();
    expect(nisabText).toMatch(/AED\s*[\d,]+\.\d{2}/);

    await expect(
      page.getByRole('heading', { name: 'What is Zakat?' })
    ).toBeVisible();
    await expect(page.getByText('The Third Pillar of Islam')).toBeVisible();
    await expect(page.getByText('Who Pays Zakat?')).toBeVisible();
    await expect(page.getByText('Where Does Zakat Go?')).toBeVisible();

    await expect(
      page.getByRole('button', { name: /Begin Calculation/i })
    ).toBeVisible();

    await page.getByRole('link', { name: /mal/i }).click();
    await expect(page).toHaveURL('/');

    expect(consoleErrors).toEqual([]);

    await screenshotIf(
      page,
      testInfo.project.name,
      'Desktop Chrome',
      'e2e/screenshots/01-homepage.png'
    );
  });
});
