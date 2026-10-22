import { Page, expect } from '@playwright/test';

export class ProfilePage {
  constructor(public page: Page) {}

  async goto() {
    await this.page.goto('/profile');
  }

  // Локаторы (используем data-testid, если есть, или fallback на текст/роли)
  get emailText() {
    return this.page.getByText(/@/).first(); // Ищем текст с собачкой (email)
  }

  get logoutButton() {
    // Если кнопка в меню, сначала нужно открыть меню
    return this.page.locator('[data-testid="header-account-menu"]');
  }
  
  get logoutMenuItem() {
    return this.page.getByText(/Выйти/i);
  }

  get historyButton() {
    return this.page.getByText(/Перейти к истории/i);
  }

  // Метод для авторизации через localStorage (мок)
  async mockLogin() {
    await this.page.goto('/');
    await this.page.evaluate(() => {
      localStorage.setItem('accessToken', 'fake-jwt-token-for-tests');
      localStorage.setItem('refreshToken', 'fake-refresh-token');
    });
  }

  async logout() {
    await this.logoutButton.click();
    await this.logoutMenuItem.click();
  }
}