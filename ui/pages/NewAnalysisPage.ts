import { Page, expect } from '@playwright/test';

export class NewAnalysisPage {
  constructor(public page: Page) {}

  async goto() {
    await this.page.goto('/analysis/new');
  }

  // Локаторы (используем data-testid, которые должна добавить Яна)
  get urlInput() {
    return this.page.locator('[data-testid="analysis-url-input"]');
  }

  get submitButton() {
    return this.page.locator('[data-testid="analysis-submit"]');
  }

  get loader() {
    return this.page.locator('[data-testid="analysis-loader"]');
  }

  async fillUrl(url: string) {
    await this.urlInput.fill(url);
  }

  async submit() {
    await this.submitButton.click();
  }

  // Метод для мока авторизации (чтобы пройти защиту роута)
  async mockLogin() {
    await this.page.goto('/');
    await this.page.evaluate(() => {
      localStorage.setItem('accessToken', 'fake-jwt-token-for-tests');
    });
  }
}