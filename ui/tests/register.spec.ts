import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';

test.describe('Регистрация - Валидация (по требованиям аналитиков)', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  // ==========================================
  // ПОЗИТИВНЫЕ СЦЕНАРИИ
  // ==========================================

  test('R-1: Успешная регистрация', async ({ page }) => {
    await registerPage.fillForm(
      'unique_new_user_999@example.com', 
      'Password123', 
      'Password123'
    );
    await registerPage.submit();
    // Проверяем редирект (если бэк подключен)
    await expect(page).toHaveURL(/\/analysis\/new|\/dashboard/, { timeout: 5000 });
  });

  test('R-4: Пароль ровно 8 символов — форма валидна', async () => {
    await registerPage.fillForm(
      'test@example.com',
      'Pass1234', 
      'Pass1234'
    );
    await expect(registerPage.submitButton).toBeEnabled();
  });

  // ==========================================
  // ВАЛИДАЦИЯ EMAIL
  // ==========================================

  test('R-E1: Пусто → "Введите email"', async ({ page }) => {
    await registerPage.fillForm('', 'Password123', 'Password123');
    await registerPage.submit();
    // Ищем по data-testid, чтобы не задеть подсказки
    await expect(page.locator('[data-testid="register-email-error-email_required"]')).toHaveText(/Введите email/i);
  });

  test('R-E2: Пробелы внутри → "Email не должен содержать пробелы"', async ({ page }) => {
    await registerPage.fillForm('iv an@example.com', 'Password123', 'Password123');
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_has_spaces"]')).toHaveText(/не должен содержать пробелы/i);
  });

  test('R-E3: Нет @ → "Email должен содержать символ @"', async ({ page }) => {
    await registerPage.fillForm('ivan.example.com', 'Password123', 'Password123');
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_no_at"]')).toHaveText(/должен содержать символ @/i);
  });

  test('R-E4: После @ пусто → "Email должен содержать домен"', async ({ page }) => {
    await registerPage.fillForm('ivan@', 'Password123', 'Password123');
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_no_domain"]')).toHaveText(/должен содержать домен/i);
  });

  test('R-E5: Длиннее 254 символов → "Email слишком длинный"', async ({ page }) => {
    const longEmail = 'a'.repeat(255) + '@example.com';
    await registerPage.fillForm(longEmail, 'Password123', 'Password123');
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_too_long"]')).toHaveText(/слишком длинный/i);
  });

  test('R-E6: Некорректный формат (две точки) → "Некорректный email"', async ({ page }) => {
    await registerPage.fillForm('ivan..petrov@example.com', 'Password123', 'Password123');
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_invalid"]')).toHaveText(/Некорректный email/i);
  });

  test('R-E7: Кириллица → "Некорректный email"', async ({ page }) => {
    await registerPage.fillForm('иван@example.com', 'Password123', 'Password123');
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_invalid"]')).toHaveText(/Некорректный email/i);
  });

  // ==========================================
  // ВАЛИДАЦИЯ ПАРОЛЯ
  // ==========================================

  test('R-P1: Пусто → "Введите пароль"', async ({ page }) => {
    await registerPage.fillForm('test@example.com', '', '');
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-password-error-password_required"]')).toHaveText(/Введите пароль/i);
  });

  test('R-P2: Короче 8 → "Пароль должен содержать минимум 8 символов"', async ({ page }) => {
    await registerPage.fillForm('test@example.com', 'Short1', 'Short1');
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-password-error-password_too_short"]')).toHaveText(/минимум 8 символов/i);
  });

  test('R-P3: Длиннее 64 → "Пароль не должен быть длиннее 64 символов"', async ({ page }) => {
    const longPass = 'A1' + 'a'.repeat(65); 
    await registerPage.fillForm('test@example.com', longPass, longPass);
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-password-error-password_too_long"]')).toHaveText(/длиннее 64 символов/i);
  });

  test('R-P4: Пробелы/недопустимые символы → "Пароль содержит недопустимые символы"', async ({ page }) => {
    await registerPage.fillForm('test@example.com', 'Pass 123', 'Pass 123');
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-password-error-password_invalid_chars"]')).toHaveText(/недопустимые символы или пробелы/i);
  });

  test('R-P5: Нет буквы → "Пароль должен содержать хотя бы одну букву"', async ({ page }) => {
    await registerPage.fillForm('test@example.com', '12345678', '12345678');
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-password-error-password_no_letter"]')).toHaveText(/хотя бы одну заглавную букву/i);
  });

  test('R-P6: Нет цифры → "Пароль должен содержать хотя бы одну цифру"', async ({ page }) => {
    await registerPage.fillForm('test@example.com', 'Password', 'Password');
    await registerPage.submit();
    // Тот самый тест, где была ошибка!
    await expect(page.locator('[data-testid="register-password-error-password_no_digit"]')).toBeVisible();
  });

  test('R-P7: Совпадает с email → "Пароль не должен совпадать с email"', async ({ page }) => {
    await registerPage.fillForm('test@example.com', 'Test@example.com', 'Test@example.com');
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-password-error-password_equals_email"]')).toHaveText(/не должен совпадать с email/i);
  });

  // ==========================================
  // ВАЛИДАЦИЯ ПОДТВЕРЖДЕНИЯ ПАРОЛЯ (только фронт)
  // ==========================================

  test('R-P15: Пароли не совпадают', async ({ page }) => {
    await registerPage.fillForm('test@example.com', 'Password-123', 'Password-321');
    await registerPage.submit();
    // Обычно для несовпадения нет строгого кода в бэкенде, ищем по data-testid
    await expect(page.locator('[data-testid="register-confirm-password-error"]')).toHaveText(/Пароли не совпадают/i);
  });

  // ==========================================
  // ПРОВЕРКА ПРИОРИТЕТА ОШИБОК
  // ==========================================

  test('R-ORDER: Показывается только ПЕРВАЯ ошибка из списка', async ({ page }) => {
    // Вводим email без @ (ошибка 3) и короткий пароль (ошибка 2)
    await registerPage.fillForm('invalidemail', '123', '123');
    await registerPage.submit();
    
    // Сначала проверяем, что показана ошибка email
    await expect(page.locator('[data-testid="register-email-error-email_no_at"]')).toBeVisible();
    
    // И убеждаемся, что ошибки пароля пока нет (скрыта)
    await expect(page.locator('[data-testid="register-password-error-password_too_short"]')).toBeHidden();
  });

});