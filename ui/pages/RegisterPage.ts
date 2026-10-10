import { Page, expect } from '@playwright/test';

export class RegisterPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/register');
  }

  get emailInput() {
    return this.page.locator('[data-testid="register-email"]');
  }

  get passwordInput() {
    return this.page.locator('[data-testid="register-password"]');
  }

  get confirmPasswordInput() {
    return this.page.locator('[data-testid="register-confirm-password"]');
  }

  get submitButton() {
    return this.page.locator('[data-testid="register-submit"]');
  }

  async fillForm(email: string, password: string, confirmPassword: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
  }

  async submit() {
    await this.submitButton.click();
  }

  async expectLoaded() {
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.confirmPasswordInput).toBeVisible();
    await expect(this.submitButton).toBeVisible();
  }
}