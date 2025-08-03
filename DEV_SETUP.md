# Настройка для разработки

## Проблема с Telegram Login Widget в dev режиме

Telegram Login Widget требует:

- Правильно настроенного бота
- Настроенного домена в @BotFather
- HTTPS (в продакшене)

В режиме разработки это сложно настроить, поэтому мы добавили **альтернативное решение**.

## Решение для разработки

### 1. Автоматическое определение

Система автоматически определяет режим:

- **DEV режим** → тестовая авторизация
- **PROD режим** → настоящий Telegram Login Widget

### 2. Тестовая авторизация

В dev режиме при ошибке виджета показывается:

- Модальное окно "Режим разработки"
- Кнопка "Тестовая авторизация (Dev)"
- Получение тестового токена с backend

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# API URL для разработки
VITE_API_URL=http://localhost:3001

# Имя Telegram бота (для продакшена)
VITE_TELEGRAM_NAME=your_bot_username
```

## Как это работает

### В dev режиме:

1. **Пользователь нажимает** "Войти через Telegram"
2. **Показывается Telegram Login Widget**
3. **При ошибке** (Username invalid) → показывается dev модальное окно
4. **Пользователь нажимает** "Тестовая авторизация (Dev)"
5. **Backend генерирует** тестовый токен
6. **Токен сохраняется** в localStorage
7. **Перенаправление** на главную страницу

### В prod режиме:

1. **Пользователь нажимает** "Войти через Telegram"
2. **Показывается Telegram Login Widget**
3. **Пользователь авторизуется** через Telegram
4. **Обработка данных** на backend
5. **Сохранение токена** и перенаправление

## Backend настройка

### 1. Переменные окружения

Добавьте в backend `.env`:

```env
# Telegram Bot Token (для продакшена)
TELEGRAM_BOT_TOKEN=your_bot_token_here

# JWT Secret
JWT_SECRET=your_jwt_secret_here
```

### 2. Инициализация Telegram

В `backend/src/index.ts` добавьте:

```typescript
import { TelegramUtils } from './utils/telegram.js';

// Инициализируем только если есть токен
if (process.env.TELEGRAM_BOT_TOKEN) {
  TelegramUtils.initialize(process.env.TELEGRAM_BOT_TOKEN);
}
```

## Тестирование

### 1. Dev режим

```bash
# Frontend
npm run dev

# Backend
cd backend
npm run dev
```

1. Откройте `http://localhost:5173`
2. Нажмите "Войти через Telegram"
3. При ошибке виджета нажмите "Тестовая авторизация (Dev)"
4. Проверьте, что токен сохранился в localStorage

### 2. Prod режим

```bash
# Соберите проект
npm run build

# Запустите продакшен сервер
npm run preview
```

## Отладка

### 1. Проверка переменных окружения

```javascript
// В консоли браузера
console.log(import.meta.env.VITE_API_URL);
console.log(import.meta.env.VITE_TELEGRAM_NAME);
console.log(import.meta.env.DEV);
```

### 2. Проверка backend

```bash
# Проверьте endpoint тестового токена
curl http://localhost:3001/api/auth/test-token
```

### 3. Логи backend

Следите за логами backend для отладки:

- Запросы к `/api/auth/test-token`
- Ошибки инициализации Telegram
- Проблемы с JWT токенами

## Переход к продакшену

### 1. Настройка бота

1. Создайте бота через @BotFather
2. Настройте домен командой `/setdomain`
3. Добавьте токен в переменные окружения

### 2. Обновление переменных

```env
# Prod переменные
VITE_API_URL=https://your-domain.com
VITE_TELEGRAM_NAME=your_bot_username
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

### 3. HTTPS

Убедитесь, что в продакшене используется HTTPS:

- Telegram требует HTTPS для Login Widget
- Настройте SSL сертификат
- Обновите домен в @BotFather

## Структура файлов

```
├── src/
│   ├── components/
│   │   └── TelegramAuthButton.tsx  # Универсальная кнопка с dev fallback
│   └── pages/
│       └── Home.tsx                # Использует переменные окружения
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── authController.ts   # Тестовый токен endpoint
│   │   └── services/
│   │       └── authService.ts      # Генерация тестового токена
│   └── .env                        # Backend переменные
├── .env.example                    # Пример переменных
└── DEV_SETUP.md                   # Эта инструкция
```

## Возможные проблемы

### 1. "Username invalid"

**Причина:** Бот не настроен или неправильное имя
**Решение:** Используйте тестовую авторизацию в dev режиме

### 2. "Widget not loading"

**Причина:** Проблемы с доменом или HTTPS
**Решение:** Проверьте настройки в @BotFather

### 3. "Backend connection failed"

**Причина:** Backend не запущен или неправильный URL
**Решение:** Проверьте `VITE_API_URL` и запуск backend

### 4. "Test token failed"

**Причина:** Проблемы с backend
**Решение:** Проверьте логи backend и endpoint `/api/auth/test-token`

## Заключение

Эта система позволяет:

- **Разрабатывать локально** без настройки Telegram бота
- **Тестировать функциональность** с тестовыми токенами
- **Плавно переходить к продакшену** с настоящим Telegram Login Widget
- **Отлаживать проблемы** с подробными логами
