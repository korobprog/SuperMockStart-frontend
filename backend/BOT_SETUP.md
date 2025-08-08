# Настройка Telegram ботов для SuperMock

## Обзор

У вас есть два бота:

1. **Development бот** - для тестирования в режиме разработки
2. **Production бот** - для продакшн среды

## Конфигурация

### Development бот (env.backend)

```
TELEGRAM_TOKEN=8464088869:AAFcZb7HmYQJa6vaYjfTDCjfr187p9hhk2o
BOT_USERNAME=SuperMockTest_bot
NODE_ENV=development
```

### Production бот (env.prod)

```
TELEGRAM_TOKEN=8464088869:AAFcZb7HmYQJa6vaYjfTDCjfr187p9hhk2o
BOT_USERNAME=SuperMock_bot
NODE_ENV=production
```

## Запуск ботов

### Development бот

```bash
# Запуск только бота
pnpm dev:bot

# Запуск полного бэкенда с ботом
pnpm dev
```

### Production бот

```bash
# Запуск production бота
NODE_ENV=production pnpm prod:bot

# Или через скрипт
pnpm prod:bot
```

## Тестирование

### Development режим

1. Перейдите на http://localhost:5173/bot-auth-test
2. Нажмите "Войти через Telegram бота"
3. Отправьте `/start` боту
4. Бот должен отправить сообщение с инструкцией для development

### Production режим

1. Перейдите на https://supermock.ru/bot-auth-test
2. Нажмите "Войти через Telegram бота"
3. Отправьте `/start` боту
4. Бот должен отправить кнопку для авторизации через Login Widget

## Различия между режимами

### Development режим

- Использует **polling** для получения сообщений
- Отправляет простые текстовые сообщения
- Работает с localhost
- Использует тестовые токены

### Production режим

- Использует **webhook** для получения сообщений
- Отправляет кнопки с Login Widget
- Работает с production доменами
- Использует production токены

## Решение проблем

### Ошибка 409 (Conflict)

Если получаете ошибку 409, это означает, что уже запущен другой экземпляр бота с тем же токеном.

**Решение:**

1. Остановите все процессы Node.js
2. Убедитесь, что используете правильный токен для нужного режима
3. Запустите бота заново

### Бот не отправляет сообщения

1. Проверьте, что токен правильный
2. Убедитесь, что бот инициализирован
3. Проверьте логи на наличие ошибок

### Webhook не работает в production

1. Убедитесь, что порт 8443 открыт
2. Проверьте, что домен правильно настроен
3. Убедитесь, что SSL сертификат валидный

## Структура файлов

```
backend/
├── env.backend          # Конфигурация development бота
├── env.prod            # Конфигурация production бота
├── start-bot.js        # Скрипт запуска бота
├── src/services/telegramBotService.ts  # Основной сервис бота
└── BOT_SETUP.md        # Эта инструкция
```

## Команды для запуска

```bash
# Development
cd backend
pnpm dev:bot

# Production
cd backend
NODE_ENV=production pnpm prod:bot
```
