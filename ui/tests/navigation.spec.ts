import { test, expect, Page } from '@playwright/test';
import { HeaderPage } from '../pages/HeaderPage';

const TEST_EMAIL = 'name12@mail.ru';
const TEST_PASSWORD = '1234567q';

async function loginByAccount(page: Page, username: string, password: string) {
  const response = await page.request.post('http://87.242.102.114/api/v1/auth/login', {
    data: { username, password },
  });
  const { accessToken, refreshToken } = await response.json();

  await page.goto('/');
  await page.evaluate(
    ({ email, access, refresh }) => {
      const sessionId = `${Date.now()}-${Math.floor(Math.random() * 1e9)}`;
      localStorage.setItem(
        'reviewlens-session',
        JSON.stringify({
          state: {
            account: { email, registeredAt: new Date().toISOString() },
            sessionId,
            token: access,
          },
          version: 0,
        })
      );
      sessionStorage.setItem(
        'reviewlens-refresh-session',
        JSON.stringify({ refreshToken: refresh, sessionId })
      );
    },
    { email: username, access: accessToken, refresh: refreshToken }
  );
}

test.describe('Навигация без авторизации (гость)', () => {
  test('Переход с главной на /login через header', async ({ page }) => {
    await page.goto('/');
    const header = new HeaderPage(page);
    await header.loginLink.click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('Переход с главной на /register через header', async ({ page }) => {
    await page.goto('/');
    const header = new HeaderPage(page);
    await header.registerLink.click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('Прямой переход на /analysis/new без токена редиректит на /login', async ({ page }) => {
    await page.goto('/analysis/new');
    await expect(page).toHaveURL(/\/login/);
  });

  test('AS-6: Прямой переход на /history без токена редиректит на /login', async ({ page }) => {
    await page.goto('/history');
    await expect(page).toHaveURL(/\/login/);
  });

  test('Прямой переход на /profile без токена редиректит на /login', async ({ page }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe('Навигация авторизованного пользователя', () => {
  test.beforeEach(async ({ page }) => {
    await loginByAccount(page, TEST_EMAIL, TEST_PASSWORD);
  });

  test('Переход на /analysis/new через header', async ({ page }) => {
    await page.goto('/history');
    const header = new HeaderPage(page);
    await header.newAnalysisLink.click();
    await expect(page).toHaveURL(/\/analysis\/new/);
  });

  test('Переход на /history через header', async ({ page }) => {
    await page.goto('/analysis/new');
    const header = new HeaderPage(page);
    await header.historyLink.click();
    await expect(page).toHaveURL(/\/history/);
  });

  test('Переход в /profile через меню аккаунта', async ({ page }) => {
    await page.goto('/analysis/new');
    await page.locator('[data-testid="header-account-menu"]').click();
    await page.locator('.account-menu a[href="/profile"]').click();
    await expect(page).toHaveURL(/\/profile/);
  });
});