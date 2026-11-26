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
  
  get logoutMenuItem() {
    return this.page.getByText(/Выйти/i);
  }

  get historyButton() {
    return this.page.getByText(/Перейти к истории/i);
  }

  async loginViaApi(username: string, password: string) {  
    await this.page.goto('/login');
    await this.page.fill('input[type="email"], input[name="email"]', username);
    await this.page.fill('input[type="password"], input[name="password"]', password);
    await this.page.click('button[type="submit"]');
    // Ждём, пока сам фронтенд после успешного логина переведёт на /analysis/new
    await this.page.waitForURL(/\/analysis\/new/, { timeout: 7000 });
  }

  async logout() {
    await this.page.locator('[data-testid="header-account-menu"]').click();
    await this.page.locator('.account-menu button', { hasText: 'Выйти' }).click();
    //await this.logoutMenuItem.click();
  }
}