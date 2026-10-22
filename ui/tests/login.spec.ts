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

  test('A-3: Ссылка "Нет аккаунта?" ведет на /register', async ({ page }) => {
    await loginPage.registerLink.click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('A-6: Неверный пароль — ошибка', async ({ page }) => {
    await loginPage.fillForm(testData.login.validEmail, 'WrongPassword123');
    await loginPage.submit();
    // Ошибка от бэка обычно имеет role="alert"
    await expect(page.locator('[role="alert"]')).toContainText(/неверн|ошибк/i);
  });

  test('A-7: Несуществующий email — ошибка', async ({ page }) => {
    await loginPage.fillForm('nouser@example.com', 'Password123');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/неверн|ошибк/i);
  });

  test('A-8: Пустой email — ошибка', async ({ page }) => {
    await loginPage.fillForm('', 'Password123');
    await loginPage.submit();
    // Если Яна добавила data-testid на логине, лучше использовать его. 
    // Пока используем role="alert" с проверкой текста.
    await expect(page.locator('[role="alert"]')).toContainText(/Введите email/i);
  });

  test('A-13: Email с пробелами по краям (Trim)', async ({ page }) => {
    await loginPage.fillForm('  test@example.com  ', 'Password123');
    await loginPage.submit();
    // Не должно быть ошибки валидации формата email
    await expect(page.locator('[role="alert"]')).not.toContainText(/некорректный email/i);
  });

  test('A-14: Email в верхнем регистре (Lower-case)', async ({ page }) => {
    await loginPage.fillForm('TEST@EXAMPLE.COM', 'Password123');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).not.toContainText(/некорректный email/i);
  });
});