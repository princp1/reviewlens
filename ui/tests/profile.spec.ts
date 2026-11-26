import { test, expect } from '@playwright/test';
import { ProfilePage } from '../pages/ProfilePage';

test.describe('Личный кабинет (US-13)', () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
  });

  test('P-1: Доступ к ЛК без токена → редирект на /login', async ({ page }) => {
    await profilePage.goto();
    await expect(page).toHaveURL(/\/login/);
  });

  test('P-2: Отображение данных в ЛК', async ({ page }) => {
    await profilePage.loginByAccount();
    await profilePage.goto();

    await expect(page).toHaveURL(/\/profile/);
    await expect(page.locator('[data-testid="header-account-menu"]')).toBeVisible();
  });

  test('P-3: Кнопка "Перейти к истории" присутствует', async ({ page }) => {
    await profilePage.loginByAccount();
    await profilePage.goto();

    await expect(page.locator('[data-testid="profile-primary-action"]')).toBeVisible();
  });
});