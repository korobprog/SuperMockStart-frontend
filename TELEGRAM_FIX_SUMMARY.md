# Исправления Telegram авторизации

## Проблемы, которые были исправлены

### 1. Ошибка 401 Unauthorized
**Причина**: NODE_ENV не была установлена в продакшене, поэтому система работала в development режиме

**Исправление**: 
- Добавлена `NODE_ENV=production` в `env.prod` и `env.dokploy`
- Теперь бот корректно определяет production среду

### 2. Использование localhost вместо правильного URL
**Причина**: В коде были захардкожены ссылки на `http://localhost:5173`

**Исправления**:
- В `backend/src/services/telegramBotService.ts`: используется `process.env.FRONTEND_URL`
- В `backend/src/routes/telegramBot.ts`: используется `process.env.FRONTEND_URL`
- Теперь в продакшене используется `https://supermock.ru`

### 3. Улучшение UX в боте
**Изменение**: Заменены текстовые ссылки на интерактивные кнопки

**В development режиме**:
- 🌐 Кнопка "Открыть приложение" → FRONTEND_URL
- 🔐 Кнопка "Страница авторизации" → FRONTEND_URL/bot-auth?userId=X

**В production режиме**:
- 🔐 Кнопка "Авторизоваться в приложении" (Login URL)
- 📱 Кнопка "Открыть в Telegram" (Web App)

## Файлы, которые были изменены

1. `backend/src/services/telegramBotService.ts`
2. `backend/src/routes/telegramBot.ts`
3. `env.prod`
4. `env.dokploy`

## Как деплоить

```bash
./deploy-telegram-fix.sh
```

## Проверка работы

1. Откройте Telegram бота
2. Отправьте команду `/start`
3. В продакшене должны появиться кнопки с правильными ссылками на https://supermock.ru
4. Авторизация должна работать без ошибок 401

## Переменные окружения

Убедитесь, что в продакшене установлены:
- `NODE_ENV=production`
- `FRONTEND_URL=https://supermock.ru`
- `BACKEND_URL=https://api.supermock.ru`