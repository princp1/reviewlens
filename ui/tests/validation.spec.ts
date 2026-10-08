import { test, expect } from '@playwright/test';
import { RegisterPage } from '../pages/RegisterPage';
import { LoginPage } from '../pages/LoginPage';

test.describe('Валидация форм', () => {
  test('Регистрация: кнопка неактивна при пустых полях', async ({ page }) => {
    const reg = new RegisterPage(page);
    await reg.goto();
    await expect(reg.submitButton).toBeDisabled();
  });

  test('Регистрация: email в верхнем регистре принимается', async ({ page }) => {
    const reg = new RegisterPage(page);
    await reg.goto();
    await reg.fillForm('USER@EXAMPLE.COM', 'Password123', 'Password123');
    await expect(reg.submitButton).toBeEnabled();
  });

  test('Логин: кнопка неактивна при пустых полях', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await expect(login.submitButton).toBeDisabled();
  });

  test('Логин: форма принимает email с "+" (алиас)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.fillForm('user+test@example.com', 'Password123');
    await expect(login.submitButton).toBeEnabled();
  });
});