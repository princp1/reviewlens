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

  async mockLogin() {
    await this.page.goto('/');
    await this.page.evaluate(() => {
      localStorage.setItem('accessToken', 'fake-jwt-token-for-tests');
    });
  }
}