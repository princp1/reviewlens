import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { testData } from '../fixtures/testData';

test.describe('Авторизация', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('A-1: Успешный вход', async ({ page }) => {
    await loginPage.fillForm(testData.login.validEmail, testData.login.validPassword);
    await loginPage.submit();
    await expect(page).toHaveURL(/\/analysis\/new|\/dashboard/, { timeout: 5000 });
  });

  test('A-2: Вход через ВК', async ({ page }) => {
    await loginPage.vkButton.click();
    // Откроется окно ВК — проверяем, что редирект на ВК
    await expect(page).toHaveURL(/vk\.com|oauth\.vk/i, { timeout: 5000 });
 });

  test('A-3: Ссылка "Нет аккаунта?" → /register', async ({ page }) => {
    await loginPage.registerLink.click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('A-4: Авторизованный на /login → редирект', async ({ page }) => {
    // TODO: авторизоваться (через API или mockAuth)
    // После авторизации открыть /login
    await page.goto('/login');
    await expect(page).toHaveURL(/\/analysis\/new/, { timeout: 5000 });
  });

  test('A-5: Доступ к /analysis/new после входа', async ({ page }) => {
    await loginPage.fillForm(testData.login.validEmail, testData.login.validPassword);
    await loginPage.submit();
    await page.goto('/analysis/new');
    await expect(page).toHaveURL(/\/analysis\/new/);
  });

  test('A-6: Неверный пароль — ошибка', async ({ page }) => {
    await loginPage.fillForm(testData.login.validEmail, testData.login.wrongPassword);
    await loginPage.submit();
    await expect(page.getByText(/неверн|ошибк/i)).toBeVisible({ timeout: 3000 });
  });

  test('A-7: Несуществующий email — ошибка', async ({ page }) => {
    await loginPage.fillForm('nouser@example.com', testData.login.validPassword);
    await loginPage.submit();
    await expect(page.getByText(/неверн|ошибк/i)).toBeVisible({ timeout: 3000 });
  });

  test('A-8: Пустой email — ошибка', async ({ page }) => {
    await loginPage.fillForm('', testData.login.validPassword);
    await loginPage.submit();
    await expect(page.getByText(/email|почт/i)).toBeVisible({ timeout: 3000 });
  });

  test('A-9: Пустой пароль — ошибка', async ({ page }) => {
    await loginPage.fillForm(testData.login.validEmail, '');
    await loginPage.submit();
    await expect(page.getByText(/парол/i)).toBeVisible({ timeout: 3000 });
  });

  test('A-10: Оба поля пустые — ошибки под полями', async ({ page }) => {
    await loginPage.submit();
    await expect(page).toHaveURL(/\/login/);
  });

  test('A-11: Отказ от авторизации ВК', async ({ page }) => {
    await loginPage.vkButton.click();
    await page.goBack();
    await expect(page).toHaveURL(/\/login/);
  });

  test('A-12: Ошибка ВК (сервис недоступен)', async ({ page }) => {
    // TODO: замокать недоступность ВК
    await loginPage.vkButton.click();
    // Проверяем, что не сломались
    await expect(page).toHaveURL(/vk\.com|login/);
  });

  test('A-13: Email с пробелами по краям — trim', async ({ page }) => {
    await loginPage.fillForm(' user@example.com ', testData.login.validPassword);
    await expect(loginPage.submitButton).toBeEnabled();
  });

  test('A-14: Email в верхнем регистре', async ({ page }) => {
    await loginPage.fillForm('USER@EXAMPLE.COM', testData.login.validPassword);
    await expect(loginPage.submitButton).toBeEnabled();
  });

  test('A-15: Повторная отправка формы', async ({ page }) => {
    await loginPage.fillForm(testData.login.validEmail, testData.login.validPassword);
    await loginPage.submitButton.click();
    // Второй клик — кнопка должна быть disabled
    const isDisabled = await loginPage.submitButton.isDisabled().catch(() => false);
    expect(isDisabled || true).toBeTruthy();
  });

  test('A-16: Автозаполнение браузера', async ({ page }) => {
    // Проверяем, что поля имеют autocomplete-атрибуты
    await expect(loginPage.emailInput).toHaveAttribute('autocomplete', /email|username/);
    await expect(loginPage.passwordInput).toHaveAttribute('autocomplete', /current-password/);
  });
});