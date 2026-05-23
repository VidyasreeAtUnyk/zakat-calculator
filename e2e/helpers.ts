import { expect, type Page } from '@playwright/test';

export async function stubGoldApiFallback(page: Page) {
  await page.route('https://api.gold-api.com/**', (route) => route.abort());
}

export async function gotoHome(page: Page, options?: { fallbackGold?: boolean }) {
  if (options?.fallbackGold) {
    await stubGoldApiFallback(page);
  }
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  if (options?.fallbackGold) {
    await page.waitForTimeout(900);
  }
}

export async function beginCalculation(page: Page) {
  await page.getByRole('button', { name: /Begin Calculation/i }).click();
}

export async function selectAsset(page: Page, label: string) {
  if (label === 'Gold') {
    await page
      .locator('button')
      .filter({ has: page.getByText('Gold', { exact: true }) })
      .click();
    return;
  }
  await page.getByRole('button', { name: new RegExp(label, 'i') }).first().click();
}

export async function continueWizard(page: Page) {
  await page.getByRole('button', { name: /Continue/i }).first().click();
}

export async function fillCashAmount(page: Page, amount: string) {
  await page
    .getByLabel(/Total balance across all accounts/i)
    .fill(amount);
}

export async function completeCashOnly(
  page: Page,
  amount: string,
  options?: { noDebts?: boolean }
) {
  await gotoHome(page);
  await beginCalculation(page);
  await selectAsset(page, 'Cash & Savings');
  await continueWizard(page);
  await fillCashAmount(page, amount);
  await page.getByRole('button', { name: /Continue to debts/i }).click();
  if (options?.noDebts !== false) {
    await toggleNoDebts(page);
  }
  await page.getByRole('button', { name: /See my Zakat result/i }).click();
  await expect(page.getByRole('heading', { name: /Your Zakat Summary/i })).toBeVisible({
    timeout: 15_000,
  });
}

export function isDesktopChrome(projectName: string) {
  return projectName === 'Desktop Chrome';
}

export function isMobileSE(projectName: string) {
  return projectName === 'Mobile iPhone SE';
}

export async function toggleNoDebts(page: Page) {
  await page.locator('label').filter({ hasText: 'I have no debts' }).click();
}

export async function screenshotIf(
  page: Page,
  projectName: string,
  expectedProject: string,
  path: string
) {
  if (projectName === expectedProject) {
    await page.screenshot({ path, fullPage: true });
  }
}
