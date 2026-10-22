import { test, expect } from '@playwright/test';
import { ProfilePage } from '../pages/ProfilePage';

test.describe('Выход из системы (US-2)', () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
    // Авторизуемся перед каждым тестом
    await profilePage.mockLogin();
  });

  test('L-1: Успешный выход из аккаунта', async ({ page }) => {
    await profilePage.goto();
    
    // Нажимаем на меню и кнопку "Выйти"
    await profilePage.logout();

    // 1. Проверяем, что произошел редирект на главную
    await expect(page).toHaveURL(/^\/(login)?$/);
    
    // 2. Проверяем, что токены удалены из localStorage
    const token = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(token).toBeNull();
  });

  test('L-2: Доступ к защищенной странице после выхода', async ({ page }) => {
    await profilePage.goto();
    await profilePage.logout();

    // Пробуем снова открыть ЛК
    await page.goto('/profile');
    
    // Должно выкинуть на логин
    await expect(page).toHaveURL(/\/login/);
  });
});