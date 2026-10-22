import { test, expect } from '@playwright/test';
import { ProfilePage } from '../pages/ProfilePage';

test.describe('Личный кабинет (US-13)', () => {
  let profilePage: ProfilePage;

  test.beforeEach(async ({ page }) => {
    profilePage = new ProfilePage(page);
  });

  test('P-1: Доступ к ЛК без токена → редирект на /login', async ({ page }) => {
    // Не авторизуемся, просто идем на страницу
    await profilePage.goto();
    
    // Ожидаем, что нас выкинет на страницу логина
    await expect(page).toHaveURL(/\/login/);
  });

  test('P-2: Отображение данных в ЛК (с мок-токеном)', async ({ page }) => {
    // Подкладываем токен, чтобы фронт думал, что мы авторизованы
    await profilePage.mockLogin();
    await profilePage.goto();
    
    // Проверяем, что мы остались на странице профиля
    await expect(page).toHaveURL(/\/profile/);
    
    // Проверяем наличие кнопки "Выйти" (значит, ЛК загрузился)
    await expect(page.locator('[data-testid="header-account-menu"]')).toBeVisible();
  });

  test('P-3: Кнопка "Перейти к истории" присутствует', async ({ page }) => {
    await profilePage.mockLogin();
    await profilePage.goto();
    
    // Проверяем наличие кнопки на странице
    const historyBtn = page.getByText(/Перейти к истории/i);
    await expect(historyBtn).toBeVisible();
  });
});