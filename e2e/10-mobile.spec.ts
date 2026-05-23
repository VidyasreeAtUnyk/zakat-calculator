import { test, expect } from '@playwright/test';
import {
  beginCalculation,
  gotoHome,
  isMobileSE,
  screenshotIf,
  toggleNoDebts,
} from './helpers';

test.describe('Mobile layout', () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(
      !isMobileSE(testInfo.project.name),
      'Mobile-only tests run on iPhone SE project'
    );
  });

  test('homepage and wizard fit small viewport', async ({ page }, testInfo) => {
    await gotoHome(page);
    const homeOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth
    );
    expect(homeOverflow).toBe(false);

    await screenshotIf(
      page,
      testInfo.project.name,
      'Mobile iPhone SE',
      'e2e/screenshots/10-mobile-homepage.png'
    );

    await beginCalculation(page);
    await expect(
      page.getByRole('button', { name: /Cash & Savings/i })
    ).toBeVisible();

    await page.getByRole('button', { name: /Cash & Savings/i }).click();
    await page.getByRole('button', { name: /Continue →/i }).click();
    await page
      .getByLabel(/Total balance across all accounts/i)
      .fill('100000');
    await page.getByRole('button', { name: /Continue to debts/i }).click();
    await toggleNoDebts(page);
    await page.getByRole('button', { name: /See my Zakat result/i }).click();
    await expect(page.getByText('Zakat is due on your wealth')).toBeVisible();

    const resultOverflow = await page.evaluate(() => {
      const table = document.querySelector('.breakdown-table');
      const card = document.querySelector('.wizard-card');
      const docOverflow =
        document.documentElement.scrollWidth > window.innerWidth;
      const tableOverflow = table
        ? table.scrollWidth > table.clientWidth + 2
        : false;
      const cardOverflow = card
        ? (card as HTMLElement).scrollWidth > (card as HTMLElement).clientWidth + 2
        : false;
      return docOverflow || tableOverflow || cardOverflow;
    });
    expect(resultOverflow).toBe(false);

    await screenshotIf(
      page,
      testInfo.project.name,
      'Mobile iPhone SE',
      'e2e/screenshots/10-mobile-result.png'
    );
  });
});
