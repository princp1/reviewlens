import { Page, expect } from '@playwright/test';

export class HeaderPage {
  constructor(private page: Page) {}

  get loginLink() {
    return this.page.locator('[data-testid="header-login"]');
  }

  get registerLink() {
    return this.page.locator('[data-testid="header-register"]');
  }

  get newAnalysisLink() {
    return this.page.locator('[data-testid="header-new-analysis"]');
  }

  get historyLink() {
    return this.page.locator('[data-testid="header-history"]');
  }

  get accountMenu() {
    return this.page.locator('[data-testid="header-account-menu"]');
  }
}