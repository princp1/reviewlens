import { test, expect } from '@playwright/test';
import { ProfilePage } from '../pages/ProfilePage';

test.describe('Выход из системы (US-2)', () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
    await profilePage.loginByAccount();
  });

  test('L-1: Успешный выход из аккаунта', async ({ page }) => {
    await profilePage.goto();
    await profilePage.logout();

    // 1. Проверяем, что произошел редирект на главную
    await expect(page).toHaveURL('/');

    // 2. Проверяем, что сессия и токены Zustand очищены из хранилищ
    const storageCleared = await page.evaluate(() => {
      const rawSession = localStorage.getItem('reviewlens-session');
      const refreshSession = sessionStorage.getItem('reviewlens-refresh-session');
      if (!rawSession) return true;

      const parsed = JSON.parse(rawSession);
      return !parsed?.state?.token && !refreshSession;
    });
    expect(storageCleared).toBe(true);
  });

  test('L-6: Доступ к защищенным страницам после выхода редиректит на /login', async ({ page }) => {
    await profilePage.goto();
    await profilePage.logout();

    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login/);

    await page.goto('/history');
    await expect(page).toHaveURL(/\/login/);

    await page.goto('/analysis/new');
    await expect(page).toHaveURL(/\/login/);
  });
});