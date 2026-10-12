import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { testData } from '../fixtures/testData';

test.describe('Регистрация - запуск', () => {
  let registerPage: RegisterPage;
  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  // Позитивные
  test('R-1: Успешная регистрация (демо-режим)', async ({ page }) => {
    await registerPage.fillForm(
      testData.validEmails.basic,
      testData.validPasswords.basic,
      testData.validPasswords.basic
    );
    await registerPage.submit();
    await expect(page).toHaveURL(/\/analysis\/new/);
  });

  // Негативные
    test('R-8: Пустые поля — форма не отправляется', async () => {
    await registerPage.submit();
    await expect(registerPage.page).toHaveURL(/\/register/);
  });

  test('R-9: Пустой email — ошибка', async ({ page }) => {
  const reg = new RegisterPage(page);
  await reg.goto();
  await reg.fillForm(testData.invalidEmails.empty, 
                    testData.validPasswords.basic,
                    testData.validPasswords.basic);
  await reg.submit();
  await expect(page.getByText(/email/i)).toBeVisible();
});

test('R-10: Пустой пароль — ошибка', async ({ page }) => {
  const reg = new RegisterPage(page);
  await reg.goto();
  await reg.fillForm(testData.validEmails.basic, 
                    testData.invalidPasswords.empty,
                    testData.invalidPasswords.empty);
  await reg.submit();
  await expect(page.getByText(/парол/i)).toBeVisible();
});

test('R-11: Пустое подтверждение пароля — ошибка', async ({ page }) => {
  const reg = new RegisterPage(page);
  await reg.goto();
  await reg.fillForm(testData.validEmails.basic, 
                    testData.validPasswords.basic,
                    testData.invalidPasswords.empty);
  await reg.submit();
  await expect(page.getByText(/парол/i)).toBeVisible();
});

  test('R-E1: email без @ — ошибка', async ({ page }) => {
    await registerPage.fillForm(testData.invalidEmails.noAt, 
                    testData.validPasswords.basic,
                    testData.validPasswords.basic);
    await registerPage.submit();
    await expect(page.getByText(/email/i)).toBeVisible();
  });

  test('R-E2: email без домена — ошибка', async ({ page }) => {
    await registerPage.fillForm(testData.invalidEmails.noDomain, 
                    testData.validPasswords.basic,
                    testData.validPasswords.basic);
    await registerPage.submit();
    await expect(page.getByText(/email/i)).toBeVisible();
  });

    test('R-E3: email без локальной части — ошибка', async ({ page }) => {
    await registerPage.fillForm(testData.invalidEmails.noLocalPart, 
                    testData.validPasswords.basic,
                    testData.validPasswords.basic);
    await registerPage.submit();
    await expect(page.getByText(/email/i)).toBeVisible();
  });

    test('R-E4: email с пробелом по середине — ошибка', async ({ page }) => {
    await registerPage.fillForm(testData.invalidEmails.spaceInMiddle, 
                    testData.validPasswords.basic,
                    testData.validPasswords.basic);
    await registerPage.submit();
    await expect(page.getByText(/email/i)).toBeVisible();
  });


  test('R-E5: email с двумя @ — ошибка', async ({ page }) => {
    await registerPage.fillForm(testData.invalidEmails.doubleAt, 
                    testData.validPasswords.basic,
                    testData.validPasswords.basic);
    await registerPage.submit();
    await expect(page.getByText(/email/i)).toBeVisible();
  });

  test('R-E6: email с двумя точками подряд — ошибка', async ({ page }) => {
    await registerPage.fillForm(testData.invalidEmails.doubleDot, 
                    testData.validPasswords.basic,
                    testData.validPasswords.basic);
    await registerPage.submit();
    await expect(page.getByText(/email/i)).toBeVisible();
  });

  test('R-E7: email с точкой в начале — ошибка', async ({ page }) => {
    await registerPage.fillForm(testData.invalidEmails.dotAtStart, 
                    testData.validPasswords.basic,
                    testData.validPasswords.basic);
    await registerPage.submit();
    await expect(page.getByText(/email/i)).toBeVisible();
  });

  test('R-E8: email с точкой в конце — ошибка', async ({ page }) => {
    await registerPage.fillForm(testData.invalidEmails.dotAtEnd, 
                    testData.validPasswords.basic,
                    testData.validPasswords.basic);
    await registerPage.submit();
    await expect(page.getByText(/email/i)).toBeVisible();
  });

  test('R-E9: email без TLD — ошибка', async ({ page }) => {
    await registerPage.fillForm(testData.invalidEmails.noTld, 
                    testData.validPasswords.basic,
                    testData.validPasswords.basic);
    await registerPage.submit();
    await expect(page.getByText(/email/i)).toBeVisible();
  });
  
  test('R-E10: email короче 6 символов — ошибка', async ({ page }) => {
    await registerPage.fillForm(testData.invalidEmails.tooShort, 
                    testData.validPasswords.basic,
                    testData.validPasswords.basic);
    await registerPage.submit();
    await expect(page.getByText(/email/i)).toBeVisible();
  });

    test('R-E11: email длиннее 254 символов — ошибка', async ({ page }) => {
    await registerPage.fillForm(testData.invalidEmails.tooLong, 
                    testData.validPasswords.basic,
                    testData.validPasswords.basic);
    await registerPage.submit();
    await expect(page.getByText(/email/i)).toBeVisible();
  });

  test('R-E13: email только из пробелов — ошибка', async ({ page }) => {
    await registerPage.fillForm(testData.invalidEmails.onlySpaces, 
                    testData.validPasswords.basic,
                    testData.validPasswords.basic);
    await registerPage.submit();
    await expect(page.getByText(/email/i)).toBeVisible();
  });

  test('R-E14: email с кириллицей — ошибка', async ({ page }) => {
    await registerPage.fillForm(testData.invalidEmails.cyrillic, 
                    testData.validPasswords.basic,
                    testData.validPasswords.basic);
    await registerPage.submit();
    await expect(page.getByText(/email/i)).toBeVisible();
  });

  test('R-P2: Пароль из 1 символа — ошибка', async ({ page }) => {
    await registerPage.fillForm(
      testData.validEmails.basic,
      testData.invalidPasswords.oneChar,
      testData.invalidPasswords.oneChar
    );
    await registerPage.submit();
    await expect(page.getByText(/парол/i)).toBeVisible();
  });

  test('R-P3: Пароль из 7 символов — ошибка', async ({ page }) => {
    await registerPage.fillForm(
      testData.validEmails.basic,
      testData.invalidPasswords.sevenChars,
      testData.invalidPasswords.sevenChars
    );
    await registerPage.submit();
    await expect(page.getByText(/парол/i)).toBeVisible();
  });

  test('R-4: Пароль ровно 8 символов — форма валидна', async () => {
    await registerPage.fillForm(
      testData.validEmails.basic,
      testData.validPasswords.min8,
      testData.validPasswords.min8
    );
    await expect(registerPage.submitButton).toBeEnabled();
  });

  test('R-P4: Пароль только из пробелов — ошибка', async ({ page }) => {
    await registerPage.fillForm(
      testData.validEmails.basic,
      testData.invalidPasswords.onlySpaces,
      testData.invalidPasswords.onlySpaces
    );
    await registerPage.submit();
    await expect(page.getByText(/парол/i)).toBeVisible();
  });

  test('R-P5: Пароль с пробелом в начале — уточнить поведение', async ({ page }) => {
  await registerPage.fillForm(
    testData.validEmails.basic,
    testData.invalidPasswords.withLeadingSpace,
    testData.invalidPasswords.withLeadingSpace
  );
  await registerPage.submit();
  await expect(page.getByText(/парол/i)).toBeVisible({ timeout: 3000 });
});

  test('R-P6: Пароль без цифр — ошибка', async ({ page }) => {
  await registerPage.fillForm(
    testData.validEmails.basic,
    testData.invalidPasswords.withoutDigits,
    testData.invalidPasswords.withoutDigits
  );
  await registerPage.submit();
  await expect(page.getByText(/парол|цифр/i)).toBeVisible({ timeout: 3000 });
});

  test('R-P7: Пароль без заглавных букв — ошибка', async ({ page }) => {
  await registerPage.fillForm(
    testData.validEmails.basic,
    testData.invalidPasswords.withoutUppercase,
    testData.invalidPasswords.withoutUppercase
  );
  await registerPage.submit();
  await expect(page.getByText(/парол|заглавн/i)).toBeVisible({ timeout: 3000 });
});

test('R-P8: Пароль без спецсимволов — ошибка', async ({ page }) => {
  await registerPage.fillForm(
    testData.validEmails.basic,
    testData.invalidPasswords.withoutSpecial,
    testData.invalidPasswords.withoutSpecial
  );
  await registerPage.submit();
  await expect(page.getByText(/парол|спецсимвол/i)).toBeVisible({ timeout: 3000 });
});

test('R-P9: Пароль из кириллицы — ошибка', async ({ page }) => {
  await registerPage.fillForm(
    testData.validEmails.basic,
    testData.invalidPasswords.cyrillic,
    testData.invalidPasswords.cyrillic
  );
  await registerPage.submit();
  await expect(page.getByText(/парол|кирилл/i)).toBeVisible({ timeout: 3000 });
});

test('R-P10: Пароль из эмодзи — ошибка', async ({ page }) => {
  await registerPage.fillForm(
    testData.validEmails.basic,
    testData.invalidPasswords.emoji,
    testData.invalidPasswords.emoji
  );
  await registerPage.submit();
  await expect(page.getByText(/парол/i)).toBeVisible({ timeout: 3000 });
});

test('R-P11: Пароль очень длинный (300+) — ошибка', async ({ page }) => {
  await registerPage.fillForm(
    testData.validEmails.basic,
    testData.invalidPasswords.tooLong,
    testData.invalidPasswords.tooLong
  );
  await registerPage.submit();
  await expect(page.getByText(/парол|длин/i)).toBeVisible({ timeout: 3000 });
});

test('R-P15: Пароли не совпадают — ошибка', async ({ page }) => {
  await registerPage.fillForm(
    testData.validEmails.basic,
    testData.mismatchedPasswords.first,
    testData.mismatchedPasswords.second
  );
  await registerPage.submit();
  await expect(page.getByText(/совпад|парол/i)).toBeVisible({ timeout: 3000 });
});


test('R-P16: Пароли отличаются регистром — ошибка', async ({ page }) => {
  await registerPage.fillForm(
    testData.validEmails.basic,
    testData.mismatchedPasswords.first,
    testData.mismatchedPasswords.caseDifferent
  );
  await registerPage.submit();
  await expect(page.getByText(/совпад|парол/i)).toBeVisible({ timeout: 3000 });
});
});