import { Page, expect } from '@playwright/test';

export class NewAnalysisPage {
  constructor(public page: Page) {}

  async goto() {
    await this.page.goto('/analysis/new');
  }

  // Локаторы (используем data-testid, которые должна добавить Яна)
  get urlInput() {
    return this.page.locator('[data-testid="analysis-url"]');
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

  async loginByAccount(username: string, password: string) {
    await this.page.goto('/login');
    await this.page.fill('input[type="email"], input[name="email"]', username);
    await this.page.fill('input[type="password"], input[name="password"]', password);
    await this.page.click('button[type="submit"]');
    // Ждём, пока сам фронтенд после успешного логина переведёт на /analysis/new
    await this.page.waitForURL(/\/analysis\/new/, { timeout: 7000 });}
}