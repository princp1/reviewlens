import { test, expect, APIRequestContext } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { testData } from '../fixtures/testData';

const API_URL = process.env.API_URL || 'http://87.242.102.114/api/v1';
const TEST_EMAIL = process.env.TEST_EMAIL;
const TEST_PASSWORD = process.env.TEST_PASSWORD;

if (!TEST_EMAIL || !TEST_PASSWORD) {
  throw new Error('Не заданы переменные окружения TEST_EMAIL и TEST_PASSWORD');
}

async function ensureUserExists(request: APIRequestContext, username: string, password: string) {
  await request.post(`${API_URL}/auth/register`, {
    data: { username, password },
  });
}

test.describe('Авторизация', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('A-1: Успешный вход', async ({ page, request }) => {
    await ensureUserExists(request, TEST_EMAIL, TEST_PASSWORD);

    await loginPage.fillForm(TEST_EMAIL, TEST_PASSWORD);
    await loginPage.submit();
    await expect(page).toHaveURL(/\/analysis\/new/, { timeout: 5000 });
  });

  test('A-3: Ссылка "Нет аккаунта?" ведет на /register', async ({ page }) => {
    await loginPage.registerLink.click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('A-4: Авторизованный на /login редиректится на /analysis/new', async ({ page, request }) => {
    await ensureUserExists(request, TEST_EMAIL, TEST_PASSWORD);

    await loginPage.fillForm(TEST_EMAIL, TEST_PASSWORD);
    await loginPage.submit();
    await expect(page).toHaveURL(/\/analysis\/new/, { timeout: 5000 });

    await loginPage.goto();
    await expect(page).toHaveURL(/\/analysis\/new/);
  });

  test('A-5: Неверный пароль — ошибка', async ({ page, request }) => {
    await ensureUserExists(request, TEST_EMAIL, TEST_PASSWORD);

    await loginPage.fillForm(TEST_EMAIL, 'WrongPassword123');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/неверн|ошибк/i);
  });

  test('A-6: Несуществующий email — ошибка', async ({ page }) => {
    await loginPage.fillForm(`nouser_${Date.now()}@example.com`, 'Password123');
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
    await expect(page.getByText(/Введите email/i)).toBeVisible();
    await expect(page.getByText(/Введите пароль/i)).toBeVisible();
  });

  test('AG-1: Email с пробелами по краям (Trim)', async ({ page, request }) => {
    await ensureUserExists(request, TEST_EMAIL, TEST_PASSWORD);

    await loginPage.fillForm(`  ${TEST_EMAIL}  `, TEST_PASSWORD);
    await loginPage.submit();
    await expect(page).toHaveURL(/\/analysis\/new/, { timeout: 5000 });
  });

  test('A-G2: Email в верхнем регистре (Lower-case)', async ({ page, request }) => {
    await ensureUserExists(request, TEST_EMAIL, TEST_PASSWORD);

    await loginPage.fillForm(TEST_EMAIL.toUpperCase(), TEST_PASSWORD);
    await loginPage.submit();
    await expect(page).toHaveURL(/\/analysis\/new/, { timeout: 5000 });
  });

  test('A-G3: Пароль с пробелом внутри', async ({ page }) => {
    await loginPage.fillForm(TEST_EMAIL, 'Password 123');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/пробел|неверн/i);
  });

  test('A-G4: Очень длинный email', async ({ page }) => {
    await loginPage.fillForm(testData.invalidEmails.tooLong, 'Password123');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/Email/i);
  });

  test('A-G5: Пароль ровно минимальной длины (8 символов)', async ({ page, request }) => {
    const email8 = `qa_min8_${Date.now()}_${Math.random().toString(36).slice(2, 6)}@example.com`;
    const pass8 = testData.validPasswords.min8;
    await ensureUserExists(request, email8, pass8);

    await loginPage.fillForm(email8, pass8);
    await loginPage.submit();
    await expect(page).toHaveURL(/\/analysis\/new/, { timeout: 5000 });
  });

  test('AS-1: SQL-инъекция в email', async ({ page }) => {
    await loginPage.fillForm("' OR 1=1--", 'Password123');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/email/i);
  });

  test('AS-2: SQL-инъекция в пароль', async ({ page }) => {
    await loginPage.fillForm(testData.validEmails.basic, "' OR 1=1--");
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/пароль|неверн/i);
  });

  test('AS-3: XSS в email', async ({ page }) => {
    await loginPage.fillForm("<script>alert('XSS')</script>", 'Password123');
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/email/i);
  });

  test('AS-4: XSS в пароль', async ({ page }) => {
    await loginPage.fillForm(testData.validEmails.basic, "<script>alert('XSS')</script>");
    await loginPage.submit();
    await expect(page.locator('[role="alert"]')).toContainText(/пароль|неверн/i);
  });
});