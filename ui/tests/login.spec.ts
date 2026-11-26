import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { testData } from '../fixtures/testData';

test.describe('Авторизация', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    page.on('console', (msg) => {
      if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text());
    });
    page.on('requestfailed', (req) => {
      console.log('REQUEST FAILED:', req.url(), req.failure()?.errorText);
    });
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('A-1: Успешный вход', async ({ page }) => {
    await loginPage.fillForm('name12@mail.ru', '1234567q');
    await loginPage.submit();
    await expect(page).toHaveURL(/\/analysis\/new|\/dashboard/, { timeout: 5000 });
  });

  test('A-3: Ссылка "Нет аккаунта?" ведет на /register', async ({ page }) => {
    await loginPage.registerLink.click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('A-4: Авторизованный на /login', async ({ page }) => {
    await loginPage.fillForm('name12@mail.ru', '1234567q');
    await loginPage.submit();
    await loginPage.goto();
    
    await expect(page).toHaveURL(/\/analysis\/new/);
  });

  test('A-5: Неверный пароль — ошибка', async ({ page }) => {
    await loginPage.fillForm(testData.login.validEmail, 'WrongPassword123');
    await loginPage.submit();
    // Ошибка от бэка обычно имеет role="alert"
    await expect(page.locator('[role="alert"]')).toContainText(/неверн|ошибк/i);
  });

  test('A-6: Несуществующий email — ошибка', async ({ page }) => {
    await loginPage.fillForm('nouser@example.com', 'Password123');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/неверн|ошибк/i);
  });

  test('A-7: Пустой email — ошибка', async ({ page }) => {
    await loginPage.fillForm('', 'Password123');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/Введите email/i);
  });

  test('A-8: Пустой пароль — ошибка', async ({ page }) => {
    await loginPage.fillForm('email@a.a', '');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/Введите пароль/i);
  });

  test('A-9: Оба поля пустые — ошибка', async ({ page }) => {
    await loginPage.fillForm('', '');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/Введите пароль/i);
  });

  test('AG-1: Email с пробелами по краям (Trim)', async ({ page }) => {
    await loginPage.fillForm('  test@example.com  ', 'Password123');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).not.toContainText(/Email/i);
  });

  test('A-G2: Email в верхнем регистре (Lower-case)', async ({ page }) => {
    await loginPage.fillForm('NAME12@MAIL.RU', '1234567q');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/Email/i);
  });

  test('A-G3: Пароль с пробелом внутри', async ({ page }) => {
    await loginPage.fillForm('TEST@EXAMPLE.COM', 'Password 123');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/пробел/i);
  });

  test('A-G4: Очень длинный email', async ({ page }) => {
    await loginPage.fillForm(testData.invalidEmails.tooLong, 'Password123');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/Email/i);
  });

  test('A-G5: Пароль ровно минимальной длины', async ({ page }) => {
    await loginPage.fillForm('name12@mail.ru', '1234567q');
    await loginPage.submit();
    await expect(page).toHaveURL(/\/analysis\/new/, { timeout: 5000 });
  });

  test('AS-1: SQL-инъекция в email', async ({ page }) => {
    await loginPage.fillForm('\' OR 1=1--', 'Password123');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/email/i);
  });

  test('AS-2: SQL-инъекция в пароль', async ({ page }) => {
    await loginPage.fillForm(testData.validEmails.basic, '\' OR 1=1--');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/пароль/i);
  });

  test('AS-3: XSS в email', async ({ page }) => {
    await loginPage.fillForm('<script>alert(\'XSS\')</script>', 'Password123');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/email/i);
  });

    test('AS-3: XSS в пароль', async ({ page }) => {
    await loginPage.fillForm(testData.validEmails.basic, '<script>alert(\'XSS\')</script>');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/пароль/i);
  });

});