import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  get emailInput() {
    return this.page.locator('[data-testid="login-email"]');
  }

  get passwordInput() {
    return this.page.locator('[data-testid="login-password"]');
  }

  get submitButton() {
    return this.page.locator('[data-testid="login-submit"]');
  }

  async fillForm(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async expectLoaded() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }
}