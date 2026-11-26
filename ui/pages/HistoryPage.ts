import { Page } from '@playwright/test';

const API_URL = process.env.API_URL || 'http://87.242.102.114/api/v1';

export class HistoryPage {
  constructor(public page: Page) {}

  async goto() {
    await this.page.goto('/history');
  }

  get analysisList() {
    return this.page.locator('[data-testid="history-list"]');
  }

  get emptyStateMessage() {
    return this.page.getByText(/Вы ещё не выполняли анализ/i);
  }

  get analysisCards() {
    return this.page.locator('[data-testid="history-item"]');
  }

  async loginByAccount(
    username: string = process.env.TEST_EMAIL || '',
    password: string = process.env.TEST_PASSWORD || ''
  ) {
    if (!username || !password) {
      throw new Error('Не заданы TEST_EMAIL и TEST_PASSWORD в переменных окружения');
    }

    let response = await this.page.request.post(`${API_URL}/auth/login`, {
      data: { username, password },
    });

    if (response.status() === 401 || response.status() === 404) {
      response = await this.page.request.post(`${API_URL}/auth/register`, {
        data: { username, password },
      });
    }

    if (!response.ok()) {
      throw new Error(`Ошибка авторизации (${response.status()}): ${await response.text()}`);
    }

    const { accessToken, refreshToken } = await response.json();

    await this.page.goto('/');
    await this.page.evaluate(
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
}