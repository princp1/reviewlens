import { Page, expect } from '@playwright/test';

export class HistoryPage {
  constructor(public page: Page) {}

  async goto() {
    await this.page.goto('/history');
  }

  get analysisList() {
    return this.page.locator('[data-testid="history-list"]');
  }

  get emptyStateMessage() {
    return this.page.getByText(/Вы ещё не выполняли анализ/i);
  }

  get analysisCards() {
    return this.page.locator('[data-testid="history-item"]');
  }

  async loginByAccount(username: string, password: string) {
    await this.page.goto('/login');
    await this.page.fill('input[type="email"], input[name="email"]', username);
    await this.page.fill('input[type="password"], input[name="password"]', password);
    await this.page.click('button[type="submit"]');
    // Ждём, пока сам фронтенд после успешного логина переведёт на /analysis/new
    await this.page.waitForURL(/\/analysis\/new/, { timeout: 7000 });}
}