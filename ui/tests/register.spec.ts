import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { testData } from '../fixtures/testData';

test.describe('Регистрация (US-1)', () => {
  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });

  // Позитивные
  test('R-1: Успешная регистрация (демо-режим)', async ({ page }) => {
    await registerPage.fillForm(
      testData.validEmail,
      testData.validPassword,
      testData.validPassword
    );
    await registerPage.submit();
    await expect(page.getByText(/успешн/i)).toBeVisible();
  });

  // Негативные
  test('R-2: Некорректный email — ошибка', async ({ page }) => {
    await registerPage.fillForm(
      testData.invalidEmail,
      testData.validPassword,
      testData.validPassword
    );
    await registerPage.submit();
    await expect(page.getByText(/email/i)).toBeVisible();
  });

  test('R-3: Короткий пароль — кнопка неактивна или ошибка', async () => {
    await registerPage.fillForm(
      testData.validEmail,
      testData.shortPassword,
      testData.shortPassword
    );
    const isDisabled = await registerPage.submitButton.isDisabled();
    const hasError = await registerPage.page.getByText(/пароль/i).isVisible().catch(() => false);
    expect(isDisabled || hasError).toBeTruthy();
  });

  test('R-4: Пароль ровно 8 символов — форма валидна', async () => {
    await registerPage.fillForm(
      testData.validEmail,
      'Pass1234',
      'Pass1234'
    );
    await expect(registerPage.submitButton).toBeEnabled();
  });

  test('R-5: Пароль 7 символов — кнопка неактивна или ошибка', async () => {
    await registerPage.fillForm(
      testData.validEmail,
      'Pass123',
      'Pass123'
    );
    const isDisabled = await registerPage.submitButton.isDisabled();
    const hasError = await registerPage.page.getByText(/пароль/i).isVisible().catch(() => false);
    expect(isDisabled || hasError).toBeTruthy();
  });

  test('R-6: Некорректный email (без @) — ошибка', async ({ page }) => {
    await registerPage.fillForm('userexample.com', testData.validPassword, testData.validPassword);
    await registerPage.submit();
    await expect(page.getByText(/email/i)).toBeVisible();
  });

  test('R-7: Пустые поля — форма не отправляется', async () => {
    await registerPage.submit();
    await expect(registerPage.page).toHaveURL(/\/register/);
  });

  // Пароли не совпадают
  test('R-8: Пароли не совпадают — ошибка', async ({ page }) => {
    await registerPage.fillForm(
      testData.validEmail,
      testData.validPassword,
      'DifferentPass123'
    );
    await registerPage.submit();
    await expect(page.getByText(/совпад|парол/i)).toBeVisible();
  });
});