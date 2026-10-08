import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

test.describe('Главная страница', () => {
  test('Открывается корректно', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.expectLoaded();
  });

  test('Кнопка "Начать" ведёт на регистрацию или анализ', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.startButton.click();
    await expect(page).not.toHaveURL('/');
  });

  test('Кнопка "Войти" ведёт на /login', async ({ page }) => {
    const home = new HomePage(page);
    await home.goto();
    await home.loginButton.click();
    await expect(page).toHaveURL(/\/login/);
  });
});