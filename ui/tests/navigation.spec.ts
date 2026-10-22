import { test, expect } from '@playwright/test';
import { HeaderPage } from '../pages/HeaderPage';

test.describe('Навигация по приложению', () => {
  test('Переход с главной на /login через header', async ({ page }) => {
    await page.goto('/');
    const header = new HeaderPage(page);
    await header.loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('Переход с главной на /register через header', async ({ page }) => {
    await page.goto('/');
    const header = new HeaderPage(page);
    await header.registerLink.click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('Переход на /analysis/new', async ({ page }) => {
    await page.goto('/');
    const header = new HeaderPage(page);
    await header.newAnalysisLink.click();
    await expect(page).toHaveURL(/\/analysis\/new/);
  });

  test('Переход на /history', async ({ page }) => {
    await page.goto('/');
    const header = new HeaderPage(page);
    await header.historyLink.click();
    await expect(page).toHaveURL(/\/history/);
  });

  test('Прямой переход на /profile', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/profile/);
  });
});