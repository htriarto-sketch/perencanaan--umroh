import { test, expect } from '@playwright/test';

test('landing page loads and has title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Program Perencanaan Umroh/);
});

test('login page is accessible', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('h1')).toContainText('Selamat Datang');
});
