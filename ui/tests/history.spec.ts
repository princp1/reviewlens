import { test, expect } from '@playwright/test';
import { HistoryPage } from '../pages/HistoryPage';

test.describe('История анализов (US-12)', () => {
  let historyPage: HistoryPage;

  test.beforeEach(async ({ page }) => {
    historyPage = new HistoryPage(page);
  });

  test('H-1: Доступ без авторизации → редирект на /login', async ({ page }) => {
    await historyPage.goto();
    await expect(page).toHaveURL(/\/login/);
  });

  test('H-2: Доступ с авторизацией', async ({ page }) => {
    await historyPage.loginByAccount();
    await historyPage.goto();

    await expect(page).toHaveURL(/\/history/);
  });

  test('H-3: Пустое состояние (нет анализов)', async ({ page }) => {
    // Создаём чистого пользователя специально для этого теста,
    // чтобы история гарантированно была пустой при повторных прогонах
    const freshEmail = `qa_empty_hist_${Date.now()}_${Math.random().toString(36).slice(2, 6)}@example.com`;
    await historyPage.loginByAccount(freshEmail, 'Password123');
    await historyPage.goto();

    await expect(historyPage.emptyStateMessage).toBeVisible({ timeout: 5000 });
  });
});