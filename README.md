## autotests
### Description
...
# Автотесты проекта «Анализ отзывов с маркетплейсов»

Репозиторий для хранения автотестов QA.

## Структура

- `api/` — тесты API (Postman-коллекции или Pytest)
- `ui/` — UI-тесты (Playwright)
- `fixtures/` — тестовые данные

## Как запустить

### UI-тесты (Playwright)

1. Установить зависимости:
npm install
2. Запустить все тесты:
npx playwright test
3. Посмотреть отчёт:
npx playwright show-report


### API-тесты


## Переменные окружения

Создай файл `.env` в корне и добавь:
BASE_URL=http://localhost:3000
API_URL=http://localhost:8000/api