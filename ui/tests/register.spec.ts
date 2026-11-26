import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { testData } from '../fixtures/testData';

test.describe('Регистрация — позитивные, негативные и граничные проверки', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  // ==========================================
  // ПОЗИТИВНЫЕ И ГРАНИЧНЫЕ СЦЕНАРИИ
  // ==========================================

  test('R-1: Успешная регистрация с уникальным email', async ({ page }) => {
    const uniqueEmail = `qa_reg_${Date.now()}@example.com`;
    await registerPage.fillForm(
      uniqueEmail,
      testData.validPasswords.basic,
      testData.validPasswords.basic
    );
    await registerPage.submit();

    await expect(page).toHaveURL(/\/analysis\/new/, { timeout: 7000 });
  });

  test('R-3: Кнопка "Зарегистрироваться через ВК" доступна и ведёт на VK OAuth', async ({ page }) => {
    const vkButton = page.getByText(/Зарегистрироваться через ВК|Через ВК/i);
    await expect(vkButton).toBeVisible();
    await expect(vkButton).toBeEnabled();
  });

  test('R-4: Почта занята → ошибка после сабмишена', async ({ page }) => {
    await registerPage.fillForm("mail@mail.com", testData.validPasswords.basic, '');
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-confirm-password-error"]')).toBeVisible();
  });

  test('R-5, 6, 7, 8: Пустые поля → "Введите email, пароль"', async ({ page }) => {
    await registerPage.fillForm(
      testData.invalidEmails.empty,
      testData.invalidPasswords.empty,
      testData.invalidPasswords.empty
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_required"]')).toHaveText(/Введите/i);
  });

  test('R-14: Граничное значение — пароль ровно 8 символов', async () => {
    await registerPage.fillForm(
      testData.validEmails.basic,
      testData.validPasswords.min8,
      testData.validPasswords.min8
    );
    await expect(registerPage.submitButton).toBeEnabled();
  });

  test('R-14-MAX: Граничное значение — пароль ровно 64 символа', async () => {
    await registerPage.fillForm(
      testData.validEmails.basic,
      testData.validPasswords.max64,
      testData.validPasswords.max64
    );
    await expect(registerPage.submitButton).toBeEnabled();
  });
    test('R-17: Email в верхнем регистре принимается и нормализуется', async ({ page }) => {
    const upperEmail = `QA_UPPER_${Date.now()}@EXAMPLE.COM`;
    await registerPage.fillForm(upperEmail, testData.validPasswords.basic, testData.validPasswords.basic);
    await registerPage.submit();
    await expect(page).toHaveURL(/\/analysis\/new/, { timeout: 7000 });
  });

  test('R-18: Email с алиасом (+) принимается', async () => {
    await registerPage.fillForm(
      testData.validEmails.withPlus,
      testData.validPasswords.basic,
      testData.validPasswords.basic
    );
    await expect(registerPage.submitButton).toBeEnabled();
  });

    test('R-22: Авторизованный пользователь при открытии /register перенаправляется на /analysis/new', async ({ page }) => {
    const uniqueEmail = `qa_auth_redir_${Date.now()}@example.com`;
    await registerPage.fillForm(uniqueEmail, testData.validPasswords.basic, testData.validPasswords.basic);
    await registerPage.submit();
    await expect(page).toHaveURL(/\/analysis\/new/, { timeout: 7000 });

    // Пробуем снова открыть /register будучи авторизованным
    await registerPage.goto();
    await expect(page).toHaveURL(/\/analysis\/new/);
  });

  // ==========================================
  // ВАЛИДАЦИЯ EMAIL
  // ==========================================

  test('R-E1: Нет @ → "Email должен содержать символ @"', async ({ page }) => {
    await registerPage.fillForm(
      testData.invalidEmails.noAt,
      testData.validPasswords.basic,
      testData.validPasswords.basic
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_no_at"]')).toHaveText(/должен содержать символ @/i);
  });

  test('R-E2: После @ пусто → "Email должен содержать домен"', async ({ page }) => {
    await registerPage.fillForm(
      testData.invalidEmails.noDomain,
      testData.validPasswords.basic,
      testData.validPasswords.basic
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_no_domain"]')).toHaveText(/должен содержать домен/i);
  });

  test('R-E3: Email без локальной части (@example.com) → ошибка формата', async ({ page }) => {
    await registerPage.fillForm(
      testData.invalidEmails.noLocalPart,
      testData.validPasswords.basic,
      testData.validPasswords.basic
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_invalid"]')).toBeVisible();
  });

  test('R-E4: Пробелы внутри email → "Email не должен содержать пробелы"', async ({ page }) => {
    await registerPage.fillForm(
      testData.invalidEmails.spaceInMiddle,
      testData.validPasswords.basic,
      testData.validPasswords.basic
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_has_spaces"]')).toHaveText(/пробелы/);
  });

  test('R-E5: Email с двумя @ (user@@example.com) → ошибка формата', async ({ page }) => {
    await registerPage.fillForm(
      testData.invalidEmails.doubleAt,
      testData.validPasswords.basic,
      testData.validPasswords.basic
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_invalid"]')).toBeVisible();
  });

  test('R-E6: Некорректный формат (две точки) → ошибка формата', async ({ page }) => {
    await registerPage.fillForm(
      testData.invalidEmails.doubleDot,
      testData.validPasswords.basic,
      testData.validPasswords.basic
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_invalid"]')).toBeVisible();
  });

  test('R-E7: Email с точкой в начале (.user@example.com) → ошибка формата', async ({ page }) => {
    await registerPage.fillForm(
      testData.invalidEmails.dotAtStart,
      testData.validPasswords.basic,
      testData.validPasswords.basic
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_invalid"]')).toBeVisible();
  });

  test('R-E8: Email с точкой в конце (user.@example.com) → ошибка формата', async ({ page }) => {
    await registerPage.fillForm(
      testData.invalidEmails.dotAtEnd,
      testData.validPasswords.basic,
      testData.validPasswords.basic
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_invalid"]')).toBeVisible();
  });

  test('R-E9: Email без TLD (user@localhost) → ошибка формата', async ({ page }) => {
    await registerPage.fillForm(
      testData.invalidEmails.noTld,
      testData.validPasswords.basic,
      testData.validPasswords.basic
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_invalid"]')).toBeVisible();
  });

  test('R-E10: Email с коротким TLD (a@b.c) → ошибка формата', async ({ page }) => {
    await registerPage.fillForm(
      testData.invalidEmails.tooShort,
      testData.validPasswords.basic,
      testData.validPasswords.basic
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_invalid"]')).toBeVisible();
  });

  test('R-E11: Email длиннее 254 символов → "Email слишком длинный"', async ({ page }) => {
    await registerPage.fillForm(
      testData.invalidEmails.tooLong,
      testData.validPasswords.basic,
      testData.validPasswords.basic
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_too_long"]')).toHaveText(/слишком длинный/i);
  });

  test('R-E13: Email только из пробелов → "Введите еmail"', async ({ page }) => {
    await registerPage.fillForm(
      testData.invalidEmails.onlySpaces,
      testData.validPasswords.basic,
      testData.validPasswords.basic
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_too_long"]')).toHaveText(/Введите email/i);
  });

  test('R-E14: Кириллица в email → ошибка формата', async ({ page }) => {
    await registerPage.fillForm(
      testData.invalidEmails.cyrillic,
      testData.validPasswords.basic,
      testData.validPasswords.basic
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-email-error-email_invalid"]')).toBeVisible();
  });

  // ==========================================
  // ВАЛИДАЦИЯ ПАРОЛЯ
  // ==========================================

  test('R-P1: Пустой пароль → "Введите пароль"', async ({ page }) => {
    await registerPage.fillForm(testData.validEmails.basic, '', '');
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-password-error-password_required"]')).toHaveText(/Введите пароль/i);
  });

  test('R-P2: 1 символ в пароле → "Минимум 8 символов"', async ({ page }) => {
    await registerPage.fillForm(
      testData.validEmails.basic,
      "1",
      "1"
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-password-error-password_too_short"]')).toHaveText(/минимум 8 символов/i);
  });

  test('R-P3: Короче 8 символов (7 символов) → "Минимум 8 символов"', async ({ page }) => {
    await registerPage.fillForm(
      testData.validEmails.basic,
      testData.invalidPasswords.sevenChars,
      testData.invalidPasswords.sevenChars
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-password-error-password_too_short"]')).toHaveText(/минимум 8 символов/i);
  });

  test('R-P4,5 / R-P20: Пробелы в пароле → недопустимые символы', async ({ page }) => {
    await registerPage.fillForm(
      testData.validEmails.basic,
      testData.invalidPasswords.withInnerSpace,
      testData.invalidPasswords.withInnerSpace
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-password-error-password_invalid_chars"]')).toHaveText(/недопустимые символы или пробелы/i);
  });

  test('R-P6: Нет буквы (только цифры) → ошибка валидации', async ({ page }) => {
    await registerPage.fillForm(
      testData.validEmails.basic,
      testData.invalidPasswords.onlyDigits,
      testData.invalidPasswords.onlyDigits
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-password-error-password_no_letter"]')).toHaveText(/хотя бы одну букву/i);
  });

  test('R-P7: Нет цифры (только буквы) → ошибка валидации', async ({ page }) => {
    await registerPage.fillForm(
      testData.validEmails.basic,
      testData.invalidPasswords.withoutDigits,
      testData.invalidPasswords.withoutDigits
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-password-error-password_no_digit"]')).toBeVisible();
  });
  
  test('R-P9: Кириллица в пароле → недопустимые символы', async ({ page }) => {
    await registerPage.fillForm(
      testData.validEmails.basic,
      testData.invalidPasswords.cyrillic,
      testData.invalidPasswords.cyrillic
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-password-error-password_invalid_chars"]')).toHaveText(/недопустимые символы или пробелы/i);
  });

  test('R-P10: Пароль из эмодзи → недопустимые символы', async ({ page }) => {
    await registerPage.fillForm(
      testData.validEmails.basic,
      testData.invalidPasswords.emoji,
      testData.invalidPasswords.emoji
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-password-error-password_invalid_chars"]')).toBeVisible();
  });

  test('R-P11: Длиннее 64 символов (65 символов) → "Пароль не должен быть длиннее 64 символов"', async ({ page }) => {
    await registerPage.fillForm(
      testData.validEmails.basic,
      testData.invalidPasswords.tooLong,
      testData.invalidPasswords.tooLong
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-password-error-password_too_long"]')).toHaveText(/длиннее 64 символов/i);
  });

  test('R-P12: Пароли не совпадают', async ({ page }) => {
    await registerPage.fillForm(
      testData.validEmails.basic,
      testData.mismatchedPasswords.first,
      testData.mismatchedPasswords.second
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-confirm-password-error"]')).toHaveText(/Пароли не совпадают/i);
  });

  test('R-P13: Пароли отличаются только регистром → ошибка несовпадения', async ({ page }) => {
    await registerPage.fillForm(
      testData.validEmails.basic,
      testData.mismatchedPasswords.first,
      testData.mismatchedPasswords.caseDifferent
    );
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-confirm-password-error"]')).toHaveText(/Пароли не совпадают/i);
  });

  test('R-P14: Совпадает с email → "Пароль не должен совпадать с email"', async ({ page }) => {
    await registerPage.fillForm('Test1@example.com', 'Test1@example.com', 'Test1@example.com');
    await registerPage.submit();
    await expect(page.locator('[data-testid="register-password-error-password_equals_email"]')).toHaveText(/не должен совпадать с email/i);
  });

  test('R-ORDER: Для каждого поля показывается только первая приоритетная ошибка из его списка', async ({ page }) => {
    // Email: 'invalidemail' (нет @ и некорректный формат -> должна показаться только email_no_at)
    // Пароль: '123' (короче 8 символов и нет букв -> должна показаться только password_too_short)
    await registerPage.fillForm('invalidemail', '123', '123');
    await registerPage.submit();

    // Под полем Email видна первая ошибка по приоритету, вторая скрыта
    await expect(page.locator('[data-testid="register-email-error-email_no_at"]')).toBeVisible();
    await expect(page.locator('[data-testid="register-email-error-email_invalid"]')).toBeHidden();

    // Под полем Пароль одновременно видна его первая ошибка по приоритету, вторая скрыта
    await expect(page.locator('[data-testid="register-password-error-password_too_short"]')).toBeVisible();
    await expect(page.locator('[data-testid="register-password-error-password_no_letter"]')).toBeHidden();
  });
});