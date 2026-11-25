import { test, expect } from '@playwright/test';
import { NewAnalysisPage } from '../pages/NewAnalysisPage';

test.describe('Новый анализ (US-15)', () => {
  let analysisPage: NewAnalysisPage;

  test.beforeEach(async ({ page }) => {
    analysisPage = new NewAnalysisPage(page);
  });

  test('NA-1: Доступ без авторизации → редирект на /login', async ({ page }) => {
    await analysisPage.goto();
    await expect(page).toHaveURL(/\/login/);
  });

  test('NA-2: Доступ с авторизацией', async ({ page }) => {
    await analysisPage.mockLogin();
    await analysisPage.goto();
    
    await expect(page).toHaveURL(/\/analysis\/new/);
    await expect(analysisPage.urlInput).toBeVisible();
  });

  test('NA-3: Пустой URL — ошибка', async ({ page }) => {
    await analysisPage.mockLogin();
    await analysisPage.goto();
    
    await analysisPage.submit();
    await expect(page.getByText(/Введите ссылку/i)).toBeVisible();
  });

  test('NA-4: Невалидный URL — ошибка', async ({ page }) => {
    await analysisPage.mockLogin();
    await analysisPage.goto();
    
    await analysisPage.fillUrl('not-a-url');
    await analysisPage.submit();
    await expect(page.getByText(/Некорректная ссылка/i)).toBeVisible();
  });

  test('NA-5: Ссылка не на Otzovik — ошибка', async ({ page }) => {
    await analysisPage.mockLogin();
    await analysisPage.goto();
    
    await analysisPage.fillUrl('https://market.yandex.ru/product/123');
    await analysisPage.submit();
    await expect(page.getByText(/Поддерживается только Otzovik/i)).toBeVisible();
  });

  test('NA-6: Успешная отправка → редирект на /processing', async ({ page }) => {
    await analysisPage.mockLogin();
    await analysisPage.goto();
    
    await analysisPage.fillUrl('https://otzovik.com/reviews/smartphone_apple_iphone_duo/');
    await analysisPage.submit();
    
    // Проверяем либо лоадер, либо редирект (в зависимости от мока фронта)
    await expect(page).toHaveURL(/\/analysis\/processing/, { timeout: 5000 });
  });
});