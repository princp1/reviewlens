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
    await historyPage.loginByAccount('name12@mail.ru', '1234567q');
    await historyPage.goto();
    
    await expect(page).toHaveURL(/\/history/);
  });

  test('H-3: Пустое состояние (нет анализов)', async ({ page }) => {
    await historyPage.loginByAccount('name12@mail.ru', '1234567q');
    await historyPage.goto();
    
    // Если у пользователя нет анализов, должен быть текст пустого состояния
    await expect(historyPage.emptyStateMessage).toBeVisible({ timeout: 5000 });
  });

  /*test('H-4: Отображение списка анализов', async ({ page }) => {
    await historyPage.loginByAccount('name12@mail.ru', '1234567q');
    await historyPage.goto();
    
    // Проверяем, что карточки анализов (или таблица) отображаются
    await expect(historyPage.analysisCards.first()).toBeVisible({ timeout: 5000 });
  });*/
});