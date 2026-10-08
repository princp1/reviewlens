import { Page, expect } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  get startButton() {
    return this.page.locator('[data-testid="home-start"]');
  }

  get loginButton() {
    return this.page.locator('[data-testid="home-login"]');
  }

  async expectLoaded() {
    await expect(this.startButton).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }
}