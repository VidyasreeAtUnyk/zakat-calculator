import { test, expect } from '@playwright/test';
import { gotoHome, screenshotIf } from './helpers';

const ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'api.gold-api.com'];

test.describe('Security', () => {
  test('enforces client security expectations', async ({ page }, testInfo) => {
    const consoleErrors: string[] = [];
    const requestHosts: string[] = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    page.on('request', (request) => {
      try {
        const host = new URL(request.url()).hostname;
        requestHosts.push(host);
      } catch {
        /* ignore malformed URLs */
      }
    });

    const response = await page.goto('/');
    await page.waitForLoadState('networkidle');

    const storage = await page.evaluate(() => ({
      localLength: localStorage.length,
      sessionLength: sessionStorage.length,
    }));
    expect(storage.localLength).toBe(0);
    expect(storage.sessionLength).toBe(0);

    const cookies = await page.context().cookies();
    expect(cookies.length).toBe(0);

    expect(consoleErrors).toEqual([]);

    const unexpected = requestHosts.filter(
      (host) => !ALLOWED_HOSTS.some((allowed) => host.includes(allowed))
    );
    expect(unexpected).toEqual([]);

    expect(response?.headers()['x-frame-options']).toBe('DENY');

    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    await screenshotIf(
      page,
      testInfo.project.name,
      'Desktop Chrome',
      'e2e/screenshots/11-security.png'
    );
  });
});
